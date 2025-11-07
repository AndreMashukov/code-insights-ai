import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import {
  Directory,
  DirectoryEnhanced,
  DirectoryTreeNode,
  CreateDirectoryRequest,
  CreateDirectoryResponse,
  UpdateDirectoryRequest,
  DeleteDirectoryRequest,
  GetDirectoriesResponse,
  GetDirectoryTreeResponse,
} from '@shared-types';

const db = getFirestore();

/**
 * Authentication middleware for callable functions
 */
async function validateAuth(context: { auth?: { uid?: string } }): Promise<string> {
  if (!context.auth || !context.auth.uid) {
    throw new Error('Unauthenticated: User must be logged in');
  }
  return context.auth.uid;
}

/**
 * Build directory path from parent hierarchy
 */
async function buildDirectoryPath(userId: string, parentId: string | null): Promise<string> {
  if (!parentId) {
    return '/';
  }

  const parentDoc = await db
    .collection('users')
    .doc(userId)
    .collection('directories')
    .doc(parentId)
    .get();

  if (!parentDoc.exists) {
    throw new Error('Parent directory not found');
  }

  const parentData = parentDoc.data() as Directory;
  return parentData.path === '/' ? `/${parentData.name}` : `${parentData.path}/${parentData.name}`;
}

/**
 * Get all directories for a user with document counts
 */
