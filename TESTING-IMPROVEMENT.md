# Testing Improvement — Conversation & Design Notes

## Problem Statement

The current "Знал ✓ / Не знал ✗" binary self-assessment on flashcards is not effective:
1. **Self-deception** — users overrate themselves ("I kinda knew that")
2. **Passive recognition** — reading answer and judging is not active recall
3. **Single pass** — wrong cards are never revisited in-session
4. **Binary scoring** — no nuance between "completely blank" and "almost had it"
5. **No retention** — no spaced repetition or session-to-session tracking

---

## Approaches Considered

### Approach A: Confidence-Calibrated Assessment (Quick Win, Small effort)

User rates **confidence before** reveal ("Точно знаю" / "Примерно знаю" / "Не знаю"), then rates **accuracy after** reveal ("Совпало" / "Частично" / "Не совпало"). The combination produces a calibration score — being confidently wrong is penalized most. Cards scored 0-1 go into a replay round.

**Pros:** Small code delta, targets self-deception with pre-commitment, no data changes.
**Cons:** Still subjective, no cross-session memory.

### Approach B: Active Recall with Keyword Matching + Spaced Repetition (Ambitious, Large effort)

User types answer in textarea. System auto-scores via keyword matching (3-6 keywords per card). Grade feeds into Leitner box spaced repetition system stored in localStorage. Home page shows topic mastery indicators.

**Pros:** Most effective learning (active recall + spaced repetition), objective-ish scoring.
**Cons:** Requires adding keywords to all 70 cards, Russian morphology makes matching fragile, complex state management.

### Approach C: Hybrid Mode — Typed Recall + Wrong-Card Replay (Recommended, Medium effort)

Two toggleable modes + wrong-card queue + localStorage persistence. This is the recommended approach.

---

## Recommended Approach: Hybrid Mode (Approach C)

### User Flow

**Mode selection** (toggle at session start):
- **Quick Review** (default) — see question → mentally recall → reveal → rate
- **Typed Recall** — see question → type answer in textarea → reveal → compare → rate

