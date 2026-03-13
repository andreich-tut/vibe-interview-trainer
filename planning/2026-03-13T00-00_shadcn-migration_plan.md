# Plan: Migrate Design System to shadcn/ui

**Date:** 2026-03-13
**Task:** Replace custom component styling with shadcn/ui primitives

> **Constraint:** Every phase must end with a fully working app.
> Phases may be implemented with delays between them.
> Use an additive strategy: never remove old CSS vars until all components using them have been migrated.

---

## Context

The app currently uses:
- **Tailwind v4** via `@tailwindcss/vite` (CSS-based config, no `tailwind.config.ts`)
- **Custom CSS variables** in `app/app.css`: `--color-bg`, `--color-surface`, `--color-accent`, etc., registered in `@theme` block so they produce Tailwind utilities (`bg-bg`, `bg-surface`, `bg-accent`, `text-muted`, etc.)
- **Fully hand-rolled components** — no component library, everything is Tailwind + CSS vars
- **React Router v7** (framework/SSR mode) — not Next.js
- **React 19**
- **Theme system**: dark by default, `[data-theme="light"]` on `<html>` for light mode

shadcn/ui supports Tailwind v4 (since early 2025) and works with Vite + React Router via manual init.

---

## Components

| Component         | Route(s)                     | Migration phase |
|-------------------|------------------------------|-----------------|
| `ApiKeyInput`     | topic-practice (setup)       | Phase 2         |
| `LanguageSwitcher`| Layout (header)              | Phase 2         |
| `Layout`          | all (header/wrapper)         | Phase 3         |
| `TopicCard`       | home                         | Phase 4         |
| `TheoryCard`      | topic-theory                 | Phase 5         |
| `FlashCard`       | topic-practice (playing)     | Phase 6         |
| `StepVisualizer`  | event-loop (quiz feedback)   | Phase 6         |
| `StarRating`      | —                            | **Keep custom** |
| `CodeBlock`       | event-loop, topic-theory     | **Keep custom** |

---

## Strategy: Additive Migration

The key rule: **both old and new CSS variable naming schemes coexist in `app.css` until Phase 7**.

- Phase 1: Install tooling + add shadcn CSS vars *alongside* existing `--color-*` vars + register new Tailwind utilities via `@theme inline`. Nothing visible changes.
- Phases 2–6: Migrate one component group at a time. Each migrated component switches to shadcn primitives.
- Phase 7: Remove old `--color-*` vars only after all components are migrated.

At no point is the app in a broken state between phases.

### Naming Conflict Resolution

The existing `@theme` block creates Tailwind utilities with potentially conflicting names:
- `bg-accent` currently → `var(--color-accent)` (blue primary)
- `text-muted` currently → `var(--color-muted)` (muted text)
- `border-border` currently → `var(--color-border)` (border)

Shadcn components use `bg-accent`, `text-muted-foreground`, `border-border` expecting *different* semantics.

**Resolution (Phase 1):** Use `@theme inline` to add entirely new Tailwind utilities for shadcn's naming scheme. For names that conflict with existing utilities (`accent`, `muted`, `border`), the `@theme inline` block takes precedence and *overrides* the old mapping. This is safe because **existing components use `var(--color-*)` directly in their JSX `className` via Tailwind utilities like `bg-bg`, `bg-surface` — NOT the conflicting names**. Verify this assumption during Phase 1 by searching for any existing component using `bg-accent`, `text-muted`, or `border-border` Tailwind classes.

---

## CSS Variable Mapping

Old token → shadcn/ui name (values stay the same):

