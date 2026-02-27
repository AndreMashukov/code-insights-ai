import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { 
  GenerateFlashcardsRequest,
  GenerateFlashcardsResponse,
  GetFlashcardSetsResponse,
  GetFlashcardSetResponse,
  UpdateStudyProgressRequest,
  UpdateStudyProgressResponse,
  FlashcardSet,
  Flashcard,
} from '@shared-types';
import { GeminiService } from '../services/gemini/gemini';
import { FirestoreService } from '../services/firestore';

const db = admin.firestore();

/**
 * Generate flashcards from a document using Gemini AI
 */
export const generateFlashcards = onRequest({ cors: true }, async (req, res) => {
  try {
    const { documentId, title, description, difficulty, tags, ruleIds } = 
      req.body as GenerateFlashcardsRequest;

    if (!documentId) {
      res.status(400).json({ error: 'documentId is required' });
      return;
    }

    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      res.status(401).json({ error: 'User ID is required' });
      return;
    }

    // Fetch the document
    const document = await FirestoreService.getDocument(userId, documentId);
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    // Fetch document content
    const content = await FirestoreService.getDocumentContent(userId, documentId);

    // Generate flashcards using Gemini
    const flashcardData = await GeminiService.generateFlashcards(
      {
        title: document.title,
        content: content,
        wordCount: document.wordCount || content.split(/\s+/).length,
      },
      {
        difficulty: difficulty || 'intermediate',
        customInstructions: ruleIds ? await formatRules(ruleIds) : undefined,
      }
    );

    // Create flashcard set document
    const setId = db.collection('flashcardSets').doc().id;
    const flashcardSet: FlashcardSet = {
      id: setId,
      documentId,
      title: title || `Flashcards: ${document.title}`,
      description: description || `AI-generated flashcards from ${document.title}`,
      cardCount: flashcardData.flashcards.length,
      userId: req.headers['x-user-id'] as string || undefined,
      difficulty: difficulty || 'intermediate',
      tags: tags || [],
      createdAt: new Date(),
      masteryLevel: 0,
      documentTitle: document.title,
    };

    // Create flashcard documents
    const flashcards: Flashcard[] = flashcardData.flashcards.map((card, index) => ({
      id: `${setId}-${index}`,
      setId,
      front: card.front,
      back: card.back,
      difficulty: card.difficulty,
      tags: card.tags || [],
      createdAt: new Date(),
      studyCount: 0,
      correctCount: 0,
      interval: 1, // Start with 1 day interval
    }));

    // Save to Firestore
    const batch = db.batch();
    batch.set(db.collection('flashcardSets').doc(setId), flashcardSet);
    flashcards.forEach((card) => {
      batch.set(db.collection('flashcards').doc(card.id), card);
    });
    await batch.commit();

    const response: GenerateFlashcardsResponse = {
      setId,
      flashcardSet,
      flashcards,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ 
      error: 'Failed to generate flashcards',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get all flashcard sets for a user or document
 */
export const getFlashcardSets = onRequest({ cors: true }, async (req, res) => {
  try {
    const { userId, documentId } = req.query as { userId?: string; documentId?: string };
    
    let query = db.collection('flashcardSets') as admin.firestore.Query;
    
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    if (documentId) {
      query = query.where('documentId', '==', documentId);
    }
    
    query = query.orderBy('createdAt', 'desc');
    
    const snapshot = await query.get();
    const flashcardSets = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        lastStudiedAt: data.lastStudiedAt?.toDate(),
      } as FlashcardSet;
    });

    const response: GetFlashcardSetsResponse = { flashcardSets };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting flashcard sets:', error);
    res.status(500).json({ error: 'Failed to get flashcard sets' });
  }
});

/**
 * Get a single flashcard set with all its flashcards
 */
export const getFlashcardSet = onRequest({ cors: true }, async (req, res) => {
  try {
    const { setId } = req.query as { setId: string };
    
    if (!setId) {
      res.status(400).json({ error: 'setId is required' });
      return;
    }

    // Get the flashcard set
    const setDoc = await db.collection('flashcardSets').doc(setId).get();
    if (!setDoc.exists) {
      res.status(404).json({ error: 'Flashcard set not found' });
      return;
    }

    const setData = setDoc.data()!;
    const flashcardSet = {
      ...setData,
      createdAt: setData.createdAt.toDate(),
      lastStudiedAt: setData.lastStudiedAt?.toDate(),
    } as FlashcardSet;

    // Get all flashcards in the set
    const cardsSnapshot = await db
      .collection('flashcards')
      .where('setId', '==', setId)
      .get();

    const flashcards = cardsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt.toDate(),
        lastStudyDate: data.lastStudyDate?.toDate(),
        nextReviewDate: data.nextReviewDate?.toDate(),
      } as Flashcard;
    });

    const response: GetFlashcardSetResponse = { flashcardSet, flashcards };
    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting flashcard set:', error);
    res.status(500).json({ error: 'Failed to get flashcard set' });
  }
});

