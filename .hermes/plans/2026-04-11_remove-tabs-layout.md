# Plan: Remove Tabs Layout from AI Document Generator

## Context
- The TextPromptForm has a tabbed interface (Upload Files / Library) that adds complexity
- User wants both tabs removed — flatten the layout
- The FileUploadZone and DocumentSelector were rendered conditionally based on activeTab
- Need to verify document generation still works after removal

## Architecture
```
FormRenderer → TextPromptForm → SourceTabs (REMOVE)
                               → FileUploadZone (shown when tab=upload)
                               → DocumentSelector (shown when tab=library)
                               → AttachedFilesList (always shown)
                               → Prompt textarea
                               → CompactRuleSelector
```

## Task List
| # | Task | Priority | Status |
|---|------|----------|--------|
| 1 | Remove SourceTabs component from TextPromptForm | P0 | ⬜ |
| 2 | Remove activeTab state and tab-related props | P0 | ⬜ |
| 3 | Remove SourceTabs import and related files (component, styles, interface, index) | P1 | ⬜ |
| 4 | Remove library-related props from ITextPromptForm if no longer needed | P1 | ⬜ |
| 5 | Run lint + typecheck | P0 | ⬜ |
| 6 | Test document generation end-to-end | P0 | ⬜ |

## Exit Criteria
| Phase | Must satisfy |
|-------|-------------|
| EXPLORE | Component hierarchy mapped, SourceTabs dependencies identified |
| PLAN | Task list written, removal scope clear |
| IMPLEMENT | Tabs removed, no dead imports, lint+typecheck pass |
| TEST | Document generation works (L3), visual confirmation (L4) |