| Current             | shadcn/ui              | Dark value  | Light value |
|---------------------|------------------------|-------------|-------------|
| `--color-bg`        | `--background`         | `#181a1d`   | `#f5f5f5`   |
| `--color-text`      | `--foreground`         | `#bcbec4`   | `#1e1f22`   |
| `--color-surface`   | `--card`               | `#2b2d30`   | `#ffffff`   |
| `--color-text`      | `--card-foreground`    | `#bcbec4`   | `#1e1f22`   |
| `--color-surface`   | `--popover`            | `#2b2d30`   | `#ffffff`   |
| `--color-text`      | `--popover-foreground` | `#bcbec4`   | `#1e1f22`   |
| `--color-accent`    | `--primary`            | `#548af7`   | `#3574f0`   |
| `white`             | `--primary-foreground` | `#ffffff`   | `#ffffff`   |
| `--color-surface2`  | `--secondary`          | `#25262a`   | `#eef0f3`   |
| `--color-text`      | `--secondary-foreground`| `#bcbec4`  | `#1e1f22`   |
| `--color-surface2`  | `--muted`              | `#25262a`   | `#eef0f3`   |
| `--color-muted`     | `--muted-foreground`   | `#7a7e85`   | `#6f737a`   |
| `--color-accent2`   | `--accent`             | `#2aacb8`   | `#1a8a96`   |
| `white`             | `--accent-foreground`  | `#ffffff`   | `#ffffff`   |
| `--color-red`       | `--destructive`        | `#f75464`   | `#db5860`   |
| `--color-border`    | `--border`             | `#3c3f41`   | `#d1d1d6`   |
| `--color-border`    | `--input`              | `#3c3f41`   | `#d1d1d6`   |
| `--color-accent`    | `--ring`               | `#548af7`   | `#3574f0`   |

**Tokens with no shadcn equivalent — keep throughout all phases:**
- `--color-green` — progress bars, success states
- `--color-warning` — amber warnings
- `--color-accent2` — keep as alias for `.prose-dark` styles

---

## Phase 1 — Bootstrap (zero visible change)

**Goal:** shadcn/ui infrastructure is in place. App looks and works identically.

### Steps

1. **Install npm dependencies:**
   ```bash
   cd vibe-interview-app
   npm install class-variance-authority clsx tailwind-merge lucide-react
   npm install @radix-ui/react-slot
   ```

2. **Run shadcn init:**
   ```bash
   npx shadcn@latest init
   ```
   The wizard will ask:
   - Framework: choose **Vite** (or Other — not Next.js)
   - Style: **Default**
   - Base color: **Slate** (will be overridden)
   - CSS variables: **Yes**
   - Path alias for `components`: `~/components`
   - Path alias for `utils`: `~/lib/utils`

   This generates `components.json`, `app/components/ui/`, and `app/lib/utils.ts`.
   **After init: review `app/app.css` — revert any auto-generated CSS blocks** (the init may inject its own `:root` vars — remove them and use our structure below instead).

3. **Verify `app/lib/utils.ts`:**
   ```ts
   import { clsx, type ClassValue } from "clsx"
   import { twMerge } from "tailwind-merge"
   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }
   ```