export const getDirectories = onCall(
  {
    region: 'asia-east1',
    cors: true,
  },
  async (request) => {
    try {
      const userId = await validateAuth(request);

      logger.info('Getting directories', { userId });

      // Get all directories
      const directoriesSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .orderBy('path')
        .get();

      // Get all documents to count per directory
      const documentsSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('documents')
        .where('status', '==', 'active')
        .get();

      const documentCounts: Record<string, number> = {};
      documentsSnapshot.forEach((doc) => {
        const data = doc.data();
        const directoryId = data.directoryId || null;
        if (directoryId) {
          documentCounts[directoryId] = (documentCounts[directoryId] || 0) + 1;
        }
      });

      const directories: DirectoryEnhanced[] = directoriesSnapshot.docs.map((doc) => {
        const data = doc.data() as Directory;
        return {
          ...data,
          id: doc.id,
          documentCount: documentCounts[doc.id] || 0,
          depth: data.path.split('/').filter(Boolean).length,
        };
      });

      logger.info('Directories retrieved successfully', {
        userId,
        count: directories.length,
      });

      const response: GetDirectoriesResponse = { directories };
      return response;
    } catch (error) {
      logger.error('Failed to get directories', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to get directories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Build a hierarchical tree structure from flat directory list
 */
function buildDirectoryTree(directories: DirectoryEnhanced[]): DirectoryTreeNode[] {
  const nodeMap = new Map<string, DirectoryTreeNode>();
  const rootNodes: DirectoryTreeNode[] = [];

  // Create nodes
  directories.forEach((dir) => {
    nodeMap.set(dir.id, {
      id: dir.id,
      name: dir.name,
      path: dir.path,
      documentCount: dir.documentCount,
      children: [],
    });
  });

  // Build tree structure
  directories.forEach((dir) => {
    const node = nodeMap.get(dir.id)!;
    if (dir.parentId) {
      const parentNode = nodeMap.get(dir.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      }
    } else {
      rootNodes.push(node);
    }
  });

  return rootNodes;
}

/**
 * Get directory tree for sidebar navigation
 */
export const getDirectoryTree = onCall(
  {
    region: 'asia-east1',
    cors: true,
  },
  async (request) => {
    try {
      const userId = await validateAuth(request);

      logger.info('Getting directory tree', { userId });

      // Get all directories
      const directoriesSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .orderBy('path')
        .get();

      // Get all documents to count per directory
      const documentsSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('documents')
        .where('status', '==', 'active')
        .get();

      const documentCounts: Record<string, number> = {};
      documentsSnapshot.forEach((doc) => {
        const data = doc.data();
        const directoryId = data.directoryId || null;
        if (directoryId) {
          documentCounts[directoryId] = (documentCounts[directoryId] || 0) + 1;
        }
      });

      const directories: DirectoryEnhanced[] = directoriesSnapshot.docs.map((doc) => {
        const data = doc.data() as Directory;
        return {
          ...data,
          id: doc.id,
          documentCount: documentCounts[doc.id] || 0,
          depth: data.path.split('/').filter(Boolean).length,
        };
      });

      const tree = buildDirectoryTree(directories);

      logger.info('Directory tree built successfully', {
        userId,
        rootCount: tree.length,
      });

      const response: GetDirectoryTreeResponse = { tree };
      return response;
    } catch (error) {
      logger.error('Failed to get directory tree', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to get directory tree: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Get a single directory by ID
 */
export const getDirectory = onCall(
  {
    region: 'asia-east1',
    cors: true,
  },
  async (request) => {
    try {
      const userId = await validateAuth(request);
      const { directoryId } = request.data as { directoryId: string };

      if (!directoryId) {
        throw new Error('directoryId is required');
      }

      logger.info('Getting directory', { userId, directoryId });

      const directoryDoc = await db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .doc(directoryId)
        .get();

      if (!directoryDoc.exists) {
        throw new Error('Directory not found');
      }

      const directory = {
        ...directoryDoc.data(),
        id: directoryDoc.id,
      } as Directory;

      logger.info('Directory retrieved successfully', {
        userId,
        directoryId,
      });

      return directory;
    } catch (error) {
      logger.error('Failed to get directory', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to get directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Create a new directory
 */
export const createDirectory = onCall(
  {
    region: 'asia-east1',
    cors: true,
  },
  async (request) => {
    try {
      const userId = await validateAuth(request);
      const data = request.data as CreateDirectoryRequest;

      logger.info('Creating directory', { userId, name: data.name });

      // Validate request
      if (!data.name || data.name.trim().length === 0) {
        throw new Error('Directory name is required');
      }

      // Build path
      const path = await buildDirectoryPath(userId, data.parentId || null);

      // Check if directory with same name already exists at this level
      const existingQuery = await db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .where('parentId', '==', data.parentId || null)
        .where('name', '==', data.name.trim())
        .get();

      if (!existingQuery.empty) {
        throw new Error('A directory with this name already exists at this level');
      }

      // Create directory
      const now = FieldValue.serverTimestamp();
      const directoryRef = db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .doc();

      const directory: Omit<Directory, 'id'> = {
        userId,
        name: data.name.trim(),
        path,
        parentId: data.parentId || null,
        ruleIds: [],
        createdAt: now as any,
        updatedAt: now as any,
      };

      await directoryRef.set(directory);

      const createdDirectory = {
        ...directory,
        id: directoryRef.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Directory;

      logger.info('Directory created successfully', {
        userId,
        directoryId: directoryRef.id,
        name: data.name,
      });

      const response: CreateDirectoryResponse = { directory: createdDirectory };
      return response;
    } catch (error) {
      logger.error('Failed to create directory', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to create directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Update a directory
 */
export const updateDirectory = onCall(
  {
    region: 'asia-east1',
    cors: true,
  },
  async (request) => {
    try {
      const userId = await validateAuth(request);
      const data = request.data as UpdateDirectoryRequest;

      if (!data.directoryId) {
        throw new Error('directoryId is required');
      }

      logger.info('Updating directory', { userId, directoryId: data.directoryId });

      const directoryRef = db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .doc(data.directoryId);

      const directoryDoc = await directoryRef.get();
      if (!directoryDoc.exists) {
        throw new Error('Directory not found');
      }

      const updates: any = {
        updatedAt: FieldValue.serverTimestamp(),
      };

      if (data.name !== undefined) {
        if (!data.name.trim()) {
          throw new Error('Directory name cannot be empty');
        }
        updates.name = data.name.trim();
      }

      if (data.parentId !== undefined) {
        // Validate parent exists if provided
        if (data.parentId) {
          const parentDoc = await db
            .collection('users')
            .doc(userId)
            .collection('directories')
            .doc(data.parentId)
            .get();

          if (!parentDoc.exists) {
            throw new Error('Parent directory not found');
          }

          // Prevent circular references
          if (data.parentId === data.directoryId) {
            throw new Error('Directory cannot be its own parent');
          }
        }

        updates.parentId = data.parentId || null;
        updates.path = await buildDirectoryPath(userId, data.parentId || null);
      }

      await directoryRef.update(updates);

      const updatedDoc = await directoryRef.get();
      const updatedDirectory = {
        ...updatedDoc.data(),
        id: updatedDoc.id,
      } as Directory;

      logger.info('Directory updated successfully', {
        userId,
        directoryId: data.directoryId,
      });

      return updatedDirectory;
    } catch (error) {
      logger.error('Failed to update directory', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to update directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);

/**
 * Delete a directory
 */
export const deleteDirectory = onCall(
  {
    region: 'asia-east1',
    cors: true,
  },
  async (request) => {
    try {
      const userId = await validateAuth(request);
      const data = request.data as DeleteDirectoryRequest;

      if (!data.directoryId) {
        throw new Error('directoryId is required');
      }

      logger.info('Deleting directory', { userId, directoryId: data.directoryId });

      // Check if directory has children
      const childrenSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .where('parentId', '==', data.directoryId)
        .limit(1)
        .get();

      if (!childrenSnapshot.empty) {
        throw new Error('Cannot delete directory with subdirectories. Please delete subdirectories first.');
      }

      // Check if directory has documents
      const documentsSnapshot = await db
        .collection('users')
        .doc(userId)
        .collection('documents')
        .where('directoryId', '==', data.directoryId)
        .where('status', '==', 'active')
        .limit(1)
        .get();

      if (!documentsSnapshot.empty) {
        throw new Error('Cannot delete directory with documents. Please move or delete documents first.');
      }

      // Delete directory
      await db
        .collection('users')
        .doc(userId)
        .collection('directories')
        .doc(data.directoryId)
        .delete();

      logger.info('Directory deleted successfully', {
        userId,
        directoryId: data.directoryId,
      });

      return { success: true };
    } catch (error) {
      logger.error('Failed to delete directory', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new Error(`Failed to delete directory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);
