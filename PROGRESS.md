# PROGRESS.md — Interview Training React App

## ✅ COMPLETED

### Phase 1: Foundation ✅
- [x] Modified `app/root.tsx` — lang="ru", swapped fonts to JetBrains Mono + Unbounded
- [x] Rewrote `app/app.css` — dark theme CSS variables (matching event-loop-trainer palette)
- [x] Created `app/components/Layout.tsx` — shared header with navigation
- [x] Created `app/data/topics.ts` — master topic configuration (7 topics)
- [x] Modified `app/routes.ts` — added 4 new routes
- [x] Rebuilt `app/routes/home.tsx` — landing page with topic grid + Event Loop trainer card

### Phase 2: Data ✅
- [x] Created 7 theory files in `app/data/theory/`
  - javascript.ts — 5 sections (scope, async, prototypes, this, ES6+, modules)
  - react.ts — 5 sections (components, hooks, lifecycle, performance, API)
  - nextjs.ts — 5 sections (basics, rendering modes, routing, API routes, optimization)
  - nodejs.ts — 5 sections (basics, modules, servers, bots, tasks)
  - css.ts — 6 sections (selectors, Flexbox, Grid, responsive, animations, preprocessors)
  - cicd.ts — 5 sections (basics, tools, testing, versioning, monitoring)
  - testing.ts — 6 sections (unit, React components, snapshots, E2E, mocking)

- [x] Created 7 flashcard files in `app/data/cards/`
  - 10 Q&A cards per topic (70 total flashcards)
  - Questions parsed from `questions/*.txt`
  - AI-generated concise answers in Russian

- [x] Created `app/data/event-loop.ts`
  - 13 event loop questions (5 easy, 4 medium, 4 hard)
  - Step-by-step execution visualization
  - Detailed explanations

### Phase 3: Topic Pages ✅
- [x] Created `app/components/FlashCard.tsx` — question/answer reveal component
- [x] Created `app/routes/topic-theory.tsx` — parameterized theory page (/:topicId/theory)
- [x] Created `app/routes/topic-practice.tsx` — flashcard practice (/:topicId/practice) with shuffled cards

### Phase 4: Event Loop Trainer ✅
- [x] Created `app/components/CodeBlock.tsx` — syntax-highlighted code display
- [x] Created `app/components/StepVisualizer.tsx` — step-by-step visualization
- [x] Created `app/routes/event-loop.tsx` — full trainer port
  - Splash screen with level selection (easy/medium/hard)
  - Quiz screen with code display, input, checking
  - Results screen with score breakdown
  - Feedback with step visualization

### Phase 5: Cleanup & Testing ✅
- [x] Deleted `app/welcome/` directory (no longer needed)
- [x] Fixed all TypeScript errors (type-only imports, proper typing)
- [x] Tested dev server — `npm run dev` starts successfully
- [x] Verified `npm run typecheck` passes without errors

## 📍 Current State

**App is fully functional and ready to use.**

### Routes
- `/` — Landing page (topic grid + Event Loop link)
- `/:topicId/theory` — Theory content for JavaScript, React, Next.js, Node.js, CSS, CI/CD, Testing
- `/:topicId/practice` — Flashcard Q&A practice
- `/event-loop` — Event Loop trainer (splash → quiz → results)

### Technology
- React Router v7 (framework mode, SSR)
- Tailwind CSS v4 (dark theme)
- TypeScript (strict mode)
- No external dependencies added
- ~60 files created/modified

### Features
- ✅ Dark theme matching event-loop-trainer design
- ✅ Russian language throughout
- ✅ Theory content (HTML formatted)
- ✅ Flashcard Q&A (question reveal/answer)
- ✅ Shuffled cards for practice
- ✅ Event Loop trainer with code highlighting
- ✅ Step-by-step execution visualization
- ✅ Progress tracking
- ✅ Results screen with scoring

### Phase 6: Visual Bug Fixes ✅
- [x] Fixed CSS cascade issue — moved all global element styles into `@layer base {}` in `app.css`
  - **"Теория" button text invisible** — global `a { color: accent }` outside Tailwind layers overrode `text-white` (purple text on purple background). Fixed by layering.
  - **"← Назад" wrong color** — `text-muted` Tailwind class was overridden by unlayered `a { color }`. Fixed.
  - **Oversized buttons** — `button { padding: 0.75rem 1.5rem }` outside layers overrode `py-2 px-4` utilities. Removed default padding from base rule.
