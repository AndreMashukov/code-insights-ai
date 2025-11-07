export interface IDirectoryTree {
  onSelectDirectory: (directoryId: string | null) => void;
  selectedDirectoryId?: string | null;
  className?: string;
}
