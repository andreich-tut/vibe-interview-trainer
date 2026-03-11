# Autotest Plan — vibe-interview-app

## Current Coverage

| Layer | Tool | Status |
|-------|------|--------|
| Unit tests | Vitest | ❌ Not set up |
| Component tests | React Testing Library | ❌ Not set up |
| E2E tests | Playwright | ✅ Partial (2 spec files) |

### Existing E2E Tests
- `e2e/home.spec.ts` — home page rendering, topic grid, navigation links
- `e2e/api-key.spec.ts` — API key enter/save/persist/remove, Groq link
- `e2e/helpers.ts` — shared utilities (mockGroqApi, setApiKey, setProgress, clearStorage)

---

## Setup: Add Vitest + React Testing Library

### Install

```bash
cd vibe-interview-app
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

### vitest.config.ts (project root)

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

### vitest.setup.ts

```ts
import '@testing-library/jest-dom';
```

### package.json scripts (add)

```json
"test": "vitest",
"test:ui": "vitest --ui",
"test:run": "vitest run",
"test:e2e": "playwright test"
```

---

## Unit Test Plan

### Priority 1 — Data Layer (`app/data/`)

**File:** `__tests__/data/topics.test.ts`
- 7 topics exist with correct IDs: `javascript`, `react`, `nextjs`, `nodejs`, `css`, `cicd`, `testing`
- Each topic has: `id`, `title`, `description`, `icon`, `color`
- All topic IDs are unique

**File:** `__tests__/data/cards.test.ts`
- Each topic file exports exactly 10 cards
- Each card has non-empty `question` and `answer` strings
- No duplicate questions within a topic

**File:** `__tests__/data/theory.test.ts`
- Each topic file exports at least 1 section
- Each section has non-empty `title` and `content`

**File:** `__tests__/data/event-loop.test.ts`
- Exports exactly 13 questions
- Each question has `id`, `title`, `difficulty` (easy/medium/hard), `steps[]`
- Each step has `description` and `queue` array

---

### Priority 2 — Hook (`app/hooks/`)

**File:** `__tests__/hooks/useProgress.test.ts`
- Returns initial state (empty progress) when localStorage is empty
- `markComplete(topicId, cardIndex)` persists to localStorage
- `getProgress(topicId)` returns correct count after marking complete
- `resetProgress(topicId)` clears topic progress from localStorage
- State updates trigger re-render (useSyncExternalStore)
- Handles corrupted localStorage JSON gracefully

---

### Priority 3 — Components (`app/components/`)

**File:** `__tests__/components/FlashCard.test.tsx`
- Renders question text, answer is hidden initially
- Clicking "Показать ответ" reveals the answer
- "Следующая" button calls onNext callback
- Score buttons (0–3) call onScore with correct value
- Renders CodeBlock when answer contains code
- Card counter shows correct "N из M" text

**File:** `__tests__/components/TopicCard.test.tsx`
- Renders topic title and description
- Renders theory and practice links with correct hrefs
- Shows progress bar when progress > 0
- Progress bar width matches percentage

**File:** `__tests__/components/CodeBlock.test.tsx`
- Renders code in `<pre><code>` block
- Applies syntax highlighting classes for keywords (`function`, `const`, `return`, etc.)
- Handles empty string input
- Does not crash on special characters

**File:** `__tests__/components/Layout.test.tsx`
- Renders header with app title
- Renders navigation links
- Renders children slot

---

### Priority 4 — LLM Client (`app/lib/`)

**File:** `__tests__/lib/llm.test.ts`
- `createGroqClient(apiKey)` creates client with correct base URL
- `checkAnswer(question, answer, userInput)` sends correct prompt format
- Returns parsed score (0–3) from LLM response
- Handles API error (non-200) by throwing or returning null
- Handles rate limit (429) gracefully

---

## E2E Test Plan (Playwright Extensions)

### New: `e2e/theory.spec.ts`

- Navigate to `/javascript/theory` → renders "Теория" heading
- All 7 topic theory pages load without error
- Theory sections expand/collapse (if applicable)
- "Практика" link in theory page navigates to practice route
- Back navigation returns to home
- Code blocks render within theory content

### New: `e2e/practice.spec.ts`

- Navigate to `/javascript/practice` with API key pre-set
- First flashcard question is visible
- Clicking "Показать ответ" reveals answer
- Score buttons (0–3) are shown after reveal
- Clicking a score button saves progress to localStorage
- Progress counter increments after each card
- After all 10 cards, summary/results screen shows
- "Заново" resets and shows first card again
- Progress bar on home page updates after session

### New: `e2e/event-loop.spec.ts`

- Navigate to `/event-loop` → renders "Event Loop Тренажёр"
- Difficulty filter (easy/medium/hard) shows correct subset
- Clicking a question expands step-by-step visualization
- Steps render in correct order with queue contents
- "Следующий вопрос" button loads next question
- All 13 questions can be navigated through

### Extend: `e2e/home.spec.ts`

- Progress bars update after localStorage is pre-seeded via `setProgress()`
- Topic links are keyboard-navigable (Tab order)
- Event Loop card has correct link to `/event-loop`

---

## File Structure After Setup

```
vibe-interview-app/
├── vitest.config.ts                 # NEW
├── vitest.setup.ts                  # NEW
├── __tests__/
│   ├── data/
│   │   ├── topics.test.ts           # NEW
│   │   ├── cards.test.ts            # NEW
│   │   ├── theory.test.ts           # NEW
│   │   └── event-loop.test.ts       # NEW
│   ├── hooks/
│   │   └── useProgress.test.ts      # NEW
│   ├── components/
│   │   ├── FlashCard.test.tsx       # NEW
│   │   ├── TopicCard.test.tsx       # NEW
│   │   ├── CodeBlock.test.tsx       # NEW
│   │   └── Layout.test.tsx          # NEW
│   └── lib/
│       └── llm.test.ts              # NEW
└── e2e/
    ├── home.spec.ts                 # EXTEND
    ├── api-key.spec.ts              # EXISTS
    ├── theory.spec.ts               # NEW
    ├── practice.spec.ts             # NEW
    ├── event-loop.spec.ts           # NEW
    └── helpers.ts                   # EXISTS
```

---

## Implementation Priority

| # | File | Type | Effort | Value |
|---|------|------|--------|-------|
| 1 | vitest config + setup | Setup | Low | High |
| 2 | `data/*.test.ts` (4 files) | Unit | Low | High |
| 3 | `useProgress.test.ts` | Unit | Medium | High |
| 4 | `FlashCard.test.tsx` | Component | Medium | High |
| 5 | `CodeBlock.test.tsx` | Component | Low | Medium |
| 6 | `TopicCard.test.tsx` | Component | Low | Medium |
| 7 | `e2e/practice.spec.ts` | E2E | Medium | High |
| 8 | `e2e/theory.spec.ts` | E2E | Low | Medium |
| 9 | `e2e/event-loop.spec.ts` | E2E | Medium | Medium |
| 10 | `llm.test.ts` | Unit | Medium | Medium |
| 11 | `Layout.test.tsx` | Component | Low | Low |

---

## Commands Reference

```bash
# Unit tests
npm run test          # watch mode
npm run test:run      # single run (CI)

# E2E tests (requires dev server running)
npm run test:e2e      # all e2e specs
npx playwright test e2e/practice.spec.ts  # single spec

# Type check
npm run typecheck
```
