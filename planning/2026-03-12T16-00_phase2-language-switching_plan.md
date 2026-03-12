# Phase 2: Language Switching Infrastructure

**Date**: 2026-03-12
**Status**: Ready to implement (Phase 1 complete)
**Prerequisite**: Phase 1 content extraction ✅

---

## Overview

Phase 2 adds language switching capability to the app. Users will be able to:
- View content in Russian or English
- Switch via URL param (`/ru/topic/...` vs `/en/topic/...`)
- Switch via dropdown UI in header
- Preference stored in cookie and localStorage

---

## Architecture Decisions

### Language Detection (SSR-Compatible)
- **URL prefix**: Optional `/:lang?` route param (e.g., `/ru/topic/javascript`)
- **Default**: `'ru'` (Russian)
- **Cookie**: `lang` — used for SSR (localStorage not available on server)
- **Fallback chain**: URL param → cookie → default

### Route Structure
```
/:lang?/                    → home
/:lang?/topic/:topicId      → topic detail
/:lang?/theory/:topicId     → theory page
/:lang?/cards/:topicId      → flashcards
/:lang?/event-loop          → event loop trainer
/:lang?/voice-input         → voice input
```

### Why This Approach?
- **URL-based**: Clean, SEO-friendly, shareable links
- **Cookie over localStorage**: SSR loaders can't read localStorage
- **Optional prefix**: `/topic/js` works (defaults to Russian)
- **No external i18n library**: Project is small (2 languages, ~45 UI strings)

---

## Implementation Phases

### Epic 1: Language Context & Types (3 tasks)

**Task 1.1: Create `app/lib/i18n.ts`**
- Type: `Language = 'ru' | 'en'`
- Constants: `SUPPORTED_LANGUAGES`, `DEFAULT_LANGUAGE`
- Helper: `isValidLanguage(lang: string): lang is Language`
- Helper: `resolveLanguage(param?: string, cookie?: string): Language`
- Cookie name constant: `LANG_COOKIE = 'lang'`

**Task 1.2: Create `app/contexts/LanguageContext.tsx`**
- Context: `{ lang: Language, setLang: (lang: Language) => void, t: (key: string) => string }`
- Provider: accepts initial `lang` and `uiStrings` as props
- Hook: `useLanguage()` returns context
- `setLang` triggers navigation to new language URL + sets cookie

**Task 1.3: Create `app/lib/cookies.ts`**
- Server: `getLanguageCookie(request: Request): Language | null`
- Server: `setLanguageCookie(lang: Language): string` (returns Set-Cookie header)
- Client: `setLangPreference(lang: Language)` (sets cookie + localStorage)

---

### Epic 2: Route Restructuring (3 tasks)

**Task 2.1: Add language-aware layout route**
- Create: `app/routes/lang-layout.tsx` (NEW)
- Modify: `app/routes.ts` to add `/:lang?` prefix
- Layout loader:
  1. Read `params.lang`
  2. Read cookie via `getLanguageCookie(request)`
  3. Fall back to `DEFAULT_LANGUAGE`
  4. Load `getUIStrings(resolvedLang)`
  5. Return `{ lang, uiStrings }`
- Layout component: Wrap children in `LanguageProvider`

**Task 2.2: Update child route loaders**
- All child loaders (home, topic, theory, cards, event-loop) read language from parent
- Pass `lang` to `loadContent()` calls
- Example: `loadContent(lang, 'theory', topicId)`

**Task 2.3: Create link helper**
- File: `app/lib/langRoute.ts`
- Function: `langPath(lang: Language, path: string): string`
- Returns: `/${lang}${path}` or just `${path}` if lang is default (optional)
- Use everywhere instead of hardcoded paths

---

### Epic 3: Language Selector UI (2 tasks)

**Task 3.1: Create `LanguageSelector` component**
- Simple toggle/dropdown: RU | EN
- Uses `useLanguage()` hook
- On change: calls `setLang(newLang)` which updates URL + cookie
- Styled like existing ThemeToggle (small, accessible)

