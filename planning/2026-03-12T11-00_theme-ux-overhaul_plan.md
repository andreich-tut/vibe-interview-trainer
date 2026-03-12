# Plan: Theme Overhaul & UX Improvements

## Overview

4 changes requested:
1. **Theme** — Switch to JetBrains "Islands Dark" color palette
2. **Theme switcher** — Dark/Light mode toggle
3. **Stars** — Replace numeric progress with star ratings
4. **Answer checking** — Separate correct answer from mistake feedback

---

## 1. Theme: Islands Dark Color Palette

### Reference Colors (from JetBrains Islands Dark)

| Token | Current | Islands Dark | Purpose |
|-------|---------|-------------|---------|
| bg | `#080810` | `#181a1d` | Editor/main background |
| surface | `#0d0d1a` | `#2b2d30` | Cards, widgets, menus |
| surface2 | `#121220` | `#25262a` | Secondary surfaces |
| border | `#1a1a2e` | `#3c3f41` | Borders, dividers |
| accent | `#7c6aff` | `#548af7` | Primary accent (blue) |
| accent2 | `#4fc3f7` | `#2aacb8` | Secondary accent (teal) |
| green | `#34d399` | `#73b00a` | Success |
| red | `#f87171` | `#f75464` | Error |
| text | `#e0e0f0` | `#bcbec4` | Primary text |
| muted | `#4a4a6a` | `#7a7e85` | Secondary text |

### Syntax Highlighting (code blocks)

| Token | Current | Islands Dark |
|-------|---------|-------------|
| keyword | `#7c6aff` (purple) | `#cf8e6d` (warm orange) |
| string | `#34d399` (green) | `#6aab73` (muted green) |
| number | `#fb923c` (orange) | `#2aacb8` (teal) |
| comment | `#444466` (dark gray) | `#7a7e85` (gray) |
| builtin/fn | `#4fc3f7` (cyan) | `#56a8f5` (blue) |

### Variants

**A) Pure Islands Dark** — Exact JetBrains colors as listed above. Charcoal-gray tone instead of deep blue-black. Warmer feel.

**B) Islands Dark Adapted** (recommended) — Islands Dark base colors but with slightly more contrast for web (web screens differ from IDE). Minor tweaks:
- Background `#16171b` (slightly darker than IDE for immersion)
- Keep `#548af7` blue accent but add `#c77dbb` purple as secondary flair
- Text `#c0c2c9` (slightly brighter for readability on large text blocks)

**C) Islands Dark + Brand Colors** — Use Islands Dark neutrals (bg, surface, border, text) but keep current app accents (`#7c6aff` purple, `#4fc3f7` cyan). Minimal disruption, hybrid look.

---

## 2. Dark/Light Theme Switcher

### Light Theme Palette (Islands Light inspired)

| Token | Dark value | Light value |
|-------|-----------|-------------|
| bg | `#181a1d` | `#f5f5f5` |
| surface | `#2b2d30` | `#ffffff` |
| surface2 | `#25262a` | `#f0f0f3` |
| border | `#3c3f41` | `#d1d1d6` |
| accent | `#548af7` | `#3574f0` |
| accent2 | `#2aacb8` | `#1a8a96` |
| green | `#73b00a` | `#59a045` |
| red | `#f75464` | `#db5860` |
| text | `#bcbec4` | `#1e1f22` |
| muted | `#7a7e85` | `#6f737a` |

### Implementation Variants

**A) CSS variables + class toggle** (recommended)
- Add `data-theme="dark"` / `data-theme="light"` on `<html>`
- Two sets of CSS variables in `@theme` block, selected by `[data-theme]`
- Toggle button in header (sun/moon icon)
- Persist choice in `localStorage`, default to system preference via `prefers-color-scheme`
- Minimal refactor — all components already use `var(--color-*)` tokens

**B) Tailwind `dark:` prefix**
- Use Tailwind's built-in `dark:` class variant
- Requires rewriting EVERY component's className (hundreds of places use `var(--color-*)`)
- Much larger refactor. Not recommended for this project.

**C) Separate CSS files**
- Two full CSS files: `dark.css` and `light.css`
- Swap via `<link>` tag. Causes flash of unstyled content (FOUC)
- Not recommended.

### Switcher UI Variants

**A) Icon toggle in header** (recommended) — Sun/Moon icon button next to logo. Simple, standard.

**B) Dropdown selector** — "Dark / Light / System" three-way dropdown. More options but more UI space.

**C) Floating toggle** — Fixed position button in corner. Distracting.

---

## 3. Progress: Stars Instead of Numbers

### Current State
- Score: `0 | 1 | 2 | 3` (4 levels)
- Displayed as: `2/3 — Примерно` with colored badge
- Results grid: 5 columns showing count per score level + percentage
- TopicCard: progress bar with `mastered/total` text