- [x] Fixed hydration error on practice page — `useMemo` with `Math.random()` produced different card order on SSR vs client. Changed to `useState(allCards)` + `useEffect` to shuffle on client-only after mount.
- [x] Moved component CSS classes into `@layer components {}` (`.btn-primary`, `.badge-*`, `.progress-*`, `.feedback`)
- [x] Fixed `CodeBlock.tsx` syntax highlighting — `str` regex ran after `kw`/`fn`/`num` had inserted `<span class="kw">` HTML; the str regex then matched `"kw"`, `"fn"`, `"num"` as quoted strings inside HTML attributes, producing malformed markup rendered as literal text (e.g. `"kw">console."fn">log(`). Fixed by moving `str` regex to run first on raw code.
- [x] Verified `npm run typecheck` passes after changes

### Phase 7: Theory Page Visual Improvements ✅
- [x] Added comprehensive `.prose-dark` CSS styles in `app.css` (h3, h4, p, ul/ol/li, strong, inline code)
- [x] Added `.theory-code` / `.theory-code-header` / `.theory-code-dot` CSS classes — editor chrome (macOS dots) wrapping code blocks
- [x] Added syntax highlight token classes: `.hl-kw` (purple), `.hl-str` (green), `.hl-num` (orange), `.hl-cm` (grey italic), `.hl-builtin` (cyan)
- [x] Added `processContent()` + `highlightCode()` functions in `topic-theory.tsx`
  - HTML-escapes `<pre>` block content so JSX/HTML in code renders as literal text (was a bug — `<button>` tags were interpreted as HTML)
  - Uses null-byte placeholder markers to avoid double-replacement in regex chains
  - Wraps each block in editor chrome div with macOS traffic light dots
- [x] Verified `npm run typecheck` passes

### Phase 8: UI/UX Improvements ✅

**Flashcard self-assessment & keyboard (B1, B7, B2):**
- [x] Replaced single "Следующая" button with "Знал ✓" (green) / "Не знал ✗" (red) self-assessment
- [x] Disabled Next button until answer is revealed — prevents skipping
- [x] Added keyboard shortcuts: Space/Enter to reveal, ArrowRight for "Знал", ArrowLeft for "Не знал"
- [x] Keyboard hint text shown below card
- [x] `aria-expanded` on reveal button for accessibility
- [x] Category badge now a colored pill (purple bg) instead of faint muted text

**Completion screen with score stats:**
- [x] 3-column score grid: Знал (green) / Не знал (red) / Результат % (cyan)
- [x] Dynamic emoji + title based on score (🏆 100%, 🎉 ≥80%, 👍 ≥50%, 📚 <50%)
- [x] Three action buttons: Повторить / К теории / На главную
- [x] Fixed bug: "Next" on last card never triggered completion (off-by-one in handleNext)

**Theory page navigation & visual hierarchy (A1, A2, A6, B5):**
- [x] Added Table of Contents at top with numbered section links + smooth scroll
- [x] Added section dividers (border-top) between theory sections
- [x] Added numbered prefixes ("01", "02") on section headers — H2 now text-xl
- [x] Added sticky bottom CTA bar ("Готов к практике? Начать практику →")
- [x] Fixed `<a href>` → `<Link to>` for practice CTA — no more full page reloads

**Navigation improvements (B3):**
- [x] Added "← Вернуться к теории" link on practice page
- [x] Fixed `<a href="/">` → `<Link to="/">` on completion screen

**Bug fix — code block string rendering:**
- [x] Removed unnecessary HTML escaping of `'` and `"` in processContent
- [x] Simplified string highlight regex to clean `((['"\`])...\2)` pattern
- [x] Fixed `&#039;` showing as literal text in code blocks

**Theme fix (D1):**
- [x] Fixed `hover:bg-blue-600` → `hover:bg-[#6a56f0]` in TopicCard

**Verified:** TypeScript passes, production build succeeds, Playwright tested (desktop + mobile)

### Phase 9: Knowledge Testing Overhaul (Gemini Flash + Typed Recall)
- [x] Created `app/lib/gemini.ts` — Gemini 2.0 Flash API client
  - System prompt with 0-3 scoring rubric + JSON output
  - Temperature 0.1 for deterministic scoring
  - `responseMimeType: "application/json"` for reliable parsing
  - Error handling: NO_API_KEY, RATE_LIMITED, GEMINI_ERROR_*
  - API key stored in localStorage (user enters once)
- [x] Created `app/hooks/useProgress.ts` — cross-session persistence
  - `useSyncExternalStore` for reactive localStorage reads
  - `saveCardResult(topicId, cardId, score)` — saves per-card history
  - `getTopicProgress(topicId)` — returns { total, mastered, pct }
  - `incrementSessions()` — tracks completed sessions
- [x] Created `app/components/ApiKeyInput.tsx` — API key management UI
  - Masked key display, save/remove, link to Google AI Studio
  - Inline on practice setup when typed mode selected
- [x] Rewrote `app/components/FlashCard.tsx` — core card component
  - Two modes: `quick` (mental recall) and `typed` (textarea)
  - 4-point scoring: Точно знал (3) / Примерно (2) / С трудом (1) / Не знал (0)
  - Gemini AI check fires on reveal in typed mode (background)
  - AI score shown as colored badge with feedback text
  - AI-suggested score highlighted with pulsing border
  - Keyboard: 1/2/3/4 for scores, Space to reveal, Ctrl+Enter to check
  - Graceful fallback: works 100% without API key
