export const directoryTreeStyles = {
  container: "flex flex-col gap-1 p-2",
  treeItem: "group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-accent/50",
  treeItemActive: "bg-accent text-accent-foreground",
  treeItemContent: "flex-1 flex items-center gap-2 min-w-0",
  treeItemName: "text-sm font-medium truncate",
  treeItemCount: "text-xs text-muted-foreground",
  treeItemIcon: "flex-shrink-0 transition-transform duration-200",
  treeItemIconExpanded: "rotate-90",
  childrenContainer: "ml-4 mt-1 space-y-1",
  emptyState: "text-sm text-muted-foreground text-center py-4",
  allDocuments: "flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-accent/50 font-medium",
  allDocumentsActive: "bg-accent text-accent-foreground",
} as const;
