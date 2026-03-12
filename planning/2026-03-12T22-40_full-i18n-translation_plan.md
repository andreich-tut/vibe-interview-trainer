# Full Site i18n Translation Plan

**Date:** 2026-03-12
**Goal:** Every visible string on the site switches with the RU/EN toggle — no hardcoded text in any language.

---

## Problem Summary

The translation infrastructure exists (`LanguageContext`, `t()`, `ui.json` for both languages) but **50+ UI strings are hardcoded** — mostly in Russian. Content (topics, theory, cards) already loads per-language correctly. Only the UI shell is broken.

Two additional issues:
- `ru/ui.json` and `en/ui.json` use **different key schemas** — they must be unified
- `event-loop.tsx` is **hard-locked** to `loadContent("ru", ...)` — won't change on EN switch

---

## Approach

### Step 1 — Unify & expand `ui.json` schema (both languages)

Define one canonical key schema that covers every UI string in the app. Rewrite both `public/content/ru/ui.json` and `public/content/en/ui.json` to match it.

**Proposed unified schema:**

```json
{
  "common": {
    "loading": "...",
    "failedToLoad": "...",
    "failedToLoadContent": "...",
    "back": "..."
  },
  "layout": {
    "themeLabel": "...",
    "themeDark": "...",
    "themeLight": "...",
    "themeSystem": "...",
    "goBack": "..."
  },
  "home": {
    "pageTitle": "...",
    "subtitle": "...",
    "eventLoopTitle": "...",
    "eventLoopDesc": "...",
    "eventLoopCta": "..."
  },
  "theory": {
    "pageTitleSuffix": "...",
    "sidebarTitle": "...",
    "sidebarTitleWithCount": "...",
    "readyToPractice": "...",
    "startPractice": "..."
  },
  "practice": {
    "pageTitleSuffix": "...",
    "cardCounterLabel": "...",
    "enterApiKey": "...",
    "start": "...",
    "results": {
      "perfect": "...",
      "excellent": "...",
      "good": "...",
      "needsWork": "..."
    },
    "score": {
      "exact": "...",
      "close": "...",
      "hard": "...",
      "unknown": "...",
      "total": "..."
    },
    "replayed": "...",
    "replayRound": "...",
    "repeatErrors": "...",
    "restart": "...",
    "goToTheory": "...",
    "goHome": "..."
  },
  "topicCard": {
    "theoryBtn": "...",
    "practiceBtn": "..."
  },
  "apiKeyInput": {
    "label": "...",
    "placeholder": "...",
    "hint": "...",
    "submit": "...",
    "clear": "...",
    "saved": "..."
  },
  "flashCard": {
    "showAnswer": "...",
    "hideAnswer": "...",
    "yourAnswer": "...",
    "placeholder": "...",
    "submit": "...",
    "aiChecking": "...",
    "exact": "...",
    "close": "...",
    "hard": "...",
    "unknown": "...",
    "prev": "...",
    "next": "..."
  },
  "eventLoop": {
    "pageTitle": "...",
    "subtitle": "...",
    "addTask": "...",
    "macrotasks": "...",
    "microtasks": "...",
    "stepForward": "...",
    "runAll": "...",
    "reset": "...",
    "correct": "...",
    "incorrect": "..."
  },
  "errorBoundary": {
    "oops": "...",
    "notFoundCode": "...",
    "errorLabel": "...",
    "unexpectedError": "...",
    "pageNotFound": "..."
  }
}
```

---

### Step 2 — Replace hardcoded strings file by file

Use `useLanguage().t("key")` (or `const { t } = useLanguage()`) in every component.

#### Files to update:

| File | Strings to replace |
|------|--------------------|
| `app/routes/home.tsx` | Hero title, subtitle, Event Loop card title/desc/CTA, loading/error messages |
| `app/routes/topic-theory.tsx` | Suffix " — Теория", "Содержание", sidebar count, CTA section, loading/error |
| `app/routes/topic-practice.tsx` | Suffix " — Практика", counter label, results phase (10+ strings), loading/error |
| `app/routes/event-loop.tsx` | Page title, subtitle, all UI labels + **fix language lock** |
| `app/root.tsx` | ErrorBoundary messages |
| `app/components/Layout.tsx` | Theme selector options, goBack button |
| `app/components/TopicCard.tsx` | "Теория" / "Практика" buttons |
| `app/components/ApiKeyInput.tsx` | All 5+ labels |
| `app/components/FlashCard.tsx` | All 10+ interactive labels |

---

### Step 3 — Fix Event Loop language lock

In `event-loop.tsx`, change:
```ts
// Before:
const data = await loadContent("ru", "event-loop");

// After:
const lang = await getLanguageCookie(request);
const data = await loadContent(lang, "event-loop");
```

Also verify `public/content/en/event-loop.json` exists and is complete.

---

## Implementation Order

1. **Step 1** — `design-system-agent` or direct edit: rewrite both `ui.json` files with unified schema + all translations filled in
2. **Step 2a** — `react-ui-builder`: update components (`Layout`, `TopicCard`, `ApiKeyInput`, `FlashCard`)
3. **Step 2b** — `react-ui-builder`: update routes (`home.tsx`, `topic-theory.tsx`, `topic-practice.tsx`, `root.tsx`)
4. **Step 3** — `react-logic-builder`: fix event-loop language lock + update `event-loop.tsx` UI strings
5. **Verify** — Playwright screenshot both languages for all 4 routes

---

## Files Affected

```
public/content/ru/ui.json         ← rewrite with unified schema
public/content/en/ui.json         ← rewrite with unified schema
app/routes/home.tsx
app/routes/topic-theory.tsx
app/routes/topic-practice.tsx
app/routes/event-loop.tsx
app/root.tsx
app/components/Layout.tsx
app/components/TopicCard.tsx
app/components/ApiKeyInput.tsx
app/components/FlashCard.tsx
```

---

## How `t()` Works (for reference)

```tsx
// In any component or route:
const { t } = useLanguage();

// Usage:
t("home.pageTitle")           // → "Подготовка к собеседованию" | "Interview Prep"
t("practice.results.perfect") // → "Идеально!" | "Perfect!"
```

The `t()` function is provided by `LanguageContext` and reads from the pre-loaded `ui.json` for the active language. No async loading needed — it's SSR-ready.

---

## Definition of Done

- [ ] Switch to EN → every string on every page is in English
- [ ] Switch back to RU → every string is in Russian
- [ ] No hardcoded Russian or hardcoded English anywhere in JSX
- [ ] Event Loop loads correct content in both languages
- [ ] No console errors after switching
