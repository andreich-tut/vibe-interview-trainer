# HISTORY.md — Project Conversation History

## Session 1: Analysis & Planning

### User Request
> Analyze this codebase and create a CLAUDE.md file, which will be given to future instances of Claude Code to operate in this repository.

**Outcome:** Created CLAUDE.md with project overview, commands, and architecture

---

### User Request
> Make interview training react app plan based on event-loop-trainer and /questions dir. It should be simple vite app. For every section must be available theory. Save plan in PLAN.MD at project root. Ask me if you have some questions

**Questions Asked:**
1. What format should the quiz/practice be for non-event-loop topics?
   - **Answer:** Flashcard Q&A

2. Where should the theory content come from?
   - **Answer:** AI-generate now

3. Should the app language be Russian or English?
   - **Answer:** Russian

4. Should this be a brand new Vite+React project or replace existing?
   - **Answer:** Use vibe-interview-app as base

**Outcome:** Created comprehensive PLAN.md with:
- Route structure (4 routes)
- Data model (interfaces)
- File structure (~25 new files)
- Implementation phases (5 phases)
- Key decisions

---

### User Request
> implement @PLAN.md

**Work Completed:**

#### Phase 1: Foundation
- Modified root.tsx (Russian lang, JetBrains Mono + Unbounded fonts)
- Rewrote app.css (dark theme CSS variables)
- Created Layout.tsx (shared header component)
- Created data/topics.ts (topic configuration)
- Updated routes.ts (4 new routes)
- Rebuilt home.tsx (landing page with topic grid)

#### Phase 2: Data
- Created 7 theory files with AI-written content (JavaScript, React, Next.js, Node.js, CSS, CI/CD, Testing)
- Created 7 flashcard files with Q&A (10 cards per topic = 70 total)
- Created event-loop.ts (13 event loop questions with step visualization)

#### Phase 3: Topic Pages
- Created FlashCard.tsx component
- Created topic-theory.tsx route
- Created topic-practice.tsx route

#### Phase 4: Event Loop Trainer
- Created CodeBlock.tsx (syntax highlighting)
- Created StepVisualizer.tsx (execution steps)
- Created event-loop.tsx route (full trainer port)

#### Phase 5: Cleanup
- Deleted app/welcome/ directory
- Fixed TypeScript errors
- Verified dev server and typecheck

**Outcome:** Fully functional interview training app with 7 topics + event loop trainer

---

### User Request
> save current progress description in PROGRESS.md at project root

**Outcome:** Created PROGRESS.md with complete implementation summary

---

### User Request
> save all your prompts in HISTORY.md at project root. add this rule to memory

**This Request:** Creating HISTORY.md (this file) and updating memory with rule to always save prompts.

---

## Summary Statistics

- **Total Files Created:** ~60
- **Total Files Modified:** 6
- **Routes Added:** 4
- **Topics Implemented:** 7
- **Theory Sections:** 36+
- **Flashcards:** 70
- **Event Loop Questions:** 13
- **Lines of Code:** ~3,000+

## Key Files Created

### Routes
- app/routes/home.tsx
- app/routes/topic-theory.tsx
- app/routes/topic-practice.tsx
- app/routes/event-loop.tsx

### Components
- app/components/Layout.tsx
- app/components/TopicCard.tsx
- app/components/FlashCard.tsx
- app/components/CodeBlock.tsx
- app/components/StepVisualizer.tsx