/**
 * Update study progress for a flashcard (spaced repetition)
 */
export const updateStudyProgress = onRequest({ cors: true }, async (req, res) => {
  try {
    const { flashcardId, setId, isCorrect, studyDuration } = 
      req.body as UpdateStudyProgressRequest;

    if (!flashcardId || !setId || isCorrect === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Get current flashcard state
    const cardDoc = await db.collection('flashcards').doc(flashcardId).get();
    if (!cardDoc.exists) {
      res.status(404).json({ error: 'Flashcard not found' });
      return;
    }

    const currentCard = cardDoc.data() as Flashcard;
    
    // Calculate new spaced repetition values (simplified SM-2 algorithm)
    const newStudyCount = currentCard.studyCount + 1;
    const newCorrectCount = currentCard.correctCount + (isCorrect ? 1 : 0);
    const accuracy = newCorrectCount / newStudyCount;
    
    // Adjust interval based on performance
    let newInterval = currentCard.interval;
    if (isCorrect) {
      if (accuracy >= 0.8) {
        newInterval = Math.min(currentCard.interval * 2, 30); // Max 30 days
      } else if (accuracy >= 0.6) {
        newInterval = Math.min(currentCard.interval * 1.5, 21);
      } else {
        newInterval = Math.max(currentCard.interval * 0.8, 1);
      }
    } else {
      newInterval = 1; // Reset to 1 day if incorrect
    }

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + Math.round(newInterval));

    // Update flashcard
    const updatedCard: Partial<Flashcard> = {
      studyCount: newStudyCount,
      correctCount: newCorrectCount,
      lastStudyDate: new Date(),
      nextReviewDate,
      interval: Math.round(newInterval),
    };

    await db.collection('flashcards').doc(flashcardId).update(updatedCard);

    // Update flashcard set mastery level
    const setDoc = await db.collection('flashcardSets').doc(setId).get();
    const setData = setDoc.data()!;
    const allCardsSnapshot = await db
      .collection('flashcards')
      .where('setId', '==', setId)
      .get();

    let totalMastery = 0;
    allCardsSnapshot.docs.forEach(doc => {
      const card = doc.data();
      const cardAccuracy = card.studyCount > 0 ? card.correctCount / card.studyCount : 0;
      totalMastery += cardAccuracy;
    });
    const masteryLevel = (totalMastery / allCardsSnapshot.size) * 100;

    await db.collection('flashcardSets').doc(setId).update({
      masteryLevel: Math.round(masteryLevel),
      lastStudiedAt: new Date(),
    });

    const finalCard = { ...currentCard, ...updatedCard } as Flashcard;
    const response: UpdateStudyProgressResponse = {
      flashcard: {
        ...finalCard,
        createdAt: finalCard.createdAt instanceof admin.firestore.Timestamp 
          ? finalCard.createdAt.toDate() 
          : finalCard.createdAt,
        lastStudyDate: finalCard.lastStudyDate instanceof admin.firestore.Timestamp
          ? finalCard.lastStudyDate.toDate()
          : finalCard.lastStudyDate,
        nextReviewDate: finalCard.nextReviewDate instanceof admin.firestore.Timestamp
          ? finalCard.nextReviewDate.toDate()
          : finalCard.nextReviewDate,
      },
      nextReviewDate,
      masteryLevel: Math.round(masteryLevel),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error updating study progress:', error);
    res.status(500).json({ error: 'Failed to update study progress' });
  }
});

/**
 * Delete a flashcard set and all its flashcards
 */
export const deleteFlashcardSet = onRequest({ cors: true }, async (req, res) => {
  try {
    const { setId } = req.body as { setId: string };
    
    if (!setId) {
      res.status(400).json({ error: 'setId is required' });
      return;
    }

    // Delete all flashcards in the set
    const cardsSnapshot = await db
      .collection('flashcards')
      .where('setId', '==', setId)
      .get();

    const batch = db.batch();
    let deletedCount = 0;
    
    cardsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
      deletedCount++;
    });

    // Delete the flashcard set
    batch.delete(db.collection('flashcardSets').doc(setId));
    
    await batch.commit();

    res.status(200).json({ 
      success: true, 
      deletedFlashcardCount: deletedCount 
    });
  } catch (error) {
    console.error('Error deleting flashcard set:', error);
    res.status(500).json({ error: 'Failed to delete flashcard set' });
  }
});

/**
 * Format rules for Gemini prompt
 */
async function formatRules(ruleIds: string[]): Promise<string> {
  try {
    const rules = await Promise.all(
      ruleIds.map(async id => {
        const doc = await db.collection('rules').doc(id).get();
        return doc.exists ? doc.data() : null;
      })
    );
    
    return rules
      .filter(rule => rule !== null)
      .map(rule => rule!.content)
      .join('\n\n');
  } catch (error) {
    console.error('Error formatting rules:', error);
    return '';
  }
}
