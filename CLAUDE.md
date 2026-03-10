# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an interview preparation project for React/frontend developer positions. It contains:

- **`vibe-interview-app/`** — A React Router v7 (framework mode) app with SSR, Tailwind CSS v4, and TypeScript. This is the main application being developed.
- **`questions/`** — Interview question banks (in Russian) covering JS, React, Next.js, Node.js, CSS, CI/CD, and testing.
- **`event-loop-trainer.html`** — A standalone HTML tool for practicing JavaScript event loop concepts.

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

### HISTORY.md — Persist Every User Prompt
Every user prompt/request must be logged in `HISTORY.md` at the project root:
- Log each prompt as `> quoted text` under a numbered heading
- After accomplishment, rate success: `✅ Success` / `⚠️ Partial` / `❌ Failed`
- Include brief outcome description with the rating
- This applies to ALL prompts, even small ones — do not skip

### PROGRESS.md — Always Update After Completed Tasks
After every completed task or work session, update `PROGRESS.md` at the project root:
- Add a new Phase/section under `## ✅ COMPLETED` with `[x]` checkboxes
- Describe what was done and why (e.g., root cause + fix for bugs)
- Keep entries concise but specific enough to be useful in future sessions
- This is a **mandatory step** — do not skip it even for small fixes

### Specialist Subagents

The `.claude/agents/` directory contains subagent configurations for a structured frontend development workflow: planning-agent → project-setup-agent → design-system-agent → api-mock-agent → react-ui-builder / react-logic-builder → test-agent → reviewer-agent.