### Data Files
- app/data/topics.ts
- app/data/event-loop.ts
- app/data/theory/* (7 files)
- app/data/cards/* (7 files)

### Documentation
- CLAUDE.md
- PLAN.md
- PROGRESS.md
- HISTORY.md (this file)

---

## Technology Stack

- React Router v7 (framework mode, SSR)
- Tailwind CSS v4
- TypeScript (strict mode)
- No additional dependencies

---

---

## Session 2: Visual Improvements & UX Overhaul (2026-03-10)

### Prompt 1
> pages with theory looking sad. add some visual improvements like code highlighting and common markdown

**Result:** ✅ Success — Added `.prose-dark` CSS styles (h3/h4/p/ul/li/strong/code), editor chrome on code blocks (macOS dots), regex syntax highlighting (5 token types: keywords, strings, numbers, comments, builtins). Fixed existing bug where JSX in `<pre>` blocks was parsed as HTML.

---

### Prompt 2
> explore the app with playwright, suggest options for improving the ui and ux. suggest options for improving common app usage logic

**Result:** ✅ Success — Explored all 4 routes (home, theory, practice, event-loop) with Playwright on desktop + mobile. Produced categorized list of 25+ suggestions across 4 categories: Quick UI Wins (A), UX Flow (B), App Logic (C), Accessibility (D). Each with files affected, effort estimate, and priority.

---

### Prompt 3
> start with recommended

**Result:** ✅ Success — Implemented top 10 priority items:
- B1: Disabled Next button until answer revealed
- B5: Fixed `href` → React Router `Link` (no page reloads)
- A1: Theory section dividers + numbered headers
- A2: Sticky bottom CTA bar on theory pages
- A6: Table of contents with smooth scroll
- B7: Self-assessment buttons (Знал/Не знал) with score tracking
- B2: Keyboard shortcuts (Space reveal, Arrow keys assess)
- D1: Fixed hardcoded `hover:bg-blue-600` theme bug
- B3: "Back to theory" link on practice pages
- Bug fix: `&#039;` literal text in code blocks, off-by-one completion bug

All verified with Playwright screenshots + typecheck + production build.

---

### Prompt 4
> save list of remaining bugs in md file at project root

**Result:** ✅ Success — Created `BUGS.md` with 5 known bugs (B1–B5) and 6 remaining UX improvements (U1–U6), each with location, impact, and suggested fix.

---

### Prompt 5
> add rule that all my prompts that i sent or will send to you should be persisted in HISTORY.md and after accomplishment should be rated by success

**Result:** ✅ Success — Updated memory rule to require logging every prompt with success rating. Updated HISTORY.md with all session 2 prompts and ratings. Added rule to CLAUDE.md.

---

### Prompt 6
> How do i check memory rules? I thought you persist that in CLAUDE.md

**Result:** ✅ Success — Added the HISTORY.md prompt-logging rule to `CLAUDE.md` (the canonical rules file). Explained difference between CLAUDE.md (project rules, in git) and auto-memory (internal notes, not in git).

---

### Prompt 7
> Now add rule: all rules that i ask to add should be persisted in CLAUDE.md

**Result:** ✅ Success — Added "Rules Go in CLAUDE.md" rule to `CLAUDE.md`. It is now the single source of truth for all project rules.

---

### Prompt 8
> suggest plan to improve knowledge process testing. i guess a variant with "know/didn't know" is not effective

**Result:** ⚠️ Partial — Explored codebase, designed 3 approaches (confidence-calibrated, keyword matching + spaced repetition, hybrid mode). Recommended hybrid: typed recall + 4-point scale + wrong-card replay + localStorage. Decision pending on validation approach.

---

### Prompt 9
> save conversation of tests improvement in md file at project root

**Result:** ✅ Success — Created `TESTING-IMPROVEMENT.md` with full conversation: problem statement, 3 approaches considered, recommended approach details, side-by-side mockups, data model, files to modify.

---

### Prompt 10
> Implement the following plan: # Plan: Improve Knowledge Testing Process (Hybrid Mode with Gemini Flash AI validation)

**Result:** ✅ Success — Implemented complete knowledge testing overhaul:
- Created `app/lib/gemini.ts` — Gemini 2.0 Flash API client (free tier)
- Created `app/hooks/useProgress.ts` — localStorage persistence with useSyncExternalStore
- Created `app/components/ApiKeyInput.tsx` — API key input/manage UI
- Rewrote `app/components/FlashCard.tsx` — typed mode, 4-point scale (0-3), Gemini AI scoring, keyboard shortcuts
- Rewrote `app/routes/topic-practice.tsx` — setup phase with mode toggle, wrong-card replay queue (max 2 rounds), 5-column results grid, "Повторить ошибки" button
- Updated `app/components/TopicCard.tsx` — progress bar from localStorage
- Updated `app/routes/home.tsx` — passes progress data to TopicCards
- Updated `TESTING-IMPROVEMENT.md` — documented Gemini Flash decision
- TypeScript typecheck: passes. Production build: passes.

---

### Prompt 11
> gemeni usage requires payment method. suggest few analog llms

**Result:** ✅ Success — Suggested Groq (Llama 3.3 70B), OpenRouter, and Hugging Face as free alternatives. Recommended Groq.

---

### Prompt 12
> give me groq dashboard pane url

**Result:** ✅ Success — Provided https://console.groq.com

---

### Prompt 13
> replace gemini implementation with groq usage

**Result:** ✅ Success — Replaced Gemini Flash with Groq (Llama 3.3 70B):
- Renamed `app/lib/gemini.ts` → `app/lib/llm.ts` (provider-neutral name)
- Switched to OpenAI-compatible API (`api.groq.com/openai/v1/chat/completions`)
- Updated localStorage key from `gemini-api-key` to `groq-api-key`
- Updated `ApiKeyInput.tsx`: Groq branding, link to `console.groq.com/keys`, `gsk_...` placeholder
- Updated all imports in FlashCard.tsx, ApiKeyInput.tsx, topic-practice.tsx
- Renamed `GeminiResult` → `LLMResult`
- Deleted old `gemini.ts`
- TypeScript typecheck: passes. Production build: passes.

---

### Prompt 14
> remove self-assignment mechanic. app should use only ai checking for test answers

**Result:** ✅ Success — Removed all self-assessment, now AI-only:
- FlashCard: removed mode prop, 4-point manual buttons, SCORE_BUTTONS array. Always shows textarea → user types → clicks "Проверить" → AI scores → "Далее" button. On error: "Повторить проверку" + "Пропустить".
- topic-practice: removed mode toggle (quick/typed), removed PracticeMode type. Setup requires API key before starting. Renamed `onRate` → `onScore`.
- Exported `Score` type from FlashCard for shared use.
- TypeScript typecheck: passes. Production build: passes.

---

### Prompt 15
> check project with linter for errors

**Result:** ✅ Success — Fixed all 6 ESLint errors:
- FlashCard.tsx: removed `useEffect` that called `setState` to reset on card change — replaced with `key={card.id}` on parent mount (React remounts component, naturally resetting state)
- topic-theory.tsx: added `/* eslint-disable/enable no-control-regex */` block around `highlightCode()` — the `\x01` control chars are intentional placeholders, not bugs

---

### Prompt 16
> run javascript section tests and check flow manually via browser

**Result:** ✅ Success — Full Playwright walkthrough of JavaScript practice (10 cards + 1 replay):
- Found and fixed critical bug: `useProgress` hook caused infinite re-render loop (`useSyncExternalStore` + `JSON.parse` on every render creating new references). Fixed by caching raw string + parsed result.
- Verified: API key save/mask, Начать gating, textarea input, Ctrl+Enter check, AI scoring (0/3, 2/3, 3/3), Enter for Далее, replay round for failed cards, results screen (73%, 5-column grid), home page progress bar (10/10).
- All keyboard shortcuts work. No console errors.

---

## Current Status

✅ **COMPLETE** — App is fully functional with AI-only knowledge testing (Groq)

### Running
```bash
cd vibe-interview-app
npm run dev  # localhost:5173
```

### Testing
```bash
npm run typecheck  # TypeScript check
npm run build      # Production build
```
