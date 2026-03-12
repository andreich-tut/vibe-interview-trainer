# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interview preparation project for React/frontend developer positions. It contains:

- **`vibe-interview-app/`** — A React Router v7 (framework mode) app with SSR, Tailwind CSS v4, and TypeScript. This is the main application being developed.
- **`questions/`** — Interview question banks (in Russian) covering JS, React, Next.js, Node.js, CSS, CI/CD, and testing.
- **`reference/`** — Reference materials and standalone tools (e.g., `event-loop-trainer.html`).
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
- **Routing**: File-based via `app/routes.ts` using `@react-router/dev/routes` — currently a single index route (`routes/home.tsx`)
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

### Screenshots — Save to `dev-screen/` Directory
When running Playwright tests or creating screenshots for development:
- Save all screenshots to `dev-screen/` folder at project root (not project root directly)
- For each task/feature, create a subfolder with format: `{YYYY-MM-DD}__{task-short-name}`
  - Example: `2026-03-11__ui-refactor/`, `2026-03-10__playwright-check/`
- Group related screenshots (home page, theory page, etc.) in same folder
- Use clear filenames: `home-full-page.png`, `theory-card-detail.png`, etc.

### Specialist Subagents — ALWAYS USE

The `.claude/agents/` directory contains subagent configurations for a structured frontend development workflow: planning-agent → project-setup-agent → design-system-agent → api-mock-agent → react-ui-builder / react-logic-builder → test-agent → reviewer-agent.

**Rule: Always delegate implementation work to specialist subagents.** Never write component code, hooks, CSS, or logic directly in the main conversation. The main conversation is for planning, coordination, and user communication only. Use agents for all code changes.
