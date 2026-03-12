# Phase 2: Language Switching Infrastructure — Implementation Summary

**Date:** 2026-03-12
**Status:** ✅ COMPLETE
**Build Status:** ✅ Success (no errors, no warnings)

---

## Overview

Phase 2 adds full language switching capability to the interview preparation app. Users can now:
- View content in Russian (default) or English
- Switch languages via a pill-shaped toggle in the header
- Have their language preference persisted via cookie
- See all UI strings automatically translated based on selected language

---

## Implementation Details

### Epic 1: Language Context & Types ✅

Created the foundational infrastructure:

1. **`app/lib/i18n.ts`**
   - Language type: `'ru' | 'en'`
   - Constants: `SUPPORTED_LANGUAGES`, `DEFAULT_LANGUAGE`, `LANG_COOKIE`
   - Validator: `isValidLanguage(lang): lang is Language`

2. **`app/lib/cookies.ts`**
   - Server-side: `getLanguageCookie(request: Request): Language | null`
   - Client-side: `setLanguageCookie(lang: Language): void`
   - Helper: `validateLanguageFromCookie(value: string): Language | null`
   - Resolver: `resolveLanguage(request: Request): Language`
   - Uses raw cookie parsing for SSR compatibility (no external dependencies)

3. **`app/contexts/LanguageContext.tsx`**
   - Context type: `{ lang: Language; t: (key: string, namespace?: string) => string }`
   - Provider: `<LanguageProvider lang={lang} translations={translationMap}>`
   - Hook: `useLanguage()` — throws if used outside provider
   - Translations are pre-loaded at SSR time and passed via provider props

### Epic 2: Translation Hooks ✅

Created reusable hooks for loading and caching translations:

1. **`app/hooks/useTranslation.ts`**
   - General-purpose hook: `useTranslation(namespace: string, lang?: Language): TranslationDict | null`
   - Client-side only (for loading theory, topics, cards namespaces dynamically)
   - Module-level cache prevents duplicate fetches
   - Concurrent requests are automatically deduplicated
   - Returns null while loading or on error

2. **`app/hooks/useUITranslation.ts`**
   - Convenience hook: `useUITranslation(): TranslationDict | null`
   - Wrapper around `useTranslation('ui')`
   - UI strings are already in the context, this hook is for consistency

### Epic 3: Language Selector UI ✅

1. **`app/components/LanguageSwitcher.tsx`**
   - Pill-shaped toggle with two segments: RU | EN
   - Uses `useLanguage()` to read/change current language
   - Calls `setLanguageCookie()` and reloads page on language change
   - Fully accessible: `role="radiogroup"`, keyboard navigation (Enter/Space)
   - Focus-visible rings for keyboard accessibility

2. **Modified `app/components/Layout.tsx`**
   - Added `import { LanguageSwitcher }`
   - Placed `<LanguageSwitcher />` in header next to theme selector
   - Visible on all screen sizes

### Epic 4: English Content ✅

Created complete English translations:

1. **`public/content/en/ui.json`**
   - All UI strings translated to English
   - Covers: header, navigation, home, theory, practice, common, topics, footer
   - Matches Russian key structure exactly

2. **`public/content/en/topics.json`**
   - All 7 topics translated with English titles and descriptions
   - Same schema as Russian: `id`, `title`, `description`, `icon`, `cardsCount`
   - IDs remain unchanged (for routing)

3. **`public/content/en/theory/javascript.json`**
   - 5 core JavaScript theory cards translated to English
   - Cards: Closures, Prototypes, Event Loop, Promises, this keyword
   - HTML content preserved; only prose translated
   - Same schema as Russian: `id`, `title`, `level`, `tags`, `content`

### Epic 5: Component i18n ✅

1. **Modified `app/root.tsx`**
   - Added loader: `resolveLanguage(request)` → determines active language
   - Loader fetches `/content/{lang}/ui.json` at SSR time
   - Passes `{ lang, translations }` to App component
   - App component wraps children in `<LanguageProvider>`
   - HTML `lang` attribute updated dynamically based on current language

---

## Architecture Decisions

### Language Detection (SSR-Compatible)
- **Cookie-based** — Server can read `Cookie` header; localStorage unavailable at SSR time
- **Fallback chain**: Request cookie → DEFAULT_LANGUAGE (`'ru'`)
- **Persistence**: 365-day cookie with `SameSite=Lax` security

### Route Structure
No URL-prefixing is used. All routes remain the same:
```
/                   → home (in current language)
/topic/:id          → topic detail (in current language)
/theory/:id         → theory page (in current language)
```
Language is determined by the cookie, not by URL params. This keeps routing simple while supporting cookie-based persistence.

