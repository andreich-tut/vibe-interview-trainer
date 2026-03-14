# Decompose Route Components

## Task
Split large route files into focused sub-components.

## topic-practice.tsx (376 lines)

Extract phase-based components (all need `topic`, `t`, callbacks):

- `app/components/practice/PracticeSetup.tsx` — setup phase UI (API key + start button)
- `app/components/practice/PracticePlaying.tsx` — playing phase UI (FlashCard + progress)
- `app/components/practice/PracticeFinished.tsx` — results phase UI (stats grid + action buttons)

Route keeps: state, handlers (`handleStart`, `handleScore`, `handleRestart`, `handleRetryWrong`), data loading, phase switch.

## topic-theory.tsx (295 lines)

- `app/lib/codeHighlight.ts` — extract `highlightCode` + `processContent` functions (pure, no React)
- `app/components/theory/TheoryToc.tsx` — TOC link list + mobile dropdown logic

Route keeps: data loading, IntersectionObserver, `processedSections` memo, layout assembly.

## Files to create
1. `app/components/practice/PracticeSetup.tsx`
2. `app/components/practice/PracticePlaying.tsx`
3. `app/components/practice/PracticeFinished.tsx`
4. `app/lib/codeHighlight.ts`
5. `app/components/theory/TheoryToc.tsx`

## Files to modify
- `app/routes/topic-practice.tsx`
- `app/routes/topic-theory.tsx`
