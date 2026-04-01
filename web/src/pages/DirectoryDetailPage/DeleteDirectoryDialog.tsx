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
import { useDeleteDirectoryMutation } from '../../store/api/Directory/DirectoryApi';
import { Directory } from '@shared-types';

interface IDeleteDirectoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  directory: Directory | null;
  onSuccess: () => void;
}

export const DeleteDirectoryDialog: React.FC<IDeleteDirectoryDialogProps> = ({
  isOpen,
  onClose,
  directory,
  onSuccess,
}) => {
  const [deleteDirectory, { isLoading }] = useDeleteDirectoryMutation();

  const handleDelete = async () => {
    if (!directory) return;

    try {
      await deleteDirectory(directory.id).unwrap();
      onSuccess();
    } catch (error) {
      console.error('Failed to delete directory:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete Folder
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{directory?.name}</strong> and all its contents? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
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
