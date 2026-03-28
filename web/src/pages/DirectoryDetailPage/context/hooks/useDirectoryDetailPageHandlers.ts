import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteQuizMutation } from '../../../../store/api/Quiz/QuizApi';
import { useDeleteFlashcardSetMutation } from '../../../../store/api/Flashcards/FlashcardsApi';
import { useDeleteSlideDeckMutation } from '../../../../store/api/SlideDecks/SlideDecksApi';
import type { DocumentEnhanced, Quiz, FlashcardSet, SlideDeck, Directory } from '@shared-types';

export const useDirectoryDetailPageHandlers = () => {
  const navigate = useNavigate();

  // Delete mutations
  const [deleteQuiz, { isLoading: isDeletingQuiz }] = useDeleteQuizMutation();
  const [deleteFlashcardSet, { isLoading: isDeletingFlashcardSet }] = useDeleteFlashcardSetMutation();
  const [deleteSlideDeck, { isLoading: isDeletingSlideDeck }] = useDeleteSlideDeckMutation();

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ directory: Directory | null }>({ directory: null });
  const [deleteDocDialog, setDeleteDocDialog] = useState<{ document: DocumentEnhanced | null }>({ document: null });
  const [deleteQuizDialog, setDeleteQuizDialog] = useState<{ quiz: Quiz | null }>({ quiz: null });
  const [deleteFlashcardSetDialog, setDeleteFlashcardSetDialog] = useState<{ flashcardSet: FlashcardSet | null }>({ flashcardSet: null });
  const [deleteSlideDeckDialog, setDeleteSlideDeckDialog] = useState<{ slideDeck: SlideDeck | null }>({ slideDeck: null });

  // Quiz delete
  const handleDeleteQuiz = useCallback(async () => {
    if (!deleteQuizDialog.quiz) return;
    try {
      await deleteQuiz({ quizId: deleteQuizDialog.quiz.id }).unwrap();
      setDeleteQuizDialog({ quiz: null });
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  }, [deleteQuizDialog.quiz, deleteQuiz]);

  // Flashcard delete
  const handleDeleteFlashcardSet = useCallback(async () => {
    if (!deleteFlashcardSetDialog.flashcardSet) return;
    try {
      await deleteFlashcardSet({ flashcardSetId: deleteFlashcardSetDialog.flashcardSet.id }).unwrap();
      setDeleteFlashcardSetDialog({ flashcardSet: null });
    } catch (error) {
      console.error('Failed to delete flashcard set:', error);
    }
  }, [deleteFlashcardSetDialog.flashcardSet, deleteFlashcardSet]);

  // Slide deck delete
  const handleDeleteSlideDeck = useCallback(async () => {
    if (!deleteSlideDeckDialog.slideDeck) return;
    try {
      await deleteSlideDeck({ slideDeckId: deleteSlideDeckDialog.slideDeck.id }).unwrap();
      setDeleteSlideDeckDialog({ slideDeck: null });
    } catch (error) {
      console.error('Failed to delete slide deck:', error);
    }
  }, [deleteSlideDeckDialog.slideDeck, deleteSlideDeck]);

  // Navigation
  const handleNavigateBack = useCallback((ancestors: { id: string }[]) => {
    navigate(
      ancestors.length > 0
        ? `/directory/${ancestors[ancestors.length - 1].id}`
        : '/documents'
    );
  }, [navigate]);

  return {
    // Dialog state
    createDialogOpen,
    setCreateDialogOpen,
    deleteDialog,
    setDeleteDialog,
    deleteDocDialog,
    setDeleteDocDialog,
    deleteQuizDialog,
    setDeleteQuizDialog,
    deleteFlashcardSetDialog,
    setDeleteFlashcardSetDialog,
    deleteSlideDeckDialog,
    setDeleteSlideDeckDialog,

    // Handlers
    handleDeleteQuiz,
    handleDeleteFlashcardSet,
    handleDeleteSlideDeck,
    handleNavigateBack,

    // Loading states
    isDeletingQuiz,
    isDeletingFlashcardSet,
    isDeletingSlideDeck,
  };
};
