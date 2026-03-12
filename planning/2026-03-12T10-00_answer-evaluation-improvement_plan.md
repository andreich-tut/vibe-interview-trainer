# Plan: Improve Answer Evaluation Quality

## Goal
Improve LLM-based answer scoring by adding structured key points to each card and rewriting the evaluation prompt.

## Steps

### Step 1. Fix factual errors in existing cards
| File | Card | Fix |
|------|------|-----|
| `nextjs.ts` | ALL 10 cards | Rewrite for App Router (Next.js 13+): `app/` dir, Server Components, `generateStaticParams`, `loading.tsx`, `error.tsx`, Server Actions, Middleware |
| `css.ts` | #2 (specificity) | Fix misconception: specificity is a tuple `(inline, id, class, element)`, not a point system |
| `css.ts` | #6 (media queries) | Fix `prefers-dark-scheme` → `prefers-color-scheme: dark` |
| `javascript.ts` | #10 (modules) | Fix "import is asynchronous" → "import is statically analyzed at parse time" |

### Step 2. Replace irrelevant Node.js questions
| Card | Current | Replacement |
|------|---------|-------------|
| #8 | Telegram bot | Streams in Node.js |
| #9 | Discord bot | Error handling patterns (process.on, try/catch, domains) |
| #10 | node-cron | Worker threads vs child_process |

### Step 3. Add `keyPoints: string[]` to Card interface
Each card gets 3-5 key points — atomic concepts the user must mention. Example:
```ts
{
  question: "Что такое замыкание?",
  answer: "...",
  keyPoints: [
    "Функция запоминает переменные из внешней области видимости",
    "Доступ сохраняется после завершения внешней функции",
    "Используется для инкапсуляции и приватных переменных",
  ],
}
```

### Step 4. Rewrite LLM prompt in `llm.ts`
New system prompt:
- Receives question + reference answer + key points checklist + user answer
- Scores based on key points coverage: 3=all, 2=most, 1=some, 0=none/wrong
- Feedback must list which key points were missed
- Temperature stays at 0.1

### Step 5. Update `checkAnswer()` signature
- Add `keyPoints: string[]` parameter
- Include key points in user message to LLM

### Step 6. Update `FlashCard.tsx`
- Pass `keyPoints` from card data to `checkAnswer()`

## Files Modified
- `app/data/cards/*.ts` (7 files) — fix errors + add keyPoints
- `app/lib/llm.ts` — new prompt + keyPoints parameter
- `app/components/FlashCard.tsx` — pass keyPoints

## Not in scope
- Adding new topics (TypeScript) — separate task
- Expanding card count beyond 10 per topic — separate task
- Vector DB / embeddings — not needed for 70 curated cards