**Task 3.2: Add to Header**
- Modify: `app/components/Header.tsx`
- Place `LanguageSelector` next to `ThemeToggle`
- Update header title to use `t('header.appTitle')` instead of hardcoded Russian
- Make responsive (both visible on mobile)

---

### Epic 4: English Content (2 tasks)

**Task 4.1: Create English content stubs**
- Create: `public/content/en/topics.json` (translated topic names + descriptions)
- Create: `public/content/en/ui.json` (all UI strings translated)
- Create: `public/content/en/theory/` (at minimum JavaScript topic, others can be stubs)
- Strategy: Start with stubs, full translation optional

**Task 4.2: Update `contentLoader` for English**
- Modify: `app/lib/contentLoader.ts`
- Support: `loadContent(lang, 'topics')` where `lang = 'en'`
- Fallback: If English file missing, fall back to Russian with banner

---

### Epic 5: Component i18n (2 tasks)

**Task 5.1: Update routes to use `t()` function**
- All routes: replace hardcoded Russian strings with `t()` calls
- Example: `<h1>{t('home.pageTitle')}</h1>` instead of `<h1>Подготовка к собеседованию</h1>`
- Files: home.tsx, topic-theory.tsx, topic-practice.tsx, event-loop.tsx, voice-input.tsx

**Task 5.2: Update components to use `t()`**
- Header.tsx: `{t('header.appTitle')}`
- TopicCard.tsx: Button text from `t()`
- TheoryCard.tsx: Any hardcoded labels from `t()`

---

### Epic 6: QA & Testing (3 tasks)

**Task 6.1: Verify language switching**
- Navigate to `/` → defaults to Russian
- Navigate to `/en/` → shows English (if available, else Russian)
- Click language selector → URL updates, content changes
- Refresh page → language preference persists (via cookie)

**Task 6.2: Full verification**
- Run `npm run typecheck` (no errors)
- Run `npm run build` (succeeds)
- Test deep links: `/en/topic/javascript`, `/ru/theory/react`
- Test invalid lang: `/fr/topic/js` → falls back to default

**Task 6.3: Screenshot documentation**
- Take screenshots of all major pages in both languages
- Save to `dev-screen/2026-03-12__language-switching/`

---

## Files to Create/Modify Summary

### New Files
| File | Epic | Purpose |
|------|------|---------|
| `app/lib/i18n.ts` | 1 | Language types, constants, helpers |
| `app/lib/cookies.ts` | 1 | Cookie read/write for SSR |
| `app/contexts/LanguageContext.tsx` | 1 | Language provider + hook |
| `app/routes/lang-layout.tsx` | 2 | Layout route for language resolution |
| `app/lib/langRoute.ts` | 2 | Language-aware URL helper |
| `app/components/LanguageSelector.tsx` | 3 | Language toggle UI |
| `public/content/en/topics.json` | 4 | English topics |
| `public/content/en/ui.json` | 4 | English UI strings |
| `public/content/en/theory/*.json` | 4 | English theory (stubs/partial) |

### Modified Files
| File | Epic | Change |
|------|------|--------|
| `app/routes.ts` | 2 | Add `/:lang?` prefix layout |
| `app/routes/home.tsx` | 2, 5 | Use language from layout, load with lang param, use `t()` |
| `app/routes/topic-theory.tsx` | 2, 5 | Language-aware loader, use `t()` |
| `app/routes/topic-practice.tsx` | 2, 5 | Language-aware loader, use `t()` |
| `app/routes/event-loop.tsx` | 2, 5 | Language-aware loader, use `t()` |
| `app/routes/voice-input.tsx` | 2, 5 | Language-aware loader, use `t()` |
| `app/components/Header.tsx` | 3, 5 | Add LanguageSelector, use `t()` for title |
| `app/lib/contentLoader.ts` | 4 | Support `lang` parameter in `loadContent()` |

---

## Implementation Order

