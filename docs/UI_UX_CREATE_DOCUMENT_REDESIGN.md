# Create Document Page - UI/UX Redesign Proposal

## Overview

This document proposes a redesigned UI/UX for the Create Document Page that accommodates multiple document sources including textual prompts, YouTube video URLs, web URLs, and markdown files. The design focuses on extensibility, usability, and visual hierarchy.

## Current State Analysis

The current implementation uses a simple tab-based interface with only two sources:
- From URL (web scraping)
- Upload File (markdown files)

### Current Layout Issues:
1. **Limited Scalability**: Adding new sources requires UI restructuring
2. **Visual Hierarchy**: No clear guidance on which method to use
3. **User Experience**: No onboarding or source selection guidance
4. **Mobile Responsiveness**: Tab layout may not work well on smaller screens

## Proposed New Design

### Design Principles

1. **Progressive Disclosure**: Show simple options first, advanced features on demand
2. **Visual Hierarchy**: Clear source selection with intuitive icons and descriptions
3. **Extensibility**: Easy to add new document sources without UI overhaul
4. **Responsive Design**: Works seamlessly across all device sizes
5. **User Guidance**: Built-in help and examples for each source type

---

## Main Layout - Desktop View

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Documents              Create Document                    [Help] [?] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────┐   │
│  │                     Choose Your Content Source                        │   │
│  │                                                                       │   │
│  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │ │  📝 Text    │ │  🎥 Video   │ │  🌐 Website │ │  📄 File    │        │   │
│  │ │   Prompt    │ │    URL      │ │    URL      │ │   Upload    │       │   │
│  │ │             │ │             │ │             │ │             │       │   │
│  │ │ Create from │ │ Extract from│ │ Scrape web  │ │ Upload MD   │       │   │
│  │ │ description │ │ YouTube or  │ │ content     │ │ or text     │       │   │
│  │ │ or ideas    │ │ other video │ │ automatically│ │ file        │      │   │
│  │ │             │ │             │ │             │ │             │       │   │
│  │ │   [Select]  │ │   [Select]  │ │   [Select]  │ │   [Select]  │       │   │
│  │ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │                                                                       │   │
│  │               ┌─────────────┐ ┌─────────────┐                         │   │
│  │               │  🔗 API     │ │  ➕ More    │                          │   │
│  │               │ Integration │ │  Sources    │                         │   │
│  │               │             │ │             │                         │   │
│  │               │ Connect to  │ │ Additional  │                         │   │
│  │               │ external    │ │ sources     │                         │   │
│  │               │ services    │ │ coming soon │                         │   │
│  │               │             │ │             │                         │   │
│  │               │ [Coming]    │ │   [Soon]    │                         │   │
│  │               └─────────────┘ └─────────────┘                         │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Interaction Design & UX Flow

### When User Clicks a Source Card

The optimal UX approach is **Progressive Disclosure with Responsive Behavior**:

#### Desktop Experience: In-Place Expansion

When a user clicks a source card on desktop:
1. **Card Selection**: The selected card gets highlighted with a border and slight elevation
2. **Smooth Transition**: Other cards dim slightly (opacity: 0.7) 
3. **Form Reveal**: The form slides in below the cards with smooth animation
4. **Context Preservation**: User can still see all source options above the form
5. **Easy Switching**: Clicking another card smoothly transitions to that form