4. **Update `app/app.css`** — three changes:

   a. **Keep existing `@theme` block** unchanged (preserves existing utilities):
   ```css
   @theme {
     --font-mono: "JetBrains Mono", monospace;
     --font-display: "Unbounded", sans-serif;
     --color-bg: initial;
     --color-surface: initial;
     --color-surface2: initial;
     --color-border: initial;
     --color-accent: initial;
     --color-accent2: initial;
     --color-green: initial;
     --color-red: initial;
     --color-text: initial;
     --color-muted: initial;
     --color-warning: initial;
   }
   ```

   b. **Add `@theme inline` block** (creates NEW Tailwind utilities for shadcn components; overrides conflicting names):
   ```css
   @theme inline {
     --color-background: var(--background);
     --color-foreground: var(--foreground);
     --color-card: var(--card);
     --color-card-foreground: var(--card-foreground);
     --color-popover: var(--popover);
     --color-popover-foreground: var(--popover-foreground);
     --color-primary: var(--primary);
     --color-primary-foreground: var(--primary-foreground);
     --color-secondary: var(--secondary);
     --color-secondary-foreground: var(--secondary-foreground);
     --color-muted: var(--muted);
     --color-muted-foreground: var(--muted-foreground);
     --color-accent: var(--accent);
     --color-accent-foreground: var(--accent-foreground);
     --color-destructive: var(--destructive);
     --color-border: var(--border);
     --color-input: var(--input);
     --color-ring: var(--ring);
     --radius: 0.5rem;
   }
   ```
   > ⚠️ `@theme inline` overrides the `--color-accent`, `--color-muted`, and `--color-border` Tailwind utilities from the base `@theme` block. Before applying, grep for `bg-accent`, `text-muted`, and `border-border` in existing component files. If any are found, replace them with `var(--color-accent)`, `var(--color-muted)`, `var(--color-border)` as inline styles or custom classes first.

   c. **Add shadcn CSS vars additively to `:root` and `[data-theme="light"]`** — old `--color-*` vars remain untouched:

   ```css
   :root,
   [data-theme="dark"] {
     /* ── EXISTING tokens (kept until Phase 7) ── */
     --color-bg: #181a1d;
     --color-surface: #2b2d30;
     --color-surface2: #25262a;
     --color-border: #3c3f41;
     --color-accent: #548af7;
     --color-accent2: #2aacb8;
     --color-green: #73b00a;
     --color-red: #f75464;
     --color-text: #bcbec4;
     --color-muted: #7a7e85;
     --color-warning: #e8a33e;
     color-scheme: dark;

     /* ── NEW shadcn/ui tokens (added alongside) ── */
     --background: #181a1d;
     --foreground: #bcbec4;
     --card: #2b2d30;
     --card-foreground: #bcbec4;
     --popover: #2b2d30;
     --popover-foreground: #bcbec4;
     --primary: #548af7;
     --primary-foreground: #ffffff;
     --secondary: #25262a;
     --secondary-foreground: #bcbec4;
     --muted: #25262a;
     --muted-foreground: #7a7e85;
     --accent: #2aacb8;
     --accent-foreground: #ffffff;
     --destructive: #f75464;
     --border: #3c3f41;
     --input: #3c3f41;
     --ring: #548af7;
   }

   [data-theme="light"] {
     /* ── EXISTING tokens (kept until Phase 7) ── */
     --color-bg: #f5f5f5;
     --color-surface: #ffffff;
     --color-surface2: #eef0f3;
     --color-border: #d1d1d6;
     --color-accent: #3574f0;
     --color-accent2: #1a8a96;
     --color-green: #59a045;
     --color-red: #db5860;
     --color-text: #1e1f22;
     --color-muted: #6f737a;
     --color-warning: #c08b34;
     color-scheme: light;

     /* ── NEW shadcn/ui tokens (added alongside) ── */
     --background: #f5f5f5;
     --foreground: #1e1f22;
     --card: #ffffff;
     --card-foreground: #1e1f22;
     --popover: #ffffff;
     --popover-foreground: #1e1f22;
     --primary: #3574f0;
     --primary-foreground: #ffffff;
     --secondary: #eef0f3;
     --secondary-foreground: #1e1f22;
     --muted: #eef0f3;
     --muted-foreground: #6f737a;
     --accent: #1a8a96;
     --accent-foreground: #ffffff;
     --destructive: #db5860;
     --border: #d1d1d6;
     --input: #d1d1d6;
     --ring: #3574f0;
   }
   ```

5. **Verify dev server runs without errors:** `npm run dev`
6. **Test both themes** — toggle dark/light, confirm app looks identical to before.

**End state:** App looks identical. shadcn infrastructure ready. Both CSS var systems live side by side.

---

## Phase 2 — Migrate ApiKeyInput + LanguageSwitcher

**Goal:** Two isolated, low-coupling components migrated. App fully works.

### Steps

