
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

// This assumes the function is running from the 'functions/lib' directory after compilation
const baseDir = path.resolve(__dirname, '..'); 

export const getFlashcardsByDirectory = functions.https.onRequest(async (req, res) => {
  // Allow CORS for local development
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }

  const directoryId = req.query.directoryId as string;

  if (!directoryId) {
    res.status(400).send('Missing directoryId query parameter');
    return;
  }

  try {
    // Basic security: prevent directory traversal attacks
    const safeDirectoryId = path.normalize(directoryId).replace(/^(\.\.(\/|\\|$))+/, '');
    const rulesPath = path.join(baseDir, 'src', 'docs', safeDirectoryId, 'flashcard-rules.json');

    if (fs.existsSync(rulesPath)) {
      const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
      const rulesJson = JSON.parse(rulesContent);
      res.status(200).json(rulesJson);
    } else {
      res.status(404).send('Flashcard rules not found for the specified directory.');
    }
  } catch (error) {
    console.error('Error fetching flashcard rules:', error);
    res.status(500).send('An internal error occurred.');
  }
});
