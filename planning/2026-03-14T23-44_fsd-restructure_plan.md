# FSD-lite Restructure Plan

**Date:** 2026-03-14
**Goal:** Introduce `pages/` and `shared/` as top-level domain folders. Eliminate `hooks/` and `components/`. Co-locate hooks with their owning component via `model/`. Apply consistent folder pattern everywhere.

---

## Principles

- Routes stay thin — only `loader`, `action`, `meta`, and a single import of the page component
- Every route gets a corresponding `pages/RouteName/` folder that owns layout + logic
- The pattern applies recursively to any component complex enough to warrant it:
  ```
  ComponentName/
  ├── index.tsx       # public API, the component itself
  ├── types.ts        # (if needed)
  ├── ui/             # sub-components, only imported by this index.tsx
  │   └── SubName.tsx # or SubName/index.tsx if it grows complex
  └── model/          # hooks owned by this component
      └── useHook.ts
  ```
- A hook lives in `model/` of the component that **calls** it first
- `components/` is deleted — replaced by `shared/` at root level
- `shared/` contains only truly cross-route components: primitives (`ui/`) and layout
- `hooks/` directory is deleted entirely
- `lib/` contains only pure functions — zero hooks

---

## File Migration Map

### New: `pages/` layer

| From | To |
|---|---|
| `routes/home.tsx` (layout part) | `pages/Home/index.tsx` |
| `components/home/TopicCard.tsx` | `pages/Home/ui/TopicCard.tsx` |
| `hooks/shared/useProgress.ts` | `pages/Home/model/useProgress.ts` |
| `routes/topic-theory.tsx` (layout part) | `pages/Theory/index.tsx` |
| `components/theory/TheoryCard.tsx` | `pages/Theory/ui/TheoryCard.tsx` |
| `components/theory/TheoryPageHeader.tsx` | `pages/Theory/ui/TheoryPageHeader.tsx` |
| `components/theory/TheoryPracticeCta.tsx` | `pages/Theory/ui/TheoryPracticeCta.tsx` |
| `components/theory/TheoryToc.tsx` | `pages/Theory/ui/TheoryToc.tsx` |
| `hooks/theory/useActiveSection.ts` | `pages/Theory/model/useActiveSection.ts` |
| `hooks/theory/useTheoryContent.ts` | `pages/Theory/model/useTheoryContent.ts` |
| `hooks/theory/useTocOutsideClick.ts` | `pages/Theory/model/useTocOutsideClick.ts` |
| `routes/topic-practice.tsx` (layout part) | `pages/Practice/index.tsx` |
| `components/practice/PracticePlaying.tsx` | `pages/Practice/ui/PracticePlaying.tsx` |
| `components/practice/PracticeSetup.tsx` | `pages/Practice/ui/PracticeSetup.tsx` |
| `components/practice/PracticeFinished.tsx` | `pages/Practice/ui/PracticeFinished.tsx` |
| `components/practice/ApiKeyInput.tsx` | `pages/Practice/ui/ApiKeyInput.tsx` |
| `hooks/shared/useTopicContent.ts` | `pages/Practice/model/useTopicContent.ts` |
| `hooks/practice/useCardDeck.ts` | `pages/Practice/model/useCardDeck.ts` |
| `hooks/practice/usePracticeSession.ts` | `pages/Practice/model/usePracticeSession.ts` |
| `hooks/practice/useSessionStats.ts` | `pages/Practice/model/useSessionStats.ts` |
| `routes/event-loop.tsx` (layout part) | `pages/EventLoop/index.tsx` |
| `components/event-loop/StepVisualizer.tsx` | `pages/EventLoop/ui/StepVisualizer.tsx` |

### FlashCard → `pages/Practice/ui/FlashCard/`

| From | To |
|---|---|
| `components/practice/FlashCard/index.tsx` | `pages/Practice/ui/FlashCard/index.tsx` |
| `components/practice/FlashCard/types.ts` | `pages/Practice/ui/FlashCard/types.ts` |
| `components/practice/FlashCard/CardActions.tsx` | `pages/Practice/ui/FlashCard/ui/CardActions.tsx` |
| `components/practice/FlashCard/CardAnswerInput.tsx` | `pages/Practice/ui/FlashCard/ui/CardAnswerInput.tsx` |
| `components/practice/FlashCard/CardProgress.tsx` | `pages/Practice/ui/FlashCard/ui/CardProgress.tsx` |
| `components/practice/FlashCard/CardReferenceAnswer.tsx` | `pages/Practice/ui/FlashCard/ui/CardReferenceAnswer.tsx` |
| `components/practice/FlashCard/CardScore.tsx` | `pages/Practice/ui/FlashCard/ui/CardScore.tsx` |
| `components/practice/FlashCard/CardUserAnswer.tsx` | `pages/Practice/ui/FlashCard/ui/CardUserAnswer.tsx` |
| `components/practice/FlashCard/useAnswerCheck.ts` | `pages/Practice/ui/FlashCard/model/useAnswerCheck.ts` |
| `components/practice/FlashCard/useFlashCardKeyboard.ts` | `pages/Practice/ui/FlashCard/model/useFlashCardKeyboard.ts` |
| `components/practice/FlashCard/useSpeechAnswer.ts` | `pages/Practice/ui/FlashCard/model/useSpeechAnswer.ts` |
| `hooks/shared/useSpeechRecognition.ts` | `pages/Practice/ui/FlashCard/model/useSpeechRecognition.ts` |

