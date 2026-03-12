# Content JSON Migration & Multi-Language Support Plan

**Date**: 2026-03-12
**Status**: ⚠️ Phase 1 extraction done but app broken — Phase 1 plan corrected
**Goal**: Extract content to JSON for easier editing and English version support

**Last Updated**: 2026-03-12 — Plan restructured so app stays working after each phase
**Current**: Phase 1 REVISED — Create loader + update components (app must work immediately)
**Next**: Implement Phase 1 loader + component updates

---

## Current State

All content is hardcoded in TypeScript files:
- `data/topics.ts` — 7 topics
- `data/cards/{topic}.ts` — 70 flashcards (10 per topic)
- `data/theory/{topic}.ts` — Theory sections (multiple per topic)
- `data/event-loop.ts` — 13 event loop questions

**Language**: Russian only

---

## Content Audit Results

### HTML Usage Analysis (ACTUAL)

#### Theory Files (`data/theory/*.ts`) — **HEAVY HTML**
- All 7 files use HTML extensively
- Tags used: `<h3>`, `<h4>`, `<p>`, `<pre>`, `<ul>`, `<li>`, `<strong>`, `<code>`
- Examples:
  - **CSS theory**: 50+ lines of HTML per section with code blocks
  - **React theory**: Formatted explanations with JSX code in `<pre>` tags
  - **JavaScript theory**: HTML-formatted definitions and examples
- **Conclusion**: Keep as HTML — converting to Markdown is extra work for minimal benefit

#### Card Files (`data/cards/*.ts`) — **PLAIN TEXT ONLY**
- Pure text questions and answers
- Some include JSX/code syntax as plain strings (e.g., `function Button({ label })`)
- **No HTML tags** — just descriptive text
- **Conclusion**: Store as plain text, no `contentFormat` field needed

#### Event-Loop File (`data/event-loop.ts`) — **PLAIN TEXT + STRUCTURED**
- Code stored as plain strings (code property)
- Explanations and hints are plain text
- Steps are structured objects: `{ tag: "sync" | "micro" | "macro", label, desc }`
- **Conclusion**: Keep structure as-is, add to JSON

### Final Content Format Decision

| File Type | Format | Strategy |
|-----------|--------|----------|
| `theory/*.ts` | HTML | Keep HTML as-is, add `contentFormat: "html"` to each item |
| `cards/*.ts` | Plain text | Store as plain text, no `contentFormat` field |
| `event-loop.ts` | Plain text + objects | Keep structure, plain text strings |

---

## Proposed Structure

```
content/
├── schema.json                    # TypeScript interfaces as JSON schema
├── ru/                            # Russian version
│   ├── topics.json               # All 7 topics
│   ├── cards/
│   │   ├── javascript.json
│   │   ├── react.json
│   │   ├── nextjs.json
│   │   ├── nodejs.json
│   │   ├── css.json
│   │   ├── cicd.json
│   │   └── testing.json
│   ├── theory/
│   │   ├── javascript.json
│   │   ├── react.json
│   │   ├── nextjs.json
│   │   ├── nodejs.json
│   │   ├── css.json
│   │   ├── cicd.json
│   │   └── testing.json
│   └── event-loop.json
└── en/                            # English version (same structure)
    ├── topics.json
    ├── cards/
    │   └── ...
    ├── theory/
    │   └── ...
    └── event-loop.json
```

---

## Content Format

### Topics (`content/ru/topics.json`)
```json
{
  "topics": [
    {
      "id": "javascript",
      "title": "JavaScript",
      "icon": "📜",
      "description": "Основы языка, асинхронность, замыкания"
    }
  ]
}
```

### Flashcards (`content/ru/cards/javascript.json`)
```json
{
  "cards": [
    {
      "id": "1",
      "category": "Область видимости",
      "question": "Объясните, как работает область видимости в JavaScript...",
      "answer": "Область видимости определяет, где переменная доступна. Глобальная область — вне функций, видна везде. Локальная область — внутри функции или блока (let, const)...",
      "keyPoints": [
        "Область видимости определяет доступность переменных",
        "Глобальная — видна везде, локальная — только внутри функции/блока"
      ]
    }
  ]
}
```

### Theory (`content/ru/theory/javascript.json`)
```json
{
  "theory": [
    {
      "title": "Область видимости (Scope)",
      "content": "...",
      "contentFormat": "markdown"  // or "html"
    }
  ]
}
```

