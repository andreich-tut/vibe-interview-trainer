# Plan: Remove Dead `@layer components` from app.css

**Date:** 2026-03-12
**Task:** Clean up app.css by removing unused CSS component classes

## Context

User asked why `app.css` is used so often given Tailwind + shadcn/ui. Investigation revealed:
- shadcn/ui is NOT installed
- The entire `@layer components` block (lines 257–347) defines classes that are **never used** in any `.tsx` file
- Components already use inline Tailwind utilities + CSS custom properties (`var(--color-*)`) directly

## Affected Classes (all dead code)

| Class | Status |
|-------|--------|
| `.btn-primary` / `.btn-primary:hover` / `.btn-primary:disabled` | Unused |
| `.btn-ghost` / `.btn-ghost:hover` | Unused |
| `.badge` / `.badge-easy` / `.badge-medium` / `.badge-hard` | Unused |
| `.progress-bar` / `.progress-fill` | Unused |
| `.feedback` / `.feedback.correct-fb` / `.feedback.wrong-fb` | Unused |

## What Stays in app.css (legitimate)

1. `@import "tailwindcss"` — required entry point
2. `@theme { ... }` — design token registration (Tailwind v4 API)
3. `:root` / `[data-theme]` blocks — theme color values
4. `@layer base` — global element resets, `.prose-dark`, syntax highlight tokens

## Steps

1. Delete `@layer components` block (lines 257–347) from `app.css`
2. Also delete the `@keyframes fadeIn` at the end (lines 349–358) — only used by `.feedback` which is being deleted

## Risk

Low — grep confirmed zero usages of these classes in the codebase.