- [x] Rewrote `app/routes/topic-practice.tsx` — practice flow
  - Setup phase: mode toggle (quick/typed) + API key input
  - Wrong-card queue: cards rated 0-1 replay after main deck (max 2 rounds)
  - Round indicator: "Раунд повтора 1/2" badge
  - Results screen: 5-column grid (Точно/Примерно/С трудом/Не знал/Итого %)
  - "Повторить ошибки" button: restart with only failed cards
  - localStorage: saves each card result + session count via useProgress
- [x] Updated `app/components/TopicCard.tsx` — progress indicator
  - Mini progress bar (green-to-cyan gradient)
  - "mastered/total" text below bar
- [x] Updated `app/routes/home.tsx` — reads progress and passes to TopicCards
- [x] Updated `TESTING-IMPROVEMENT.md` — documented Gemini Flash decision
- [x] TypeScript typecheck passes, production build succeeds

### Phase 10: Answer Evaluation Quality Improvement ✅
- [x] Fixed factual errors in card data:
  - Rewrote all 10 Next.js cards for App Router (was Pages Router — 3 years outdated)
  - Fixed CSS specificity: tuple (inline, ID, class, element), not point system
  - Fixed CSS media query: `prefers-color-scheme: dark` (was `prefers-dark-scheme`)
  - Fixed JS modules: import is statically analyzed, not "asynchronous"
- [x] Replaced 3 irrelevant Node.js questions:
  - Telegram bot → Streams (Readable/Writable/Duplex/Transform)
  - Discord bot → Error handling patterns (uncaughtException, unhandledRejection)
  - node-cron → Worker Threads vs child_process
- [x] Added `keyPoints: string[]` to Card interface (3-5 points per card, all 70 cards)
- [x] Rewrote LLM system prompt (`llm.ts`):
  - Key-point based evaluation (checklist approach)
  - Scores based on key points coverage, not exact wording
  - Feedback must mention which key points were missed
  - Rules: evaluate meaning not wording, accept different phrasings, be strict on factual errors
- [x] Updated `checkAnswer()` with optional `keyPoints` parameter
- [x] Updated `FlashCard.tsx` to pass `keyPoints` to `checkAnswer()`
- [x] Increased max_tokens 200→300 for richer feedback
- [x] TypeScript typecheck passes, production build succeeds
- [x] Saved plan in `IMPROVEMENT-PLAN.md`

## 🚀 Next Steps (Optional Enhancements)

If you want to extend further:

1. **Add animations** — fade-in/slide transitions on card reveals
2. **Add progress persistence** — localStorage to save progress
3. **Add favorites** — mark questions to review later
4. **Add search** — filter cards by keyword
5. **Add more topics** — expand beyond 7 topics
6. **Add code examples** — interactive runnable code snippets
7. **Add streak counter** — gamification features
8. **Add categories** — organize cards by difficulty/topic
9. **Add export** — download progress as PDF
10. **Add API integration** — sync progress to backend

## 🏃 Quick Start

```bash
cd vibe-interview-app
npm install  # if needed
npm run dev  # start dev server on localhost:5173
npm run build  # production build
npm run typecheck  # TypeScript check
```

## 📝 File Structure Summary

```
vibe-interview-app/app/
├── root.tsx (modified)
├── app.css (modified)
├── routes.ts (modified)
├── routes/
│   ├── home.tsx (modified)
│   ├── topic-theory.tsx (NEW)
│   ├── topic-practice.tsx (NEW)
│   └── event-loop.tsx (NEW)
├── components/
│   ├── Layout.tsx (NEW)
│   ├── TopicCard.tsx (NEW)
│   ├── FlashCard.tsx (NEW)
│   ├── CodeBlock.tsx (NEW)
│   └── StepVisualizer.tsx (NEW)
└── data/
    ├── topics.ts (NEW)
    ├── event-loop.ts (NEW)
    ├── theory/ (NEW — 7 files)
    └── cards/ (NEW — 7 files)
```

**Total: ~60 new files + 6 modified files**

## Vercel Deployment Setup ✅
- [x] Switched `react-router.config.ts` from `ssr: true` to `ssr: false` (SPA mode)
- [x] Created `vibe-interview-app/vercel.json` — build command, output dir (`build/client`), SPA rewrites
- [x] Created `DEPLOY.md` at project root with full deployment instructions
- [x] Verified production build passes (`npm run build`)

**Why SPA mode**: all data is static TypeScript imports, no server-side loading needed.
**Next**: push to GitHub, import on vercel.com with Root Directory = `vibe-interview-app`.