**During session:**
1. Show question (+ textarea in typed mode)
2. User types their answer (typed mode) or thinks about it (quick mode)
3. Click "Проверить" / "Показать ответ" to reveal
4. In typed mode: side-by-side comparison (user's answer vs reference)
5. Rate on 4-point scale:
   - `3` — **Знал точно** (knew exactly)
   - `2` — **Знал примерно** (knew roughly)
   - `1` — **С трудом** (barely / with hints)
   - `0` — **Не знал** (didn't know)
6. Cards rated 0–1 enter a **wrong-card queue**
7. After main deck: replay wrong cards (max 2 replay rounds)
8. Results screen: score breakdown by grade, cards that needed replays

**Cross-session persistence (localStorage):**
- Save per-card best score and review count
- Home page TopicCards show mini progress bar (% cards scored 2+)
- "Повторить ошибки" option: start session with only previously-failed cards

---

## Key Design Decision: How to Validate Typed Answers?

### Option 1: Keyword matching (automated, imperfect)
Add a `keywords` array to each card (3-6 key terms). After the user types, check which keywords appear in their text.

**Example:**
- Question: "Что такое замыкание?"
- Keywords: `["функция", "внешний scope", "переменные", "инкапсуляция"]`
- User typed: "функция которая запоминает переменные из внешнего скоупа"
- Result: 3/4 matched → auto-score "good"

**Problem:** Russian morphology ("замыкание"/"замыканий"/"замыкания") makes exact matching fragile. Requires adding keywords to all 70 cards manually.

### Option 2: No auto-check — typing is the point (recommended)
User types their answer, then the reference answer reveals below in side-by-side comparison. The system doesn't score automatically — the user rates themselves on the 4-point scale, but now informed by hard evidence.

**Key insight:** Having your own written attempt visible next to the correct answer makes self-deception nearly impossible. You can clearly see what you missed. This is how Anki works for free-text cards.

### Option 3: LLM-based checking
Send user's answer + reference to Claude API for semantic comparison. Most accurate but adds API dependency, latency, and cost. Overkill for a static study app.

---

## Side-by-Side Comparison Mockup (Option 2)

### Step 1: User types answer

```
┌─────────────────────────────────────────────────┐
│  Карточка 3 из 10              Область видимости │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                  │
│  Что такое замыкание (closure)?                  │
│  Когда оно полезно?                              │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ Твой ответ:                                 │ │
│  │                                             │ │
│  │ это функция которая запоминает переменные   │ │
│  │ из внешнего скоупа. можно использовать для  │ │
│  │ приватных переменных                        │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│         [ Проверить → ]                          │
└──────────────────────────────────────────────────┘
```

### Step 2: Comparison + self-assessment

```
┌─────────────────────────────────────────────────┐
│  Карточка 3 из 10              Область видимости │
│                                                  │
│  ┌──── Твой ответ ────────────────────────────┐ │
│  │ это функция которая запоминает переменные  │ │
│  │ из внешнего скоупа. можно использовать для │ │
│  │ приватных переменных                       │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌──── Правильный ответ ──────────────────────┐ │
│  │ Замыкание — функция, которая помнит        │ │
│  │ переменные из своего внешнего scope.        │ │
│  │ Полезно для инкапсуляции (приватные         │ │
│  │ переменные), фабричных функций, каррирова- │ │
│  │ ния. Часто используется в коллбэках и      │ │
│  │ обработчиках событий.                      │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  Сравни свой ответ и оцени:                      │
│                                                  │
│  [Точно ✓] [Примерно] [С трудом] [Не знал ✗]   │
│     3          2          1           0          │
│                                                  │
│  3 — точно · 2 — примерно · 1 — с трудом · 0    │
└──────────────────────────────────────────────────┘
```

**Why this works:** The user typed "функция, переменные, внешний скоуп, приватные переменные" — they can clearly see they got the core right but missed "фабричные функции, каррирование, коллбэки". That's obviously a "2 — Примерно". No way to pretend it was a "3" when the gap is visible.

---

## Data Model Changes

```typescript
// Card — add optional highlights (backward compatible)
export interface Card {
  id: string;
  question: string;
  answer: string;
  category: string;
  highlights?: string[];  // key phrases to bold in answer display (optional)
}

// localStorage schema
interface CardHistory {
  lastScore: 0 | 1 | 2 | 3;
  reviewCount: number;
  lastReviewed: string;  // ISO date
}

interface StoredProgress {
  topics: Record<string, Record<string, CardHistory>>;
  totalSessions: number;
}
```

## Files to Modify

| File | Change | Effort |
|------|--------|--------|
| `app/components/FlashCard.tsx` | 4-point scale, optional textarea, side-by-side comparison, mode prop | Major rewrite |
| `app/routes/topic-practice.tsx` | Mode toggle, wrong-card queue, replay rounds, localStorage | Significant |
| New: `app/hooks/useProgress.ts` | localStorage read/write hook | New file (small) |
| `app/components/TopicCard.tsx` | Mini progress bar from stored progress | Small |
| `app/routes/home.tsx` | Pass progress data to TopicCards | Small |

## Future Evolution (not in first phase)

1. Add `keywords` to cards → auto-scoring in typed mode
2. Upgrade to Leitner box spaced repetition
3. Cross-topic "weak cards" mixed review mode (interleaving)

---

## Status

**IMPLEMENTED** — Hybrid Mode (Approach C) with Gemini Flash AI validation.

### Validation Approach: Gemini 2.0 Flash (Option 3 — LLM-based)

**Decision:** Use Gemini 2.0 Flash (free tier) for semantic answer validation instead of keyword matching.

- **API**: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}`
- **Free tier**: 15 RPM, 1500 RPD, 1M tokens/day (no credit card needed)
- **Get API key**: https://aistudio.google.com/apikey
- **Prompt**: System instruction with 0-3 scoring rubric + JSON output format. Temperature 0.1 for deterministic scoring.
- **Graceful degradation**: If no API key, errors, or rate-limited — falls back to manual 4-point self-assessment. App works 100% without Gemini.

### Implementation Summary

| File | Change |
|------|--------|
| `app/lib/gemini.ts` | New — Gemini Flash API client |
| `app/hooks/useProgress.ts` | New — localStorage persistence hook |
| `app/components/ApiKeyInput.tsx` | New — API key input/manage UI |
| `app/components/FlashCard.tsx` | Rewritten — typed mode, 4-point scale, Gemini integration |
| `app/routes/topic-practice.tsx` | Rewritten — mode toggle, wrong-card queue, replay rounds |
| `app/components/TopicCard.tsx` | Updated — progress bar |
| `app/routes/home.tsx` | Updated — passes progress to TopicCards |