### Variants

**A) 3-star system** (recommended)
- Direct mapping: Score 0 = 0 stars, 1 = 1 star, 2 = 2 stars, 3 = 3 stars
- Display: `★★☆` (filled/empty stars, colored by score level)
- Results grid: replace number counts with star indicators per category
- TopicCard: show average stars instead of `mastered/total`
- Simple, maps cleanly to existing 0-3 scoring

**B) 5-star system**
- Mapping: 0→1★, 1→2★, 2→3.5★, 3→5★
- More granular but doesn't map naturally to 4 levels
- Confusing for users who know the 0-3 rubric

**C) Star + half-star (3-star with halves)**
- 0→0★, 1→1★, 2→2★, 3→3★ (same as A)
- But allow AI to give half-star scores (1.5, 2.5)
- Requires changing Score type from integer to float — bigger refactor

### Where Stars Appear

1. **FlashCard result badge** — `★★☆` instead of `2/3`
2. **Results grid** — Each card's result shown as stars
3. **TopicCard on home** — Average stars for topic
4. **Category columns in results** — Star icons instead of count numbers

---

## 4. Answer Checking: Separate Correct Answer from Mistakes

### Current State
After AI check, a single block shows:
- Score badge: `2/3 — Примерно`
- Inline feedback text (what was wrong)
- Correct answer shown above in a separate "Правильный ответ" section

The correct answer is ALREADY shown separately. The issue is that **AI feedback mixes praise and criticism in one line**, making it hard to see what specifically was wrong.

### Variants

**A) Three distinct blocks** (recommended)
```
┌─────────────────────────────┐
│ 📝 Твой ответ               │  (gray border)
│ [user's text]               │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ✅ Правильный ответ          │  (green border)
│ [reference answer]           │
│                              │
│ Ключевые пункты:            │
│  ✓ Замыкание — это функция…  │  (green checks for matched)
│  ✗ Лексическое окружение     │  (red crosses for missed)
└─────────────────────────────┘

┌─────────────────────────────┐
│ ★★☆  Оценка                 │  (score-colored border)
│ [AI feedback about mistakes] │
└─────────────────────────────┘
```
- Key points checklist shows exactly what was matched/missed
- AI feedback block focuses only on what to improve
- Clear visual separation

**B) Two blocks: Answer + Diff-style feedback**
```
┌─────────────────────────────┐
│ Правильный ответ             │
│ [reference answer]           │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ★★☆  Анализ                  │
│ ✅ Упомянул: замыкания        │
│ ❌ Пропустил: лексическое…   │
│ 💡 Совет: обрати внимание…   │
└─────────────────────────────┘
```
- Simpler, two blocks
- Requires LLM prompt change to output structured matched/missed points

**C) Expandable sections**
- Correct answer always visible
- "Показать анализ ошибок" expandable section
- Keeps card compact, user clicks to see details

### LLM Prompt Changes (for A or B)

Update `checkAnswer()` to request structured JSON:
```json
{
  "score": 2,
  "matchedPoints": ["Замыкание — это функция с доступом к внешним переменным"],
  "missedPoints": ["Лексическое окружение сохраняется при создании"],
  "feedback": "Хорошо описал основную идею, но не упомянул лексическое окружение"
}
```

Update `LLMResult` type to include `matchedPoints: string[]` and `missedPoints: string[]`.

---

## Implementation Order

| Step | Task | Effort | Depends on |
|------|------|--------|-----------|
| 1 | Islands Dark color palette swap | Small | — |
| 2 | Light theme palette + switcher | Medium | Step 1 |
| 3 | Star rating component + integration | Small | — |
| 4 | Answer checking restructure + LLM prompt | Medium | Step 3 (for stars in feedback) |
| 5 | Playwright verification | Small | All above |

**Total estimated files to modify:** ~8-10
- `app.css` — color variables, light/dark themes
- `root.tsx` — theme script (prevent FOUC)
- `Layout.tsx` — theme toggle button
- `FlashCard.tsx` — stars display, answer checking UI restructure
- `topic-practice.tsx` — stars in results grid
- `TopicCard.tsx` — stars in progress display
- `lib/llm.ts` — structured feedback prompt
- New: `components/StarRating.tsx` — reusable star component
- New: `hooks/useTheme.ts` — theme state management

---

## My Recommendation

| Feature | Recommended Variant |
|---------|-------------------|
| Theme colors | **B — Islands Dark Adapted** (web-optimized contrast) |
| Theme switcher | **A — CSS variables + class toggle** (minimal refactor) |
| Switcher UI | **A — Icon toggle in header** (sun/moon) |
| Stars | **A — 3-star system** (clean 0-3 mapping) |
| Answer checking | **A — Three distinct blocks** with key points checklist |