### New: `shared/` layer (replaces `components/`)

| From | To |
|---|---|
| `components/shared/ui/*` | `shared/ui/*` |
| `components/shared/CodeBlock.tsx` | `shared/ui/CodeBlock.tsx` |
| `components/shared/TopicIcon.tsx` | `shared/ui/TopicIcon.tsx` |
| `components/layout/Layout.tsx` | `shared/layout/Layout.tsx` |
| `components/layout/LanguageSwitcher.tsx` | `shared/layout/LanguageSwitcher.tsx` |
| `hooks/shared/useTheme.ts` | `shared/layout/model/useTheme.ts` |

### Deleted

- `hooks/` — entire directory
- `components/` — entire directory (all contents migrated above)

---

## Final Structure

```
app/
├── app.css
├── root.tsx
├── routes.ts
│
├── assets/
│   └── icons/
│
├── routes/                                      # thin — loader/action + one import
│   ├── home.tsx
│   ├── topic-theory.tsx
│   ├── topic-practice.tsx
│   └── event-loop.tsx
│
├── pages/
│   ├── Home/
│   │   ├── index.tsx
│   │   ├── ui/
│   │   │   └── TopicCard.tsx
│   │   └── model/
│   │       └── useProgress.ts
│   ├── Theory/
│   │   ├── index.tsx
│   │   ├── ui/
│   │   │   ├── TheoryCard.tsx
│   │   │   ├── TheoryPageHeader.tsx
│   │   │   ├── TheoryPracticeCta.tsx
│   │   │   └── TheoryToc.tsx
│   │   └── model/
│   │       ├── useActiveSection.ts
│   │       ├── useTheoryContent.ts
│   │       └── useTocOutsideClick.ts
│   ├── Practice/
│   │   ├── index.tsx
│   │   ├── ui/
│   │   │   ├── PracticePlaying.tsx
│   │   │   ├── PracticeSetup.tsx
│   │   │   ├── PracticeFinished.tsx
│   │   │   ├── ApiKeyInput.tsx
│   │   │   └── FlashCard/
│   │   │       ├── index.tsx
│   │   │       ├── types.ts
│   │   │       ├── ui/
│   │   │       │   ├── CardActions.tsx
│   │   │       │   ├── CardAnswerInput.tsx
│   │   │       │   ├── CardProgress.tsx
│   │   │       │   ├── CardReferenceAnswer.tsx
│   │   │       │   ├── CardScore.tsx
│   │   │       │   └── CardUserAnswer.tsx
│   │   │       └── model/
│   │   │           ├── useAnswerCheck.ts
│   │   │           ├── useFlashCardKeyboard.ts
│   │   │           ├── useSpeechAnswer.ts
│   │   │           └── useSpeechRecognition.ts
│   │   └── model/
│   │       ├── useCardDeck.ts
│   │       ├── usePracticeSession.ts
│   │       ├── useSessionStats.ts
│   │       └── useTopicContent.ts
│   └── EventLoop/
│       ├── index.tsx
│       └── ui/
│           └── StepVisualizer.tsx
│
├── shared/                                      # cross-route only, replaces components/
│   ├── ui/
│   │   ├── CodeBlock.tsx
│   │   ├── TopicIcon.tsx
│   │   ├── StarRating.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   └── textarea.tsx
│   └── layout/
│       ├── Layout.tsx
│       ├── LanguageSwitcher.tsx
│       └── model/
│           └── useTheme.ts
│
├── contexts/
│   └── LanguageContext/                         # unchanged
│       ├── index.ts
│       ├── LanguageProvider.tsx
│       ├── languageContext.ts
│       └── useLanguage.ts
│
└── lib/                                         # pure functions only, no hooks
    ├── codeHighlight.ts
    ├── contentLoader.ts
    ├── cookies.ts
    ├── i18n.ts
    ├── llm.ts
    └── utils.ts
```

---

## Implementation Steps

1. **Create `pages/Home/`** — create `index.tsx`, move `TopicCard.tsx` → `ui/`, move `useProgress.ts` → `model/`, update imports in `routes/home.tsx`
2. **Create `pages/Theory/`** — create `index.tsx`, move theory components → `ui/`, move theory hooks → `model/`, update imports in `routes/topic-theory.tsx`
3. **Create `pages/Practice/`** — create `index.tsx`, move practice components → `ui/`, move practice + shared hooks → `model/`, update imports in `routes/topic-practice.tsx`
4. **Create `pages/Practice/ui/FlashCard/`** — move FlashCard into `ui/FlashCard/`, reorganize into `ui/` + `model/`, move `useSpeechRecognition` into `model/`
5. **Create `pages/EventLoop/`** — create `index.tsx`, move `StepVisualizer.tsx` → `ui/`, update imports in `routes/event-loop.tsx`
6. **Create `shared/`** — move `components/shared/ui/*` → `shared/ui/`, move `components/layout/*` → `shared/layout/`, move `useTheme.ts` → `shared/layout/model/`, update all imports
7. **Delete** `hooks/`, `components/`
8. **Typecheck** — `npm run typecheck`