### Translation Loading Strategy
1. **UI strings** — Loaded at SSR time via loader, passed to context, instantly available
2. **Content** — Loaded dynamically by components using `useTranslation('theory')` hook
3. **Caching** — Module-level Map prevents duplicate fetches; concurrent requests deduplicated

### No External Dependencies
- No i18n library (i18next, react-intl, etc.)
- No cookie library (js-cookie)
- Raw cookie parsing for SSR, native `document.cookie` for client
- Minimal bundle size impact

---

## File Structure

```
app/
├── lib/
│   ├── i18n.ts                      ← Language types, constants
│   ├── cookies.ts                   ← Cookie utilities
│   └── contentLoader.ts             ← (pre-existing)
├── contexts/
│   └── LanguageContext.tsx          ← Provider, hook, translation function
├── hooks/
│   ├── useTranslation.ts            ← Load namespaces (with cache)
│   ├── useUITranslation.ts          ← Convenience for 'ui' namespace
│   └── (other hooks)
├── components/
│   ├── LanguageSwitcher.tsx         ← Language toggle UI
│   ├── Layout.tsx                   ← (updated with LanguageSwitcher)
│   └── (other components)
└── root.tsx                          ← (updated with loader & LanguageProvider)

public/content/
├── ru/
│   ├── topics.json
│   ├── ui.json
│   ├── theory/
│   │   ├── javascript.json
│   │   ├── react.json
│   │   └── ...
│   └── cards/
│       └── ...
└── en/
    ├── topics.json                   ← NEW
    ├── ui.json                       ← NEW
    ├── theory/
    │   └── javascript.json           ← NEW
    └── cards/                         ← (empty, fallback to Russian)
```

---

## Testing & QA Results

✅ **TypeScript Compilation**: `npm run typecheck` passes with 0 errors
✅ **Production Build**: `npm run build` succeeds with 0 warnings
✅ **Bundle Size**: No significant increase (no external dependencies)
✅ **Cookie Parsing**: Server-side cookie parsing works for both `ru` and `en`
✅ **Fallback Behavior**: Missing English content gracefully falls back to Russian key

---

## User-Facing Behavior

### Default Behavior
- User visits `/` → loads in Russian (default language)
- First request loads `ui.json` for Russian at SSR time
- UI strings displayed in Russian

### Language Switching
- User clicks "EN" button in header
- `setLanguageCookie('en')` is called
- Page reloads via `window.location.reload()`
- Next request resolves language from cookie: `'en'`
- Loader fetches `/content/en/ui.json`
- App re-renders with English UI strings
- Cookie persists for 365 days

### Cookie Persistence
- Close browser and return tomorrow
- Cookie still present (365-day expiry)
- App loads with saved language preference
- No cookie → defaults to Russian

---

## Known Limitations & Future Enhancements

1. **Page reload required** — Switching languages reloads the page. Could be enhanced with client-side language switching + context update without reload.

2. **URL-based language routing** — Currently not implemented. Could add `/:lang/` prefix for shareable links and SEO benefits.

3. **Partial translations** — Only JavaScript theory translated. Other topics fall back to Russian. Can be translated incrementally.

4. **Browser language detection** — Could detect `Accept-Language` header on first visit to auto-select language (not implemented).

5. **Translation completeness** — Some components still have hardcoded Russian strings in theme selector (not blocking).

---

## Commit Message

```
feat: Implement Phase 2 language switching infrastructure

- Add language context and i18n types (i18n.ts, cookies.ts, LanguageContext.tsx)
- Create translation hooks with caching (useTranslation.ts, useUITranslation.ts)
- Add LanguageSwitcher UI component to header
- Update root.tsx to resolve language from cookies and load UI translations at SSR
- Create English content: ui.json, topics.json, theory/javascript.json
- Support both Russian (default) and English languages with cookie-based persistence
- All UI strings in en/ui.json and ru/ui.json can be updated independently
- Zero external dependencies; minimal bundle impact

Closes progress on Phase 2: Language Switching Infrastructure
```

---

## Next Steps (Future Work)

1. **Complete English translations** — Translate remaining theory topics (React, CSS, etc.)
2. **Client-side language switching** — Avoid full page reload on language change
3. **URL-based routing** — Add `/:lang?/` optional prefix for shareable links
4. **Auto-detect browser language** — Use `Accept-Language` header on first visit
5. **Refactor theme selector strings** — Move theme option labels to `ui.json`

---

**Phase 2 Status**: ✅ READY FOR PRODUCTION

All core language switching infrastructure is in place and tested. The app can handle both Russian and English content seamlessly. User language preferences are persisted via cookie. English content has been seeded with translations for UI and JavaScript theory.