1. **Install shadcn components:**
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add input
   npx shadcn@latest add toggle-group
   ```

2. **`ApiKeyInput.tsx`**: Replace native `<input>` with `<Input>` from `~/components/ui/input`, replace `<button>` elements with `<Button variant="ghost">` and `<Button>`.

3. **`LanguageSwitcher.tsx`**: Replace the custom radio-button group with `<ToggleGroup type="single">` + `<ToggleGroupItem>` for RU/EN values. Keep existing `useLanguage()` hook integration unchanged.

4. **Verify**: API key input and language switcher work, theme switching works, rest of app unchanged.

**End state:** Two components use shadcn primitives. Rest of app unchanged.

---

## Phase 3 — Migrate Layout

**Goal:** Header uses shadcn Button and DropdownMenu for theme switcher. App fully works.

> The Layout header contains a **3-option theme dropdown** (dark/light/system with SVG icons), not a simple toggle button. This requires `DropdownMenu`, not just `Button`.

### Steps

1. **Install shadcn components:**
   ```bash
   npx shadcn@latest add dropdown-menu
   ```
   (`button` already installed from Phase 2)

2. **`Layout.tsx`**:
   - Replace theme switcher `<select>` or custom dropdown with `<DropdownMenu>` + `<DropdownMenuTrigger>` + `<DropdownMenuContent>` + `<DropdownMenuItem>` for each of dark/light/system options
   - Trigger button: `<Button variant="ghost" size="icon">` with current theme icon
   - Replace custom SVG icons with Lucide equivalents: `Moon`, `Sun`, `Monitor` from `lucide-react`
   - Keep `useTheme()` hook integration unchanged

3. **Verify**: Theme switching still works for all 3 options (dark/light/system), both languages work.

**End state:** Header theme switcher uses shadcn DropdownMenu. All functionality preserved.

---

## Phase 4 — Migrate TopicCard

**Goal:** Home page topic cards use shadcn Card, Button, Progress. App fully works.

### Steps

1. **Install shadcn components:**
   ```bash
   npx shadcn@latest add card
   npx shadcn@latest add progress
   ```
   (`button` already installed)

2. **`TopicCard.tsx`**:
   - Wrap in `<Card>` with `<CardHeader>`, `<CardContent>`, `<CardFooter>`
   - Replace manual gradient progress `<div>` with `<Progress value={score * 33.3}>`
   - Replace "Theory"/"Practice" link-divs with `<Button variant="outline" asChild>` and `<Button asChild>` wrapping `<Link>` (React Router)
   - Keep `--color-green` and `--color-warning` for progress gradient — these custom tokens stay

3. **Verify**: Home page cards render, links navigate to theory/practice, progress shows, star rating works (unchanged).

**End state:** Home page cards use shadcn. Theory and practice pages unchanged.

---

## Phase 5 — Migrate TheoryCard

**Goal:** Theory content sections use shadcn Card wrapper. App fully works.

### Steps

1. `Card` already installed from Phase 4.

2. **`TheoryCard.tsx`**: Wrap section in `<Card>` + `<CardHeader>` + `<CardContent>`. Keep `.prose-dark` class and all inner typography styles — shadcn/ui doesn't provide a prose system.

3. **Verify**: Theory pages render content, table of contents works, sticky CTA works, mobile collapsible TOC works.

**End state:** Theory sections use shadcn Card. `.prose-dark` CSS and syntax highlighting unchanged.

---

## Phase 6 — Migrate FlashCard + StepVisualizer

**Goal:** Practice and event-loop interactive components use shadcn primitives. App fully works.

### Steps

1. **Install shadcn components:**
   ```bash
   npx shadcn@latest add textarea
   npx shadcn@latest add badge
   ```
   (`card` and `button` already installed)

2. **`FlashCard.tsx`**:
   - Outer wrapper → `<Card>`
   - Answer input → `<Textarea>`
   - Submit / skip / next buttons → `<Button>` with appropriate variants (`default`, `outline`, `ghost`)
   - Category label → `<Badge variant="outline">`
   - Keep AI feedback score color logic (uses `--color-green`, `--color-warning`, `--color-red`)
   - Keep speech recognition mic button and animated recording indicator (custom logic, no shadcn equivalent)
   - Keep keyboard shortcut hints (custom)

3. **`StepVisualizer.tsx`**:
   - Step type tags (Sync/Microtask/Macrotask) → `<Badge>` with color variants
   - Keep the ordered list structure and step description text
   - Map step types to badge variants: Sync → `default`, Microtask → `secondary`, Macrotask → `outline`

4. **Verify**: Practice flow works (setup → playing → finished), event-loop quiz works (splash → quiz → results), AI evaluation works, speech recognition works, replay works.

**End state:** All interactive components migrated. App fully works. Old CSS vars still present.

---

## Phase 7 — Cleanup (remove old tokens)

**Goal:** Remove the dual CSS var system. Only shadcn naming remains.

**Prerequisite:** All phases above complete. No component references `var(--color-bg)`, `var(--color-surface)`, `var(--color-accent)`, etc.

### Steps

1. **Audit components for remaining `var(--color-*)` usage:**
   ```bash
   grep -r "var(--color-" app/components/ app/routes/
   ```
   Expected survivors: `--color-green`, `--color-warning`, `--color-accent2` (keep — no shadcn equivalent).

2. **Update any remaining `var(--color-*)` in components:**
   - `var(--color-bg)` → `bg-background` Tailwind utility (or `var(--background)`)
   - `var(--color-surface)` → `bg-card`
   - `var(--color-text)` → `text-foreground`
   - `var(--color-muted)` → `text-muted-foreground`
   - `var(--color-border)` → `border-border`
   - `var(--color-accent)` → `text-primary` or `bg-primary`
   - `var(--color-red)` → `text-destructive`
   - `var(--color-accent2)` → keep as `var(--color-accent2)` OR migrate to `var(--accent)`

3. **Remove old `@theme` entries** that are no longer needed:
   ```css
   /* Remove from @theme block: */
   --color-bg: initial;
   --color-surface: initial;
   --color-surface2: initial;
   --color-border: initial;  /* if fully migrated */
   --color-accent: initial;  /* if fully migrated */
   --color-text: initial;
   --color-muted: initial;   /* if fully migrated */
   /* Keep: --color-green, --color-warning, --color-accent2 */
   ```

4. **Remove old CSS var values** from `:root`/`[data-theme="light"]` (the `--color-bg: #181a1d;` etc. blocks). Keep `--color-green`, `--color-warning`, `--color-accent2`.