```
BEFORE CLICK:
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  📝 Text    │ │  🎥 Video   │ │  🌐 Website │ │  📄 File    │               │
│  │   Prompt    │ │    URL      │ │    URL      │ │   Upload    │               │
│  │   [Select]  │ │   [Select]  │ │   [Select]  │ │   [Select]  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────────────────────┘

AFTER CLICKING "TEXT PROMPT":
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  📝 Text    │ │  🎥 Video   │ │  🌐 Website │ │  📄 File    │               │
│  │   Prompt    │ │    URL      │ │    URL      │ │   Upload    │               │
│  │ ✓ Selected  │ │   [Select]  │ │   [Select]  │ │   [Select]  │               │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘               │
│  ╔═══════════════════════════════════════════════════════════════════════════╗ │
│  ║                      📝 Text Prompt Form                                  ║ │
│  ║ ┌─────────────────────────────────────────────────────────────────────┐ ║ │
│  ║ │ Document Title: [                                                   ] │ ║ │
│  ║ │ Description: [                                                      ] │ ║ │
│  ║ │              [                                                      ] │ ║ │
│  ║ │              [                                                      ] │ ║ │
│  ║ │ □ Include TOC  □ Add Examples  □ Long Form                          │ ║ │
│  ║ │                                                                     │ ║ │
│  ║ │                        [Cancel]  [Generate Document]               │ ║ │
│  ║ └─────────────────────────────────────────────────────────────────────┘ ║ │
│  ╚═══════════════════════════════════════════════════════════════════════════╝ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### Mobile Experience: Slide-Up Panel

On mobile devices, clicking a card triggers a slide-up panel:
1. **Card Highlight**: Selected card gets highlighted briefly
2. **Panel Slide**: Form slides up from bottom, covering ~80% of screen
3. **Context Header**: Top of panel shows selected source with back button
4. **Full Space**: Form gets full width and optimized mobile layout

```
MOBILE - AFTER CLICKING TEXT PROMPT:
┌─────────────────────────────────┐
│ Choose Content Source           │ ← Still visible (context)
│ ┌─────────────────────────────┐ │
│ │✓📝 Text Prompt             │ │ ← Highlighted selection
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │  🎥 Video URL               │ │ ← Dimmed options
├─┴─────────────────────────────┴─┤
│╔═══════════════════════════════╗│ ← Slide-up panel starts here
│║ ← Back    📝 Text Prompt      ║│
│║───────────────────────────────║│
│║ Document Title:               ║│
│║ ┌───────────────────────────┐ ║│
│║ │ Enter title...            │ ║│
│║ └───────────────────────────┘ ║│
│║                               ║│
│║ Description:                  ║│
│║ ┌───────────────────────────┐ ║│
│║ │ Describe content...       │ ║│
│║ │                           │ ║│
│║ │                           │ ║│
│║ └───────────────────────────┘ ║│
│║                               ║│
│║ [Generate Document]           ║│
│╚═══════════════════════════════╝│
└─────────────────────────────────┘
```

### Benefits of This Approach

#### ✅ **Progressive Disclosure Advantages:**
- **Context Preservation**: Users can see their choice and easily switch
- **Spatial Consistency**: Forms appear in predictable location
- **Reduced Cognitive Load**: No modal overlay disruption
- **Better for Complex Forms**: Full width and height available

#### ✅ **Responsive Benefits:**
- **Desktop**: Optimal use of horizontal space
- **Mobile**: Native-feeling slide-up interaction
- **Tablet**: Adapts gracefully between modes

#### ✅ **Usability Benefits:**
- **Easy Source Switching**: Click another card to change forms instantly  
- **Clear Visual Hierarchy**: Selected state is obvious
- **Smooth Animations**: Professional feel with CSS transitions
- **Accessible**: Works with keyboard navigation and screen readers

### Animation & Timing Details

```css
/* Card Selection Animation */
.source-card.selected {
  border: 2px solid var(--primary);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.source-card:not(.selected) {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

/* Form Slide-In */
.form-container {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUp 0.4s ease forwards;
}

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Slide-Up Panel */
@media (max-width: 768px) {
  .form-panel {
    transform: translateY(100%);
    animation: slideUpPanel 0.4s ease forwards;
  }
}
```

### Edge Cases & Error Handling

1. **Form Validation Errors**: Errors appear within the expanded form area
2. **Network Issues**: Loading states show in the form area with retry options
3. **Back Navigation**: Forms can be collapsed by clicking outside or using escape key
4. **Multiple Attempts**: Users can easily switch between sources without losing progress

---

## Source Selection Flow

### 1. Text Prompt Source

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Sources                Text Prompt Creator                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        📝 Create from Description                       │   │
│  │                                                                         │   │
│  │  Document Title: ┌─────────────────────────────────────────────────┐   │   │
│  │                  │ Enter a descriptive title...                   │   │   │
│  │                  └─────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  │  Content Description:                                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ Describe what you want the document to contain.                 │   │   │
│  │  │ Examples:                                                       │   │   │
│  │  │ • "Create a tutorial on React hooks"                           │   │   │
│  │  │ • "Generate documentation for REST API best practices"         │   │   │
│  │  │ • "Write a guide on machine learning fundamentals"             │   │   │
│  │  │                                                                 │   │   │
│  │  │ [Your description here...]                                      │   │   │
│  │  │                                                                 │   │   │
│  │  │                                                                 │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  │  Advanced Options: [Show/Hide]                                          │   │
│  │  ┌─ Structure ────────────────────────────────────────────────────┐   │   │
│  │  │ □ Include Table of Contents                                    │   │   │
│  │  │ □ Add Code Examples                                            │   │   │
│  │  │ □ Include References/Sources                                   │   │   │
│  │  │ Length: ○ Short  ○ Medium  ● Long                             │   │   │
│  │  └────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  │                    [Cancel]              [Generate Document]           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Video URL Source

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Sources              Video Content Extractor                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      🎥 Extract from Video Content                      │   │
│  │                                                                         │   │
│  │  Supported Platforms:                                                   │   │
│  │  ┌─ YouTube ─┐ ┌─ Vimeo ──┐ ┌─ More ───┐                              │   │
│  │  │ ✓ Enabled │ │ ✓ Enabled│ │ Coming   │                              │   │
│  │  │           │ │          │ │ Soon     │                              │   │
│  │  └───────────┘ └──────────┘ └──────────┘                              │   │
│  │                                                                         │   │
│  │  Video URL: ┌───────────────────────────────────────────────────────┐ │   │
│  │             │ https://youtube.com/watch?v=...                       │ │   │
│  │             └───────────────────────────────────────────────────────┘ │   │
│  │                                                                         │   │
│  │  ┌─ Processing Options ─────────────────────────────────────────────┐ │   │
│  │  │ Extraction Method:                                               │ │   │
│  │  │ ○ Full Transcript    ○ Key Points Only    ○ Summary             │ │   │
│  │  │                                                                  │ │   │
│  │  │ Include:                                                         │ │   │
│  │  │ □ Timestamps         □ Speaker Names      □ Slide Content       │ │   │
│  │  │ □ Chapter Breaks     □ Comments Summary   □ Video Description    │ │   │
│  │  └──────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                         │   │
│  │  ┌─ Preview ─────────────────────────────────────────────────────────┐ │   │
│  │  │ Video: "Introduction to React Hooks"                             │ │   │
│  │  │ Duration: 45:30                                                   │ │   │
│  │  │ Channel: Tech Tutorial Pro                                       │ │   │
│  │  │ ─────────────────────────────────────────────────────────────────  │ │   │
│  │  │ [Thumbnail]  "Learn React Hooks in this comprehensive..."        │ │   │
│  │  └───────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                         │   │
│  │                    [Cancel]              [Extract Content]             │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3. Website URL Source (Enhanced)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Sources               Website Content Scraper                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        🌐 Scrape Website Content                        │   │
│  │                                                                         │   │
│  │  Website URL: ┌─────────────────────────────────────────────────────┐  │   │
│  │               │ https://example.com/article                         │  │   │
│  │               └─────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  │  ┌─ Scraping Options ────────────────────────────────────────────────┐ │   │
│  │  │ Content Type:                                                     │ │   │
│  │  │ ○ Article/Blog Post    ○ Documentation    ○ Product Page         │ │   │
│  │  │ ○ News Article         ○ Tutorial         ○ Custom               │ │   │
│  │  │                                                                   │ │   │
│  │  │ Include:                                                          │ │   │
│  │  │ ☑ Main Content        ☑ Images           □ Comments              │ │   │
│  │  │ ☑ Code Blocks         □ Navigation       □ Sidebar               │ │   │
│  │  │ ☑ Tables/Lists        □ Footer           □ Related Links         │ │   │
│  │  └───────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                         │   │
│  │  ┌─ Advanced Settings ──────────────────────────────────────────────┐  │   │
│  │  │ □ Follow internal links (max depth: [2])                         │  │   │
│  │  │ □ Extract PDF documents                                           │  │   │
│  │  │ □ Process JavaScript-rendered content                             │  │   │
│  │  │ □ Respect robots.txt                                              │  │   │
│  │  └───────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  │  ┌─ Live Preview ───────────────────────────────────────────────────┐  │   │
│  │  │ Status: [Fetching...]                                            │  │   │
│  │  │ ───────────────────────────────────────────────────────────────── │  │   │
│  │  │ Title: "React Best Practices Guide"                              │  │   │
│  │  │ Content: ~2,500 words, 5 sections, 12 code examples             │  │   │
│  │  │ Images: 3 diagrams, 2 screenshots                                │  │   │
│  │  └───────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  │                    [Cancel]              [Scrape Content]              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4. File Upload Source (Enhanced)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Sources                File Upload Center                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         📄 Upload Your Files                           │   │
│  │                                                                         │   │
│  │  Supported Formats:                                                     │   │
│  │  ┌─ Text ──────┐ ┌─ Documents ─┐ ┌─ Code ──────┐ ┌─ Data ──────┐       │   │
│  │  │ • Markdown  │ │ • PDF       │ │ • JSON      │ │ • CSV       │       │   │
│  │  │ • Plain Text│ │ • Word Doc  │ │ • YAML      │ │ • XML       │       │   │
│  │  │ • HTML      │ │ • RTF       │ │ • Config    │ │ • TSV       │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  │                                                                         │   │
│  │  ┌─────────────────────── Drag & Drop Area ──────────────────────────┐ │   │
│  │  │                                                                   │ │   │
│  │  │                        📁 Drop files here                        │ │   │
│  │  │                            or                                     │ │   │
│  │  │                      [Browse Files]                              │ │   │
│  │  │                                                                   │ │   │
│  │  │                     Max size: 50MB per file                      │ │   │
│  │  │                     Multiple files supported                     │ │   │
│  │  └───────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                         │   │
│  │  ┌─ Processing Options ─────────────────────────────────────────────┐  │   │
│  │  │ Merge Strategy (for multiple files):                             │  │   │
│  │  │ ○ Combine into single document    ○ Create separate documents    │  │   │
│  │  │ ○ Create document collection      ○ Custom processing           │  │   │
│  │  │                                                                  │  │   │
│  │  │ Text Processing:                                                 │  │   │
│  │  │ □ Extract text from images (OCR)  □ Convert tables to markdown  │  │   │
│  │  │ □ Preserve formatting             □ Extract code blocks         │  │   │
│  │  │ □ Generate table of contents      □ Auto-link references        │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  │  Selected Files:                                                        │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ □ documentation.md (45 KB) ✓ Valid                             │   │   │
│  │  │ □ api-spec.yaml (12 KB) ✓ Valid                                │   │   │
│  │  │ □ README.txt (3 KB) ✓ Valid                                    │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │                                                                         │   │
│  │                    [Cancel]              [Upload & Process]            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Mobile Layout (Responsive)

### Main Source Selection (Mobile)

```
┌─────────────────────────────────┐
│ ← Create Document              │
├─────────────────────────────────┤
│                                 │
│ Choose Content Source           │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📝 Text Prompt             │ │
│ │  Create from description    │ │
│ │            [Select] ────────┼─┤
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🎥 Video URL               │ │
│ │  Extract from video         │ │
│ │            [Select] ────────┼─┤
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  🌐 Website URL             │ │
│ │  Scrape web content         │ │
│ │            [Select] ────────┼─┤
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  📄 File Upload             │ │
│ │  Upload documents           │ │
│ │            [Select] ────────┼─┤
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │  ⚡ Quick Actions           │ │
│ │  Recent • Templates         │ │
│ │            [View] ──────────┼─┤
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

---

## Processing Flow & Feedback

### Document Generation Process

```
Source Selection → Configuration → Processing → Review → Save

┌─ Step 1: Source ─┐   ┌─ Step 2: Config ─┐   ┌─ Step 3: Process ─┐
│ User selects     │───│ User configures   │───│ System processes  │
│ content source   │   │ options &         │   │ content and       │
│ and provides     │   │ preferences       │   │ generates         │
│ input data       │   │                   │   │ document          │
└──────────────────┘   └───────────────────┘   └───────────────────┘
                                                         │
┌─ Step 5: Save ────┐   ┌─ Step 4: Review ──┐          │
│ User saves to     │───│ User reviews &     │──────────┘
│ documents with    │   │ edits generated    │
│ final title &     │   │ content before     │
│ tags             │   │ saving             │
└───────────────────┘   └────────────────────┘
```

### Real-time Processing Feedback

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            Processing Your Content                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Step 1: Fetching Content        ████████████████████████████░░░░░░░░ 75%      │
│  ↳ Connecting to source...       ✓ Complete                                    │
│  ↳ Downloading content...         ✓ Complete                                   │
│  ↳ Extracting text...             ⟳ In Progress                                │
│  ↳ Processing images...           ⏸ Waiting                                    │
│                                                                                 │
│  Step 2: Content Analysis        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%       │
│  ↳ Analyzing structure...         ⏸ Waiting                                    │
│  ↳ Extracting key information...  ⏸ Waiting                                    │
│  ↳ Generating metadata...         ⏸ Waiting                                    │
│                                                                                 │
│  Step 3: Document Generation     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 0%       │
│  ↳ Formatting content...          ⏸ Waiting                                    │
│  ↳ Creating structure...          ⏸ Waiting                                    │
│  ↳ Finalizing document...         ⏸ Waiting                                    │
│                                                                                 │
│  ⏱️ Estimated time remaining: 2 minutes                   [Cancel Process]     │
│                                                                                 │
│  ┌─ Live Preview ──────────────────────────────────────────────────────────┐   │
│  │ Document Title: "Introduction to React Hooks"                           │   │
│  │ Sections Found: 5                                                       │   │
│  │ Content: ~3,200 words                                                   │   │
│  │ Images: 2                                                               │   │
│  │ Code Examples: 8                                                        │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Advanced Features & Future Enhancements

### Quick Actions Panel

```
┌─ Quick Actions ──────────────────────────────────────────┐
│                                                          │
│ 🕒 Recent Sources:                                       │
│ • YouTube: "React Tutorial Series"                       │
│ • Website: "MDN Web Docs - JavaScript"                   │
│ • File: "project-requirements.md"                        │
│                                                          │
│ 📋 Templates:                                            │
│ • API Documentation                                      │
│ • Tutorial Guide                                         │
│ • Meeting Notes                                          │
│ • Project Specification                                  │
│                                                          │
│ 🔄 Batch Operations:                                     │
│ • Multiple URLs                                          │
│ • Folder Upload                                          │
│ • Playlist Processing                                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Source Integration Roadmap

```
Phase 1 (Current):          Phase 2 (Near Future):      Phase 3 (Future):
├─ Text Prompts            ├─ Google Docs Integration   ├─ Voice Recording
├─ YouTube Videos          ├─ Notion Pages              ├─ Image OCR
├─ Website Scraping        ├─ GitHub Repositories       ├─ Email Import
└─ File Upload             ├─ Slack Conversations       ├─ API Connectors
                           ├─ PDF Advanced Processing   ├─ Real-time Sync
                           └─ Audio Transcription       └─ AI Summarization
```

---

## Implementation Guidelines

### Component Architecture

```
CreateDocumentPage/
├─ CreateDocumentPage.tsx                    # Main page wrapper
├─ CreateDocumentPageContainer/              # Main container
│  └─ CreateDocumentPageContainer.tsx
├─ components/
│  ├─ SourceSelector/                        # NEW: Main source selection
│  │  ├─ SourceSelector.tsx
│  │  ├─ SourceCard/
│  │  └─ QuickActions/
│  ├─ TextPromptForm/                        # NEW: Text prompt input
│  ├─ VideoUrlForm/                          # NEW: Video URL processor
│  ├─ WebsiteScrapingForm/                   # Enhanced existing
│  ├─ FileUploadForm/                        # Enhanced existing
│  ├─ ProcessingProgress/                    # NEW: Real-time feedback
│  └─ ContentPreview/                        # NEW: Live preview
├─ context/
│  ├─ CreateDocumentPageProvider.tsx
│  └─ hooks/
│     ├─ useSourceSelection.ts               # NEW: Source management
│     ├─ useTextPromptGeneration.ts          # NEW: AI text generation
│     ├─ useVideoProcessing.ts               # NEW: Video content extraction
│     ├─ useWebsiteScraping.ts               # Enhanced existing
│     ├─ useFileProcessing.ts                # Enhanced existing
│     └─ useDocumentGeneration.ts            # NEW: Common generation logic
└─ types/
   ├─ ISourceTypes.ts                        # NEW: Source type definitions
   ├─ IProcessingOptions.ts                  # NEW: Processing configuration
   └─ IDocumentGeneration.ts                 # NEW: Generation interfaces
```

### State Management

```typescript
// Redux Slice: createDocumentPageSlice.ts
interface ICreateDocumentPageState {
  selectedSource: SourceType | null;
  isProcessing: boolean;
  processingStep: ProcessingStep;
  processingProgress: number;
  documentPreview: DocumentPreview | null;
  error: string | null;
  
  // Source-specific states
  textPrompt: {
    title: string;
    description: string;
    options: TextPromptOptions;
  };
  
  videoUrl: {
    url: string;
    platform: VideoPlatform;
    options: VideoProcessingOptions;
  };
  
  websiteUrl: {
    url: string;
    options: ScrapingOptions;
  };
  
  fileUpload: {
    files: FileList | null;
    options: FileProcessingOptions;
  };
}
```

### Accessibility Considerations

1. **Keyboard Navigation**: Full keyboard support for all interactions
2. **Screen Reader Support**: Proper ARIA labels and descriptions
3. **Visual Indicators**: Clear status indicators and error messages
4. **Focus Management**: Logical tab order and focus trapping in modals
5. **Color Contrast**: High contrast ratios for all text and UI elements
6. **Loading States**: Clear progress indicators and alternative text

### Performance Optimizations

1. **Lazy Loading**: Load source-specific components only when needed
2. **Code Splitting**: Separate bundles for each source type
3. **Caching**: Cache processed content and user preferences
4. **Background Processing**: Process content without blocking UI
5. **Error Recovery**: Graceful handling of failures with retry options

---

## Conclusion

This redesigned UI/UX for the Create Document Page provides:

1. **Scalability**: Easy addition of new content sources
2. **User Experience**: Intuitive source selection with clear guidance
3. **Flexibility**: Advanced options for power users
4. **Responsiveness**: Optimal experience across all device sizes
5. **Accessibility**: Inclusive design for all users
6. **Performance**: Fast and efficient content processing

The modular design allows for incremental implementation, starting with the core source selector and gradually adding new source types and advanced features.