import React, { useState } from 'react';
import { useGetDirectoryTreeQuery } from '../../store/api/Directory/DirectoryApi';
import { DirectoryTreeNode } from '@shared-types';
import { IDirectoryTree } from './IDirectoryTree';
import { directoryTreeStyles } from './DirectoryTree.styles';
import { ChevronRight, Folder, FolderOpen, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DirectoryTreeItemProps {
  node: DirectoryTreeNode;
  level: number;
  selectedDirectoryId?: string | null;
  onSelect: (directoryId: string) => void;
}

const DirectoryTreeItem: React.FC<DirectoryTreeItemProps> = ({
  node,
  level,
  selectedDirectoryId,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedDirectoryId === node.id;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClick = () => {
    onSelect(node.id);
  };

  return (
    <div>
      <div
        className={cn(
          directoryTreeStyles.treeItem,
          isSelected && directoryTreeStyles.treeItemActive
        )}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <button
            onClick={handleToggle}
            className={cn(
              directoryTreeStyles.treeItemIcon,
              isExpanded && directoryTreeStyles.treeItemIconExpanded
            )}
          >
            <ChevronRight size={14} />
          </button>
        ) : (
          <div className="w-3.5" />
        )}

        <div className={directoryTreeStyles.treeItemContent}>
          {isExpanded && hasChildren ? (
            <FolderOpen size={16} className="text-primary" />
          ) : (
            <Folder size={16} className="text-muted-foreground" />
          )}
          <span className={directoryTreeStyles.treeItemName}>{node.name}</span>
          <span className={directoryTreeStyles.treeItemCount}>
            {node.documentCount}
          </span>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={directoryTreeStyles.childrenContainer}>
          {node.children.map((child) => (
            <DirectoryTreeItem
              key={child.id}
              node={child}
              level={level + 1}
              selectedDirectoryId={selectedDirectoryId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const DirectoryTree: React.FC<IDirectoryTree> = ({
  onSelectDirectory,
  selectedDirectoryId,
  className,
}) => {
  const { data, isLoading, error } = useGetDirectoryTreeQuery();

  if (isLoading) {
    return (
      <div className={cn(directoryTreeStyles.container, className)}>
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded ml-4" />
          <div className="h-8 bg-muted rounded ml-4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn(directoryTreeStyles.container, className)}>
        <div className={directoryTreeStyles.emptyState}>
          Error loading directories
        </div>
      </div>
    );
  }

  const tree = data?.tree || [];

  return (
    <div className={cn(directoryTreeStyles.container, className)}>
      {/* All Documents root */}
      <div
        className={cn(
          directoryTreeStyles.allDocuments,
          selectedDirectoryId === null && directoryTreeStyles.allDocumentsActive
        )}
        onClick={() => onSelectDirectory(null)}
      >
        <Home size={16} />
        <span className="text-sm">All Documents</span>
      </div>

      {/* Directory tree */}
      {tree.length === 0 ? (
        <div className={directoryTreeStyles.emptyState}>
          No folders yet
        </div>
      ) : (
        <div className="mt-2 space-y-1">
          {tree.map((node) => (
            <DirectoryTreeItem
              key={node.id}
              node={node}
              level={0}
              selectedDirectoryId={selectedDirectoryId}
              onSelect={onSelectDirectory}
            />
          ))}
        </div>
      )}
    </div>
  );
};
