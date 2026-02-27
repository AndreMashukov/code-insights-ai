import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page } from '../components/Page';
import { Flashcard, FlashcardSet } from '@shared-types';

export const FlashcardsPage: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  
  const [flashcardSet, setFlashcardSet] = useState<FlashcardSet | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyStats, setStudyStats] = useState({ studied: 0, correct: 0 });

  useEffect(() => {
    if (!setId) return;
    fetchFlashcardSet();
  }, [setId]);

  const fetchFlashcardSet = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NX_PUBLIC_FIREBASE_FUNCTIONS_URL || ''}/getFlashcardSet?setId=${setId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch flashcard set');
      }
      
      const data = await response.json();
      setFlashcardSet(data.flashcardSet);
      setFlashcards(data.flashcards);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!flashcards[currentIndex]) return;

    try {
      // Update progress on backend
      await fetch(`${process.env.NX_PUBLIC_FIREBASE_FUNCTIONS_URL || ''}/updateStudyProgress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flashcardId: flashcards[currentIndex].id,
          setId,
          isCorrect,
          studyDuration: 5, // Placeholder for actual timing
        }),
      });

      // Update local stats
      setStudyStats(prev => ({
        studied: prev.studied + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
      }));

      // Move to next card
      if (currentIndex < flashcards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        // Show completion screen
        alert(`Study session complete!\n\nStudied: ${studyStats.studied + 1} cards\nCorrect: ${studyStats.correct + (isCorrect ? 1 : 0)} (${Math.round(((studyStats.correct + (isCorrect ? 1 : 0)) / (studyStats.studied + 1)) * 100)}%)`);
        navigate(-1);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  if (loading) {
    return (
      <Page showSidebar={true}>
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading flashcards...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (error || !flashcardSet || flashcards.length === 0) {
    return (
      <Page showSidebar={true}>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Flashcards Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'This flashcard set is empty or doesn\'t exist.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </Page>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <Page showSidebar={true}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Sets
          </button>
          <h1 className="text-3xl font-bold mb-2">{flashcardSet.title}</h1>
          {flashcardSet.description && (
            <p className="text-muted-foreground mb-4">{flashcardSet.description}</p>
          )}
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Card {currentIndex + 1} of {flashcards.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Mastery: {flashcardSet.masteryLevel}%</span>
            <span>•</span>
            <span>Difficulty: {flashcardSet.difficulty}</span>
          </div>
        </div>

        {/* Flashcard */}
        <div 
          className="relative mb-8 cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={handleFlip}
        >
          <div 
            className="relative w-full min-h-[400px] transition-transform duration-500"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 bg-card border-2 border-border rounded-2xl p-8 flex items-center justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-4">Question</div>
                <div className="text-2xl font-medium">{currentCard.front}</div>
                <div className="mt-6 text-sm text-muted-foreground">
                  Click to reveal answer
                </div>
              </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 bg-primary/5 border-2 border-primary rounded-2xl p-8 flex items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="text-center">
                <div className="text-sm text-primary mb-4">Answer</div>
                <div className="text-xl">{currentCard.back}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isFlipped ? (
            <button
              onClick={handleFlip}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
            >
              Show Answer
            </button>
          ) : (
            <>
              <button
                onClick={() => handleAnswer(false)}
                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition-colors"
              >
                ✗ Incorrect
              </button>
              <button
                onClick={() => handleAnswer(true)}
                className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
              >
                ✓ Correct
              </button>
            </>
          )}
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Keyboard shortcuts: Space to flip, ← → for wrong/correct</p>
        </div>
      </div>
    </Page>
  );
};