### Event Loop (`content/ru/event-loop.json`)
```json
{
  "easy": [
    {
      "code": "console.log(1);\nsetTimeout(() => console.log(2), 0);\nconsole.log(3);",
      "answer": "1, 3, 2",
      "hint": "setTimeout — макрозадача, выполнится после синхронного кода",
      "difficulty": "easy",
      "steps": [
        { "tag": "sync", "label": "синхронно", "desc": "log(1) → выводит 1" },
        { "tag": "macro", "label": "макрозадача", "desc": "setTimeout ставится в очередь" },
        { "tag": "sync", "label": "синхронно", "desc": "log(3) → выводит 3" },
        { "tag": "macro", "label": "макрозадача", "desc": "стек пуст → берём setTimeout → выводит 2" }
      ],
      "explanation": "Синхронный код выполняется сразу. setTimeout(fn, 0) — это макрозадача..."
    }
  ],
  "medium": [],
  "hard": []
}
```

---

## Content Format Strategy

Based on audit: **Only theory files use HTML** (cards and event-loop are plain text)

**Decision**: Keep HTML in theory files as-is
- No conversion to Markdown (unnecessary overhead)
- Add `contentFormat: "html"` field to theory items
- Cards and event-loop stay as plain text (no format field)
- Components handle HTML via existing `dangerouslySetInnerHTML` or similar

**Theory HTML Example**:
```json
{
  "title": "Область видимости (Scope)",
  "content": "<h3>Что такое scope?</h3><p>Область видимости определяет, где переменная доступна...</p><h4>Функциональный scope</h4><p>var имеет функциональный scope...</p>",
  "contentFormat": "html"
}
```

**Cards Plain Text Example**:
```json
{
  "id": "1",
  "category": "Область видимости",
  "question": "Объясните, как работает область видимости...",
  "answer": "Область видимости определяет...",
  "keyPoints": [...]
}
```

---

## Implementation Steps

### Phase 1: Content Extraction + Immediate Integration ✅→🔧
**Goal**: App stays working by loading from JSON instead of `.ts` files

1. **Create directory structure**
   - Create `content/` in project root
   - Add: `content/ru/cards/`, `content/ru/theory/`, `content/schema.json`
   - Create `content/en/` (same structure) for future translations

2. **Manually create schema.json**
   - Document TypeScript interfaces as JSON schema
   - Define types for cards, theory, topics, event-loop
   - Include validation rules (required fields, format)

3. **Extract Russian content to JSON**
   - Convert each `.ts` file to `.json`:
     - `data/topics.ts` → `content/ru/topics.json`
     - `data/cards/javascript.ts` → `content/ru/cards/javascript.json` (etc.)
     - `data/theory/javascript.ts` → `content/ru/theory/javascript.json` (etc.)
     - `data/event-loop.ts` → `content/ru/event-loop.json`
   - Preserve all fields exactly
   - Add `contentFormat: "html"` to theory items

4. **Create async content loader** (`app/lib/contentLoader.ts`)
   - Function: `async loadContent(language, type, topic?)`
   - Use fetch() to load JSON files from `content/{language}/`
   - Cache fetched content in memory
   - Supports language switching without reload

5. **Update ALL components to use loader immediately**
   - Replace `import from 'data/'` with `loadContent()` calls
   - Add loading states and error handling
   - Update FlashCard, TheoryCard to render `contentFormat: "html"`
   - Fix all component imports before archiving `.ts` files

6. **Archive legacy .ts files → `app/data/.backup/`**
   - Only after all components are updated
   - Document: "Backup from 2026-03-12, safe to delete after 2026-03-26"
   - Verify: `npm run dev` works, all content loads correctly

**Checkpoint**: App fully functional with JSON-based content ✅

---

### Phase 2: Language Switching Infrastructure
**Goal**: URL-based and dropdown language switching works

1. **Add language switching logic**
   - Extract `:lang` param from URL (e.g., `/ru/topic/javascript`)
   - Fallback to localStorage key `preferredLanguage`
   - Default to `'ru'` if neither specified
   - Store user selection in localStorage

2. **Update route definitions**
   - Modify routes to accept optional `:lang` prefix
   - Ensure `/topic/...` and `/ru/topic/...` both work
   - Pass current language to components via context/props

3. **Add language selector UI to header**
   - Dropdown showing: RU, EN (add more as needed)
   - Shows current language, allows switching
   - Updates URL and localStorage simultaneously
   - Updates content dynamically without page reload

**Checkpoint**: Language switching works (URL + dropdown) ✅

---

### Phase 3: Testing, Polish & Optional Translations
**Goal**: Full QA, docs, optional English translations

