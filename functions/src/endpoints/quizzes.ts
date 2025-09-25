import { onCall } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { GeminiService } from "../services/gemini";
import { FirestoreService } from "../services/firestore";
import { 
  GenerateQuizRequest, 
  GenerateQuizResponse, 
  GetQuizResponse,
  ApiResponse,
  Quiz
} from "../../libs/shared-types/src/index";

// Define secrets
const geminiApiKey = defineSecret("GEMINI_API_KEY");

/**
 * Generate Quiz from Document
 * Callable function: generateQuiz
 */
export const generateQuiz = onCall(
  {
    cors: true,
    secrets: [geminiApiKey],
    maxInstances: 5,
    timeoutSeconds: 300,
    memory: "1GiB",
  },
  async (request): Promise<ApiResponse<GenerateQuizResponse>> => {
    try {
      // Support documentId-based requests with optional quiz name and additional prompt
      const requestData = request.data as GenerateQuizRequest;
      const userId = request.auth?.uid;

      if (!requestData.documentId) {
        throw new Error("documentId is required");
      }

      const { documentId, quizName, additionalPrompt } = requestData;

      console.log(`Generating quiz from document: ${documentId}`, {
        customQuizName: !!quizName,
        hasAdditionalPrompt: !!additionalPrompt
      });
      
      // Step 1: Get document metadata
      const document = await FirestoreService.getDocument(userId!, documentId);
      
      // Step 2: Retrieve document content from Storage
      const content = await FirestoreService.getDocumentContent(userId!, documentId);
      
      // Step 3: Validate content for quiz generation
      const documentContent = {
        title: document.title,
        content: content,
        wordCount: document.wordCount || content.split(/\s+/).length,
      };
      
      GeminiService.validateContentForQuiz(documentContent);
      
      // Step 4: Generate quiz with Gemini AI (allowing multiple per document)
      console.log("Generating quiz with Gemini AI for document...");
      const geminiQuiz = await GeminiService.generateQuiz(documentContent, additionalPrompt);
      
      // Step 5: Apply custom quiz name if provided
      if (quizName && quizName.trim()) {
        geminiQuiz.title = quizName.trim();
      } else {
        // Use default naming: "Quiz from [Document Title]"
        geminiQuiz.title = `Quiz from ${document.title}`;
      }
      
      // Step 6: Save quiz with document reference
      const savedQuiz = await FirestoreService.saveQuizFromDocument(documentId, geminiQuiz, userId!);
      
      console.log(`Successfully generated quiz from document: ${savedQuiz.id}`);
      
      return {
        success: true,
        data: {
          quizId: savedQuiz.id,
          quiz: savedQuiz,
        },
      };

    } catch (error) {
      console.error("Error in generateQuiz:", error);
      
      return {
        success: false,
        error: {
          code: "GENERATION_FAILED",
          message: error instanceof Error ? error.message : "Failed to generate quiz",
        },
      };
    }
  }
);

/**
 * Get Quiz by ID
 * Callable function: getQuiz
 */
export const getQuiz = onCall(
  {
    cors: true,
  },
  async (request): Promise<ApiResponse<GetQuizResponse>> => {
    try {
      const { quizId } = request.data;
      
      if (!quizId) {
        throw new Error("Quiz ID is required");
      }

      console.log(`Fetching quiz: ${quizId}`);

      const quiz = await FirestoreService.getQuiz(quizId);
      
      if (!quiz) {
        return {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "Quiz not found",
          },
        };
      }

      return {
        success: true,
        data: {
          quiz,
        },
      };

    } catch (error) {
      console.error("Error in getQuiz:", error);
      
      return {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: error instanceof Error ? error.message : "Failed to fetch quiz",
        },
      };
    }
  }
);

/**
 * Get User's Quizzes
 * Requires authentication
 */
export const getUserQuizzes = onCall(
  {
    cors: true,
  },
  async (request): Promise<ApiResponse<{ quizzes: Quiz[] }>> => {
    try {
      const userId = request.auth?.uid;
      
      if (!userId) {
        return {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required",
          },
        };
      }

      console.log(`Fetching quizzes for user: ${userId}`);

      const quizzes = await FirestoreService.getUserQuizzes(userId);

      return {
        success: true,
        data: {
          quizzes,
        },
      };

    } catch (error) {
      console.error("Error in getUserQuizzes:", error);
      
      return {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: error instanceof Error ? error.message : "Failed to fetch user quizzes",
        },
      };
    }
  }
);

/**
 * Get Recent Public Quizzes
 */
export const getRecentQuizzes = onCall(
  {
    cors: true,
  },
  async (request): Promise<ApiResponse<{ quizzes: Quiz[] }>> => {
    try {
      const { limit = 20 } = request.data || {};

      console.log(`Fetching ${limit} recent quizzes`);

      const quizzes = await FirestoreService.getRecentQuizzes(limit);

      return {
        success: true,
        data: {
          quizzes,
        },
      };

    } catch (error) {
      console.error("Error in getRecentQuizzes:", error);
      
      return {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: error instanceof Error ? error.message : "Failed to fetch recent quizzes",
        },
      };
    }
  }
);

/**
 * Get Document Quizzes
 * Get all quizzes for a specific document
 * Requires authentication
 */
export const getDocumentQuizzes = onCall(
  {
    cors: true,
  },
  async (request): Promise<ApiResponse<{ quizzes: Quiz[] }>> => {
    try {
      const userId = request.auth?.uid;
      const { documentId } = request.data;
      
      if (!userId) {
        return {
          success: false,
          error: {
            code: "UNAUTHENTICATED",
            message: "Authentication required",
          },
        };
      }

      if (!documentId) {
        return {
          success: false,
          error: {
            code: "MISSING_PARAMETER",
            message: "documentId is required",
          },
        };
      }

      console.log(`Fetching quizzes for document: ${documentId}, user: ${userId}`);

      const quizzes = await FirestoreService.getDocumentQuizzes(documentId, userId);

      return {
        success: true,
        data: {
          quizzes,
        },
      };

    } catch (error) {
      console.error("Error in getDocumentQuizzes:", error);
      
      return {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: error instanceof Error ? error.message : "Failed to fetch document quizzes",
        },
      };
    }
  }
);