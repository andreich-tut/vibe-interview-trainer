# PLAN.md — Interview Training React App

## Context

The project has interview question banks (7 topics, in Russian) and a standalone Event Loop trainer HTML file. The goal is to build a unified React app where each topic has a **theory page** and a **flashcard practice page**, plus the Event Loop trainer ported to React. Built on the existing `vibe-interview-app` (React Router v7 + Vite + Tailwind v4 + TS). All UI in Russian, dark theme matching event-loop-trainer.

---

## Route Structure

| Path | Description |
|------|-------------|
| `/` | Landing — topic card grid + Event Loop link |
| `/:topicId/theory` | Theory page for a topic |
| `/:topicId/practice` | Flashcard Q&A practice |
| `/event-loop` | Event Loop trainer (ported from HTML) |

Topic IDs: `javascript`, `react`, `nextjs`, `nodejs`, `css`, `cicd`, `testing`

---

## Data Model

```typescript
// Flashcard for Q&A practice
interface FlashCard {
  id: string;
  question: string;
  answer: string;        // AI-generated concise answer (Russian)
  category: string;      // sub-topic, e.g. "Область видимости"
}

// Theory content per topic
interface TheorySection {
  title: string;
  content: string;       // HTML or markdown
}

// Topic config
interface TopicConfig {
  id: string;
  title: string;
  icon: string;
  description: string;
  cards: FlashCard[];
  theory: TheorySection[];
}

// Event Loop (reuse structure from HTML file, but plain text code)
interface EventLoopQuestion {
  code: string;          // plain text, highlighted at render time
  answer: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: { tag: 'sync' | 'micro' | 'macro'; label: string; desc: string }[];
  explanation: string;
}
```

---

## File Structure (new/modified)

```
app/
  root.tsx                     # MODIFY: lang="ru", swap fonts to JetBrains Mono + Unbounded
  app.css                      # MODIFY: dark theme CSS vars + Tailwind theme
  routes.ts                    # MODIFY: add 3 new routes
  routes/
    home.tsx                   # MODIFY: landing page with topic grid
    topic-theory.tsx           # CREATE: parameterized theory page
    topic-practice.tsx         # CREATE: flashcard practice page
    event-loop.tsx             # CREATE: ported Event Loop trainer
  components/
    Layout.tsx                 # CREATE: shared shell (header + nav)
    TopicCard.tsx              # CREATE: card for home grid
    FlashCard.tsx              # CREATE: question → reveal answer
    CodeBlock.tsx              # CREATE: syntax-highlighted code (simple regex)
    StepVisualizer.tsx         # CREATE: sync/micro/macro step list
    ProgressBar.tsx            # CREATE: thin gradient progress bar
    LevelSelector.tsx          # CREATE: easy/medium/hard card grid
  data/
    topics.ts                  # CREATE: master topic list config
    event-loop.ts              # CREATE: ported questions (plain text code)
    theory/
      javascript.ts            # CREATE: 7 files, AI-written theory
      react.ts
      nextjs.ts
      nodejs.ts
      css.ts
      cicd.ts
      testing.ts
    cards/
      javascript.ts            # CREATE: 7 files, Q&A from questions/*.txt + AI answers
      react.ts
      nextjs.ts
      nodejs.ts
      css.ts
      cicd.ts
      testing.ts
```

**Delete:** `app/welcome/` (welcome.tsx, logo SVGs) — no longer used.

---

## Styling

Reuse event-loop-trainer's dark palette via Tailwind v4 `@theme`:

```css
@import "tailwindcss";
@theme {
  --font-mono: "JetBrains Mono", monospace;
  --font-display: "Unbounded", sans-serif;
  --color-bg: #080810;
  --color-surface: #0d0d1a;
  --color-surface2: #121220;
  --color-border: #1a1a2e;
  --color-accent: #7c6aff;
  --color-accent2: #4fc3f7;
  --color-green: #34d399;
  --color-red: #f87171;
  --color-text: #e0e0f0;
  --color-muted: #4a4a6a;
}
```

Fonts: JetBrains Mono (body) + Unbounded (headings). Loaded via Google Fonts in `root.tsx`.

---

## Implementation Phases

### Phase 1: Foundation
1. `root.tsx` — lang="ru", swap fonts
2. `app.css` — dark theme vars
3. `components/Layout.tsx` — header + dark shell
4. `data/topics.ts` — topic config array
5. `routes.ts` — add routes
6. `routes/home.tsx` — landing page with topic grid

### Phase 2: Data (7 topics)
7. `data/theory/*.ts` — AI-written theory for each topic
8. `data/cards/*.ts` — questions parsed from .txt + AI answers
9. `data/event-loop.ts` — port from HTML (plain text code)

### Phase 3: Topic Pages
10. `components/FlashCard.tsx`
11. `routes/topic-theory.tsx`
12. `routes/topic-practice.tsx`

### Phase 4: Event Loop Trainer
13. `components/CodeBlock.tsx` — regex syntax highlighting
14. `components/StepVisualizer.tsx`, `ProgressBar.tsx`, `LevelSelector.tsx`
15. `routes/event-loop.tsx` — full port (splash → quiz → results)

### Phase 5: Cleanup
16. Delete `app/welcome/`
17. Test all routes, fix responsive issues

---

## Key Decisions

- **No syntax highlighting library** — simple regex for ~6 token types (keyword, function, number, string, comment) in CodeBlock.tsx
- **Static data, no API** — all content lives in TS files, imported directly
- **Plain text code in event-loop data** — highlighting applied at render time, not stored as HTML spans
- **Client-only flashcard state** — useState for card index, reveal toggle. No global state needed

---

## Verification

1. `npm run dev` from `vibe-interview-app/` — app starts on localhost:5173
2. `/` — shows 7 topic cards + Event Loop card
3. Click any topic → `/javascript/theory` etc. shows theory content
4. `/javascript/practice` — flashcard works (show question → reveal answer → next)
5. `/event-loop` — level select → quiz → check answers → results screen
6. `npm run typecheck` — no TS errors
