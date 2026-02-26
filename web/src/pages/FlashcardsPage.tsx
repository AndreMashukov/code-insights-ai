
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../components/Page';

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardData {
  title: string;
  flashcards: Flashcard[];
}

// NOTE: This assumes the Firebase emulator is running locally.
// Replace with your actual cloud function URL in production.
const API_BASE_URL = 'http://localhost:5001/code-insights-ai/asia-east1';

export const FlashcardsPage: React.FC = () => {
  const { directoryId } = useParams<{ directoryId: string }>();
  const [data, setData] = useState<FlashcardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!directoryId) return;

    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);
      try {
        // We need to encode the directoryId as it may contain slashes.
        const encodedDirectoryId = encodeURIComponent(directoryId);
        const response = await fetch(`${API_BASE_URL}/getFlashcardsByDirectory?directoryId=${encodedDirectoryId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch flashcards: ${response.statusText}`);
        }
        
        const result: FlashcardData = await response.json();
        setData(result);
        setCurrentCardIndex(0);
        setIsFlipped(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [directoryId]);

  if (loading) {
    return (
      <Page showSidebar={true}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-muted-foreground">Loading flashcards...</p>
        </div>
      </Page>
    );
  }
  
  if (error) {
    return (
      <Page showSidebar={true}>
        <div className="max-w-2xl mx-auto text-center">
           <p className="text-red-500">Error: {error}</p>
        </div>
      </Page>
    );
  }

  const currentCard = data?.flashcards[currentCardIndex];

  if (!currentCard) {
    return (
      <Page showSidebar={true}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{data?.title || 'Flashcards'}</h1>
          <p className="text-muted-foreground">No flashcards found for this directory.</p>
        </div>
      </Page>
    );
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % (data?.flashcards.length || 1));
  };

  return (
    <Page showSidebar={true}>
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">{data?.title}</h1>
        
        <div 
          className="w-full h-64 border-2 rounded-lg p-6 flex items-center justify-center cursor-pointer perspective"
          onClick={handleFlip}
        >
          <div className={`transition-transform duration-500 w-full h-full preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center">
              <p className="text-xl text-center">{currentCard.question}</p>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center">
              <p className="text-xl text-center">{currentCard.answer}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleFlip}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isFlipped ? 'Show Question' : 'Show Answer'}
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Next Card
          </button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          Card {currentCardIndex + 1} of {data?.flashcards.length || 0}
        </div>
      </div>
    </Page>
  );
};

// Add some basic CSS for the 3D effect in a style tag for simplicity.
const style = document.createElement('style');
style.innerHTML = `
.perspective {
  perspective: 1000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
`;
document.head.appendChild(style);
