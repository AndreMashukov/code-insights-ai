import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../components/Page';
import { FlashcardSet } from '@shared-types';

export const FlashcardSetsPage: React.FC = () => {
  const navigate = useNavigate();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const fetchFlashcardSets = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NX_PUBLIC_FIREBASE_FUNCTIONS_URL || ''}/getFlashcardSets`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch flashcard sets');
      }
      
      const data = await response.json();
      setFlashcardSets(data.flashcardSets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flashcard sets');
    } finally {
      setLoading(false);
    }
  };

  const handleStudy = (setId: string) => {
    navigate(`/flashcards/${setId}`);
  };

  const handleDelete = async (setId: string) => {
    if (!confirm('Are you sure you want to delete this flashcard set?')) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NX_PUBLIC_FIREBASE_FUNCTIONS_URL || ''}/deleteFlashcardSet`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ setId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete flashcard set');
      }

      // Refresh the list
      fetchFlashcardSets();
    } catch (err) {
      console.error('Error deleting flashcard set:', err);
      alert('Failed to delete flashcard set');
    }
  };

  if (loading) {
    return (
      <Page showSidebar={true}>
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading flashcard sets...</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page showSidebar={true}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Flashcard Sets</h1>
          <p className="text-muted-foreground">
            Study and review with AI-generated flashcards
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Flashcard Sets Grid */}
        {flashcardSets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">No Flashcard Sets Yet</h2>
            <p className="text-muted-foreground mb-6">
              Generate flashcards from your documents to start studying
            </p>
            <button
              onClick={() => navigate('/documents')}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
            >
              Browse Documents
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcardSets.map((set) => (
              <div
                key={set.id}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                {/* Set Info */}
                <h3 className="text-xl font-semibold mb-2">{set.title}</h3>
                {set.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {set.description}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{set.cardCount} cards</span>
                  <span>•</span>
                  <span className="capitalize">{set.difficulty}</span>
                </div>

                {/* Mastery Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mastery</span>
                    <span>{set.masteryLevel}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${set.masteryLevel}%` }}
                    />
                  </div>
                </div>

                {/* Tags */}
                {set.tags && set.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {set.tags.map((tag, i) => (
                      <span 
                        key={i}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStudy(set.id)}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
                  >
                    Study
                  </button>
                  <button
                    onClick={() => handleDelete(set.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};
