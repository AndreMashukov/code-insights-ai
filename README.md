# Code Insights AI

AI-powered study platform for turning source material into interactive learning content. Upload or import documents, organize them in folders, and generate quizzes, flashcards, slide decks, and other study artifacts with Gemini—all scoped to your personal library and directory structure.

## What It Does

Code Insights AI helps you learn from your own content instead of generic question banks.

**Organize your library**
- Browse documents in a folder tree with nested directories
- Create, move, rename, and delete folders
- Open a directory to see all artifacts tied to that topic in one place

**Bring in source material**
- Upload files or paste text
- Scrape content from URLs
- View documents in a markdown reader and ask follow-up questions about the text

**Generate study content with AI**
- **Quizzes** — multiple-choice questions with explanations
- **Diagram quizzes** — visual questions with Mermaid diagrams
- **Sequence quizzes** — put steps or items in the correct order
- **Flashcards** — term/definition sets for review
- **Slide decks** — presentation-style summaries of your material

**Customize generation with rules**
- Define reusable AI rules (tone, difficulty, focus areas, etc.)
- Assign rules globally or per directory so generation follows your preferences

**Track how you study**
- Dashboard with study activity over time
- Interaction stats broken down by directory and artifact type

**Account & settings**
- Firebase Authentication (email/password)
- Profile and app settings

## How It Works

1. Sign in and create or select a directory in your library.
2. Add a document (upload, paste, or URL).
3. Generate quizzes, flashcards, slides, or other artifacts from that document.
4. Study in the app; optional rules steer how the AI builds new content.
5. Review stats on the dashboard to see where you spend time.

Data is stored per user in Firestore (`users/{userId}/...`) with document bodies in Firebase Storage. The web app talks to Firebase callable Functions, which call Gemini for generation.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Redux Toolkit, RTK Query, shadcn/ui, Tailwind CSS |
| Backend | Firebase Functions v2, Firestore, Storage, Auth |
| AI | Google Gemini (via Functions) |
| Monorepo | Nx (`web`, `functions`, `shared-types`) |

## Quick Start

1. **Install dependencies** (from the repo root):

   ```bash
   yarn install
   ```

2. **Configure environment** — copy env examples and set Firebase values:

   - Root `.env` — `NX_PUBLIC_*` vars for the web app
   - `functions/.env` — `GEMINI_API_KEY`, `STORAGE_BUCKET`

   For local development, set `NX_PUBLIC_USE_FIREBASE_EMULATOR=true` and start emulators (see [CLAUDE.md](./CLAUDE.md)).

3. **Start the web app**:

   ```bash
   NX_DAEMON=false NX_ISOLATE_PLUGINS=false yarn nx run web:dev
   ```

   Opens at [http://localhost:4200](http://localhost:4200).

4. **Start Functions + emulators** (separate terminal):

   ```bash
   NX_DAEMON=false NX_ISOLATE_PLUGINS=false yarn nx run functions:serve
   ```

5. **Seed test data** (with emulators running):

   ```bash
   npx tsx scripts/seed-setup/setup-seed-data.ts
   ```

## Common Commands

| Command | Description |
| --- | --- |
| `yarn nx run web:dev` | Web dev server (port 4200) |
| `yarn nx run web:build` | Production web build |
| `yarn nx run web:typecheck` | TypeScript check |
| `yarn nx run web:lint` | ESLint |
| `yarn nx run functions:serve` | Build functions and start Firebase emulators |
| `yarn backup:all` | Firestore backup script |

## Project Layout

```
web/src/           React app (pages, components, store)
functions/src/     Firebase callable functions + Gemini integration
libs/shared-types/ Shared TypeScript types
docs/              Architecture and workflow docs
```

For coding conventions, architecture patterns, and agent guidelines, see [AGENTS.md](./AGENTS.md) and [CLAUDE.md](./CLAUDE.md).

## Optional: VS Code Shell Integration

```bash
yarn setup-shell-integration
```

Adds terminal decorations, Nx shortcuts, and project-aware navigation. Details: [scripts/shell-integration/README.md](./scripts/shell-integration/README.md).
