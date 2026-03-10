# BUGS.md — Known Issues & Remaining Improvements

## Bugs

### B1. Emoji rendering as empty boxes on some systems
- **Where:** Home page topic cards, Event Loop splash
- **Emojis affected:** 🟢 (Node.js), 🎨 (CSS), 🔄 (CI/CD, Event Loop), ✅ (Testing)
- **Cause:** System/browser missing color emoji font; JetBrains Mono doesn't include emoji glyphs
- **Fix:** Add emoji font fallback in CSS (`font-family` stack), or replace emojis with SVG icons

### B2. StepVisualizer uses `<div>` instead of semantic `<ol>`
- **Where:** `app/components/StepVisualizer.tsx`
- **Impact:** Screen readers don't announce it as a numbered list
- **Fix:** Replace wrapper/items with `<ol>`/`<li>`

### B3. Event Loop feedback lacks `role="alert"`
- **Where:** `app/routes/event-loop.tsx` — correct/wrong feedback div
- **Impact:** Screen readers don't announce feedback on answer check
- **Fix:** Add `role="alert"` to the feedback container

### B4. No scroll-to-top on route navigation
- **Where:** All route transitions
- **Impact:** Navigating between topics can leave scroll position mid-page
- **Fix:** Verify `ScrollRestoration` works in SPA mode, or add `window.scrollTo(0,0)` on route entry

### B5. Event Loop quiz has no visual progress bar
- **Where:** `app/routes/event-loop.tsx` — quiz screen
- **Impact:** Only "ЗАДАЧА 1 / 5" text, no gradient bar like flashcards have
- **Fix:** Add the same progress bar component used in FlashCard

## UX Improvements (Not Yet Implemented)

### U1. Progress persistence with localStorage
- **Priority:** High
- **Where:** `topic-practice.tsx`, `event-loop.tsx`
- **What:** Save completion status and scores per topic. Refreshing loses all progress.
- **Approach:** Store `{ completed: boolean, knewCount, total }` keyed by topicId

### U2. Completion tracking on home page
- **Priority:** Medium
- **Where:** `home.tsx`, `TopicCard.tsx`
- **What:** Show progress indicators on topic cards (e.g. "7/10 cards", checkmark)
- **Depends on:** U1 (localStorage persistence)

### U3. Topic-to-topic navigation
- **Priority:** Low
- **Where:** `topic-theory.tsx`, `topic-practice.tsx`
- **What:** Prev/next topic arrows at bottom of pages. Currently must return home between topics.

### U4. Event Loop "All levels" mode
- **Priority:** Low
- **Where:** `app/routes/event-loop.tsx`
- **What:** 4th difficulty option that shuffles questions from all levels

### U5. Format code snippets in flashcard answers
- **Priority:** Medium
- **Where:** `FlashCard.tsx`, card data files
- **What:** Answers contain inline code like `React.memo(...)` as plain text. Detect and style with `<code>` elements.

### U6. Page transition animations
- **Priority:** Low
- **Where:** `root.tsx` or `Layout.tsx`, `app.css`
- **What:** Route changes are instant with no visual transition. Add fade-in animation.
