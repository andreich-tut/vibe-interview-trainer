# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interview preparation project for React/frontend developer positions. It contains:

- **`vibe-interview-app/`** — A React Router v7 (framework mode) app with SSR, Tailwind CSS v4, and TypeScript. This is the main application being developed.
- **`reference/`** — Reference materials, standalone tools (e.g., `event-loop-trainer.html`), and interview question banks (`reference/questions/`) covering JS, React, Next.js, Node.js, CSS, CI/CD, and testing.
- **`planning/`** — Task plans saved by Claude for each work session. Files follow the format `{datetime}_{taskname}_plan.md`.

## Commands

All commands must be run from the `vibe-interview-app/` directory:

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run start      # Serve production build (port 3000)
npm run typecheck  # Run react-router typegen + tsc
```

## Architecture

### vibe-interview-app

- **Framework**: React Router v7 in framework mode (SSR enabled via `react-router.config.ts`)
- **Routing**: File-based via `app/routes.ts` using `@react-router/dev/routes` — routes: `home.tsx`, `topic-theory.tsx`, `topic-practice.tsx`, `event-loop.tsx`
- **E2E Tests**: Playwright specs in `vibe-interview-app/e2e/`
- **Styling**: Tailwind CSS v4 via Vite plugin (`@tailwindcss/vite`), imported in `app/app.css`
- **Type generation**: React Router auto-generates route types in `.react-router/types/` — route components import types from `./+types/<routeName>`
- **Path alias**: `~/` maps to `./app/` (configured in `tsconfig.json`)
- **Fonts**: Inter loaded via Google Fonts in `root.tsx`

## Rules

### Rules Go in CLAUDE.md
When the user asks to add, change, or remove a rule, always persist it in this file (`CLAUDE.md`). Do not store rules only in auto-memory — `CLAUDE.md` is the single source of truth for project rules.

### Task Plans — Save to `planning/` Directory
When starting a new task or feature, create a plan file in `planning/`:
- Filename format: `{datetime}_{taskname}_plan.md`
  - Example: `2026-03-12T14-30_dark-theme-refactor_plan.md`
- The plan should describe the task, approach, steps, and affected files
- Save the plan before starting implementation

### Screenshots — Save to `test-screenshots/` Directory
When running Playwright tests or creating screenshots for development:
- Save all screenshots to `test-screenshots/` folder at project root
- For each task/feature, create a subfolder with format: `{YYYY-MM-DD}__{task-short-name}`
  - Example: `2026-03-11__ui-refactor/`, `2026-03-10__playwright-check/`
- Group related screenshots (home page, theory page, etc.) in same folder
- Use clear filenames: `home-full-page.png`, `theory-card-detail.png`, etc.

### Specialist Subagents — Research Only

The `.claude/agents/` directory contains subagent configurations for a structured frontend development workflow.

**Rule: Subagents do NOT write files to disk** — their writes go to an isolated environment and are lost. Use subagents only for research, exploration, and planning (reading files, searching code, fetching docs). All file writes (Edit, Write, Bash) must happen in the main conversation.

### Agent Communication — Transparency About Tool Use

During task implementation, always communicate which agent you are using for each phase of work. If no specialized agent is available for the current task, explicitly state that. Transparency helps the user understand your approach and decision-making process.

### Architecture — FSD-lite (pages + shared)

The app uses a feature-sliced design lite structure. `components/` and `hooks/` directories no longer exist.

```
app/
├── routes/          # THIN — only re-exports from pages/: export { default, meta } from "~/pages/X/index"
├── pages/           # One folder per route; owns layout, UI sub-components, and hooks
│   ├── Home/
│   │   ├── index.tsx
│   │   ├── ui/TopicCard.tsx
│   │   └── model/useProgress.ts
│   ├── Theory/
│   │   ├── index.tsx
│   │   ├── ui/          # TheoryCard, TheoryPageHeader, TheoryPracticeCta, TheoryToc
│   │   └── model/       # useActiveSection, useTheoryContent, useTocOutsideClick
│   ├── Practice/
│   │   ├── index.tsx
│   │   ├── ui/
│   │   │   ├── ApiKeyInput.tsx, PracticePlaying.tsx, PracticeSetup.tsx, PracticeFinished.tsx
│   │   │   └── FlashCard/       # index.tsx, types.ts, ui/, model/
│   │   └── model/       # useCardDeck, usePracticeSession, useSessionStats, useTopicContent
│   └── EventLoop/
│       ├── index.tsx
│       └── ui/StepVisualizer.tsx
├── shared/          # Cross-route only; replaces old components/
│   ├── ui/          # Pure primitives + shared cross-feature components
│   │   └── (badge, button, card, input, progress, textarea, StarRating, CodeBlock, TopicIcon)
│   └── layout/
│       ├── Layout.tsx
│       ├── LanguageSwitcher.tsx
│       └── model/useTheme.ts
├── contexts/        # LanguageContext/ (unchanged)
└── lib/             # Pure functions only, no hooks
```

#### Component folder pattern (recursive)

Any component complex enough to warrant it gets its own folder:
```
ComponentName/
├── index.tsx        # public API
├── types.ts         # (if needed)
├── ui/              # sub-components, only imported by this index.tsx
└── model/           # hooks owned by this component
```

#### Rules
- Routes are thin: only `export { default, meta } from "~/pages/X/index"`. No logic in routes.
- A hook lives in `model/` of the component that **calls** it first.
- `shared/ui/` = pure primitives + shared cross-feature components. Must not import from pages/.
- `shared/layout/` = Layout, LanguageSwitcher, and `model/useTheme.ts`.
- `lib/` = pure functions only, no hooks.
- No `components/` or `hooks/` directories — these are deleted.

### Context Structure — Folder Pattern

Contexts use the folder pattern: one folder with an `index.ts` barrel plus split files.

```
app/contexts/
  LanguageContext/
    index.ts            # barrel: re-exports everything
    LanguageProvider.tsx
    languageContext.ts  # createContext + types
    useLanguage.ts      # hook
```

Apply this pattern to any new context added to the project.
