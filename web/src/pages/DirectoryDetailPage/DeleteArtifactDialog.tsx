import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteArtifactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  artifactType: string;
  artifactTitle: string | undefined;
  onDelete: () => void;
  isLoading: boolean;
}

export const DeleteArtifactDialog: React.FC<DeleteArtifactDialogProps> = ({
  isOpen,
  onClose,
  artifactType,
  artifactTitle,
  onDelete,
  isLoading,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete {artifactType}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{artifactTitle}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
            {isLoading ? (
              <>
                <Trash2 className="mr-2 h-4 w-4 animate-pulse" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