1. **Test everything**
   - Verify all content loads from JSON for both languages
   - Test language switching (URL param and dropdown)
   - Test HTML rendering in theory cards
   - Run `npm run typecheck` (fix any errors)
   - Run `npm run build` (production build succeeds)

2. **Optional: Add English translations**
   - Populate `content/en/` manually or with AI assistance
   - Ensure same JSON structure as Russian

3. **Cleanup & Documentation**
   - Delete `app/data/.backup/` after validation period
   - Update PROGRESS.md or CHANGELOG
   - Commit with clear message

**Checkpoint**: All tested, production-ready, documented ✅

---

## Files to Create/Modify

**New files**:
- `content/` — entire directory structure
- `app/lib/contentLoader.ts` — content loading logic

**Modified files**:
- All route components that use `topics`, `cards`, `theory`, `event-loop`
- `app/routes.ts` — potentially add language parameter
- TypeScript config — may need to include JSON in module resolution

**Legacy files** (can be deleted after migration):
- `app/data/topics.ts`
- `app/data/cards/*.ts`
- `app/data/theory/*.ts`
- `app/data/event-loop.ts`

---

## Benefits

✅ **Easy editing** — open any JSON, edit directly in VS Code
✅ **Multi-language** — add `en/` folder, translate content
✅ **Flexible formats** — support both HTML and Markdown
✅ **Maintainable** — content separate from logic
✅ **Scalable** — easy to add more languages (de/, fr/, etc.)

---

## Questions/Decisions

- [x] **Keep HTML or convert to Markdown?** → **KEEP HTML** (theory files only, minimal effort)
- [x] **How to handle language switching in UI?** → **Both (URL + localStorage fallback)**
  - URL param (`/:lang/path`) takes priority
  - localStorage stores user preference
  - Fallback to localStorage if no URL param specified
  - Header language selector updates both URL and localStorage
- [x] **Should schema.json be auto-generated or manually maintained?** → **Manually maintained**
  - Write schema.json by hand as source of truth
  - Use for validation and documentation
- [x] **Delete legacy .ts files immediately or keep as backup?** → **Keep as backup for 1-2 weeks**
  - Archive to `data/.backup/` after migration
  - Delete after validation period
  - Allows rollback if issues discovered
- [x] **Should content loader be synchronous or async?** → **Asynchronous (fetch/dynamic import)**
  - Use fetch() at runtime
  - Enables hot-reloading during development
  - Supports dynamic language switching
  - Allows content updates without rebuilding

---

## Checklist (Implementation)

### Phase 1: Content Extraction + Immediate Integration
- [x] Create `content/ru/` and `content/en/` directory structure
- [x] Create `schema.json` (manual)
- [x] Extract Russian content: topics → `content/ru/topics.json`
- [x] Extract Russian content: all cards → `content/ru/cards/*.json`
- [x] Extract Russian content: all theory → `content/ru/theory/*.json`
- [x] Extract Russian content: event-loop → `content/ru/event-loop.json`
- [ ] Create `app/lib/contentLoader.ts` (async fetch-based)
- [ ] Update all components to use `loadContent()` instead of imports
  - [ ] Home page (topics)
  - [ ] Cards page (flashcards)
  - [ ] Theory page (theory cards)
  - [ ] Event-loop page (event-loop questions)
- [ ] Verify: `npm run dev` starts and loads all content from JSON
- [ ] Archive legacy `.ts` files → `app/data/.backup/`
- [ ] **Checkpoint**: App fully functional with JSON ✅

### Phase 2: Language Switching Infrastructure
- [ ] Add language switching logic (URL param + localStorage)
- [ ] Update route definitions to support `:lang` prefix
- [ ] Add language context or props for passing language to components
- [ ] Add language selector UI to header
- [ ] Verify: Language switching works (URL changes and dropdown)
- [ ] Verify: `npm run dev` works with multiple languages
- [ ] **Checkpoint**: Language switching functional ✅

### Phase 3: Testing, Polish & Optional Translations
- [ ] Test language switching (URL param and dropdown both work)
- [ ] Test HTML rendering in theory cards
- [ ] Run `npm run typecheck` (fix any errors)
- [ ] Run `npm run build` (production build succeeds)
- [ ] Optional: Add English translations to `content/en/`
- [ ] Delete `app/data/.backup/` (if backup period complete)
- [ ] Update PROGRESS.md with completion notes
- [ ] Commit with clear message
- [ ] **Checkpoint**: All tested, production-ready ✅