```
Epic 1 (Foundation):
  1.1 i18n.ts              ← Create language types & helpers
  1.2 LanguageContext.tsx  ← Create provider (depends on 1.1)
  1.3 cookies.ts           ← Create cookie utilities

Epic 2 (Routes):
  2.1 lang-layout.tsx      ← Layout route (depends on 1.2, 1.3)
  2.2 Route loaders        ← Update child routes (depends on 2.1)
  2.3 langRoute.ts         ← URL helper (depends on 1.1)

Epic 3 (UI):
  3.1 LanguageSelector.tsx ← Component (depends on 1.2)
  3.2 Header.tsx           ← Add selector (depends on 3.1)

Epic 4 (Content):
  4.1 English JSON files   ← Create stubs
  4.2 contentLoader        ← Add language support (depends on 4.1)

Epic 5 (Localization):
  5.1 Routes i18n          ← Use t() in routes (depends on 1.2)
  5.2 Components i18n      ← Use t() in components (depends on 1.2)

Epic 6 (QA):
  6.* Testing              ← Full verification
```

---

## Content Files Structure

**Russian (Phase 1 complete)**:
```
public/content/ru/
  ├── topics.json
  ├── ui.json
  ├── theory/
  │   ├── javascript.json
  │   ├── react.json
  │   ├── nextjs.json
  │   ├── nodejs.json
  │   ├── css.json
  │   ├── cicd.json
  │   └── testing.json
  ├── cards/
  │   └── ...
  └── event-loop.json
```

**English (to be created)**:
```
public/content/en/
  ├── topics.json           (new)
  ├── ui.json              (new)
  ├── theory/
  │   ├── javascript.json   (new, required)
  │   ├── react.json        (new, stubs ok)
  │   └── ...
  └── event-loop.json      (optional)
```

---

## UI Strings to Localize

From `public/content/ru/ui.json` (~45 strings):
- **Header**: appTitle, navAriaLabel
- **Nav**: home, theory, cards, practice, eventLoop, voiceInput
- **Buttons**: showAnswer, hideAnswer, nextCard, prevCard, startPractice, tryAgain, submit, close, backToTopics, goBack, goToTopic, clear
- **Labels**: topic, difficulty, question, answer, keyPoints, progress, score, cardCounter, articleCount, cardCount
- **Messages**: loading, errorGeneric, errorNotFound, noResults, correct, incorrect, sessionComplete, noTheoryArticles, noCards, topicNotFound, theoryNotFound
- **Home**: pageTitle, subtitle, topicsHeading
- **EventLoop**: pageTitle, addTask, macrotasks, microtasks, stepForward, runAll, reset
- **VoiceInput**: pageTitle, notSupported, startRecording, stopRecording, transcriptLabel

---

## Key Patterns

### Language-aware loader
```typescript
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const lang = resolveLanguage(params.lang);
  const { theory } = await loadContent(lang, 'theory', params.topicId);
  return { theory, lang };
};
```

### Using language in component
```typescript
export default function TheoryRoute() {
  const { lang, t } = useLanguage();
  const { theory } = useLoaderData<typeof loader>();
  return <TheoryCard title={theory[0].title} />;
}
```

### Language-aware links
```typescript
<Link to={langPath(lang, `/topic/${topicId}`)}>
  {t('buttons.goToTopic')}
</Link>
```

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| SSR hydration mismatch | Broken UI on first load | Use cookie (server-readable) as source of truth, not localStorage |
| Missing English content | Broken English routes | Fallback to Russian with banner "Not yet translated" |
| Deep links with wrong lang | Broken user experience | URL param takes priority, validate and redirect if needed |
| Large JSON files | Slow SSR | Already per-topic splitting in Phase 1 |
| Cookie not set on first visit | No language preference | Default to 'ru', first language switch sets cookie |

---

## Notes

- **No external i18n library**: Project scope is small enough for simple context + `t()` function
- **Cookie priority**: Since loaders run on server and cannot access localStorage, cookies are the SSR source of truth
- **Optional URL prefix**: Users can share `/topic/js` links (works with default language)
- **Dynamic loading**: Content updates when language changes without page reload
- **Future-ready**: Structure supports adding more languages (de/, fr/, etc.) later

---

**Next Steps**: Start with Epic 1 when ready. Use specialist agents:
- **react-logic-builder** → Epic 1 (types, context, cookies)
- **react-ui-builder** → Epic 3 (LanguageSelector component)
- Both → Epic 5 (localization strings)
