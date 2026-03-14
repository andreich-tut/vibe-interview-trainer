# FlashCard Hook Decomposition

**Date:** 2026-03-14
**Task:** Decompose `useFlashCard` into focused hooks, eliminate `t` prop drilling

---

## Goal

Split the monolithic `useFlashCard` into three focused hooks, and have `CardAnswerInput` / `CardResult` call `useLanguage()` directly instead of receiving `t` as a prop.

---

## New Hook Structure

```
useFlashCard (thin orchestrator)
  ├── useSpeechAnswer(speech, cardId) → { userAnswer, setUserAnswer, toggleMic }
  ├── useAnswerCheck(card, userAnswer) → { aiResult, aiLoading, aiError, handleCheck, handleSkip, handleNext, style }
  └── useFlashCardKeyboard(aiResult, handleCheck, handleNext)
```

---

## Affected Files

### New files
- `app/components/FlashCard/useSpeechAnswer.ts` — speech + typed prefix composition
- `app/components/FlashCard/useAnswerCheck.ts` — AI check state machine
- `app/components/FlashCard/useFlashCardKeyboard.ts` — keyboard shortcut listener

### Modified files
- `app/components/FlashCard/useFlashCard.ts` — becomes thin orchestrator, delegates to 3 hooks above
- `app/components/FlashCard/CardAnswerInput.tsx` — remove `t` prop, call `useLanguage()` internally
- `app/components/FlashCard/CardResult.tsx` — remove `t` prop, call `useLanguage()` internally
- `app/components/FlashCard.tsx` — remove `t` from `CardAnswerInput` / `CardResult` JSX

---

## Steps

1. Create `useSpeechAnswer.ts`
2. Create `useAnswerCheck.ts`
3. Create `useFlashCardKeyboard.ts`
4. Rewrite `useFlashCard.ts` as orchestrator
5. Update `CardAnswerInput.tsx` — drop `t` prop, use `useLanguage()` directly
6. Update `CardResult.tsx` — drop `t` prop, use `useLanguage()` directly
7. Update `FlashCard.tsx` — remove `t` from JSX props
8. Typecheck

---

## Style Rules
- No single-letter prop names (e.g. `t`) — leaf components call `useLanguage()` directly
- `SCORE_STYLES` moves to `useAnswerCheck.ts` (score-related)