5. **Remove the base `@theme` block** (replaced by `@theme inline`) except retained tokens.

6. Run `npm run typecheck` — verify no TypeScript errors.

7. Verify both dark and light themes in browser. Verify all 4 routes work.

**End state:** Clean single CSS var system (shadcn naming). Custom tokens `--color-green`, `--color-warning`, `--color-accent2` retained.

---

## Components NOT migrated (kept custom)

| Component      | Reason                                                         |
|---------------|----------------------------------------------------------------|
| `StarRating`   | No shadcn equivalent; simple enough to stay custom            |
| `CodeBlock`    | Specialized syntax highlighting; shadcn adds nothing here     |

---

## File Impact by Phase

| Phase | Files Changed                                                                                          |
|-------|--------------------------------------------------------------------------------------------------------|
| 1     | `app/app.css`, `app/lib/utils.ts` (new), `package.json`, `components.json` (new)                     |
| 2     | `ui/button.tsx` (new), `ui/input.tsx` (new), `ui/toggle-group.tsx` (new), `ApiKeyInput.tsx`, `LanguageSwitcher.tsx` |
| 3     | `ui/dropdown-menu.tsx` (new), `Layout.tsx`                                                            |
| 4     | `ui/card.tsx` (new), `ui/progress.tsx` (new), `TopicCard.tsx`                                        |
| 5     | `TheoryCard.tsx`                                                                                       |
| 6     | `ui/textarea.tsx` (new), `ui/badge.tsx` (new), `FlashCard.tsx`, `StepVisualizer.tsx`                 |
| 7     | `app/app.css`, any remaining components with old var refs                                              |

---

## Risks & Notes

- **`@theme inline` conflicts**: The `@theme inline` block overrides the Tailwind utilities for `accent`, `muted`, and `border`. Before Phase 1, grep for `className` attributes using `bg-accent`, `text-muted`, `border-border` in existing components. If found, replace with direct CSS vars before applying the override.
- **`shadcn init` may overwrite `app.css`**: Review diff carefully after running init. Revert any auto-generated `:root` var blocks — use the additive structure from Phase 1 instead.
- **`asChild` prop on `Button` wrapping `<Link>`**: React Router's `<Link>` component works with Radix UI's `asChild` pattern. Use `<Button asChild><Link to="...">text</Link></Button>`.
- **SSR safety**: All Radix UI primitives are SSR-safe. No issues expected with React Router v7.
- **Theme system**: We use `[data-theme="light"]` as the light-mode override; shadcn defaults assume `.dark`. Resolved in Phase 1 by mapping shadcn vars under our `[data-theme="light"]` selector — no change to `root.tsx` needed.
- **`--radius`**: Set to `0.5rem` to match current component border-radius style.
- **`.prose-dark`**: Keep forever — shadcn/ui has no typography/prose system.
- **Speech recognition in FlashCard**: Custom browser API, fully independent of UI library — no migration needed.
