import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteQuizMutation } from '../../../../store/api/Quiz/QuizApi';
import { useDeleteFlashcardSetMutation } from '../../../../store/api/Flashcards/FlashcardsApi';
import { useDeleteSlideDeckMutation } from '../../../../store/api/SlideDecks/SlideDecksApi';
import type { DocumentEnhanced, Quiz, FlashcardSet, SlideDeck, Directory } from '@shared-types';

type ArtifactKind = 'Quiz' | 'Flashcard Set' | 'Slide Deck';

interface ArtifactDeleteState {
  kind: ArtifactKind;
  title: string;
  id: string;
}

const ARTIFACT_TYPE_MAP: Record<string, ArtifactKind> = {
  quiz: 'Quiz',
  flashcardSet: 'Flashcard Set',
  slideDeck: 'Slide Deck',
};

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
  const [deleteArtifactDialog, setDeleteArtifactDialog] = useState<ArtifactDeleteState | null>(null);

  // Unified artifact delete
  const handleDeleteArtifact = useCallback(async () => {
    if (!deleteArtifactDialog) return;
    const { kind, id } = deleteArtifactDialog;
    try {
      if (kind === 'Quiz') await deleteQuiz({ quizId: id }).unwrap();
      else if (kind === 'Flashcard Set') await deleteFlashcardSet({ flashcardSetId: id }).unwrap();
      else if (kind === 'Slide Deck') await deleteSlideDeck({ slideDeckId: id }).unwrap();
      setDeleteArtifactDialog(null);
    } catch (error) {
      console.error(`Failed to delete ${kind.toLowerCase()}:`, error);
    }
  }, [deleteArtifactDialog, deleteQuiz, deleteFlashcardSet, deleteSlideDeck]);

  const isDeletingArtifact =
    (deleteArtifactDialog?.kind === 'Quiz' && isDeletingQuiz) ||
    (deleteArtifactDialog?.kind === 'Flashcard Set' && isDeletingFlashcardSet) ||
    (deleteArtifactDialog?.kind === 'Slide Deck' && isDeletingSlideDeck);

  // Openers for each artifact type
  const openDeleteQuizDialog = useCallback((q: Quiz) => {
    setDeleteArtifactDialog({ kind: 'Quiz', title: q.title, id: q.id });
  }, []);

  const openDeleteFlashcardSetDialog = useCallback((f: FlashcardSet) => {
    setDeleteArtifactDialog({ kind: 'Flashcard Set', title: f.title, id: f.id });
  }, []);

  const openDeleteSlideDeckDialog = useCallback((s: SlideDeck) => {
    setDeleteArtifactDialog({ kind: 'Slide Deck', title: s.title, id: s.id });
  }, []);

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
    deleteArtifactDialog,
    setDeleteArtifactDialog,

    // Openers
    openDeleteQuizDialog,
    openDeleteFlashcardSetDialog,
    openDeleteSlideDeckDialog,

    // Handlers
    handleDeleteArtifact,
    handleNavigateBack,

    // Loading
    isDeletingArtifact,
  };
};
