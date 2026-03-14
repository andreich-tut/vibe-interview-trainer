# SVG → SVGR Migration Plan

## Task
Replace inline SVG JSX in components with imported SVG React components via `vite-plugin-svgr`.

## Motivation
Inline SVGs in components are noisy and hard to maintain. Moving them to `.svg` files and importing via SVGR:
- Keeps component files clean
- Allows SVG files to be edited/optimized independently
- Enables reuse across components

## Files Affected

| File | SVGs | Action |
|------|------|--------|
| `app/components/TopicIcon.tsx` | 9 topic icons + 1 default | Extract each to `app/assets/icons/` |
| `app/components/Layout.tsx` | 1 brain/circuit logo | Extract to `app/assets/icons/logo.svg` |
| `app/components/FlashCard/CardAnswerInput.tsx` | 2 mic icons (stop/mic) | Extract to `app/assets/icons/` |

## SVG Files to Create

```
app/assets/icons/
  topic-javascript.svg
  topic-react.svg
  topic-typescript.svg
  topic-css.svg
  topic-nodejs.svg
  topic-testing.svg
  topic-algorithms.svg
  topic-event-loop.svg
  topic-default.svg
  logo-brain.svg
  mic-stop.svg
  mic.svg
```

## Steps

1. Install `vite-plugin-svgr`
2. Add `svgr()` to `vite.config.ts` plugins (before reactRouter)
3. Add `/// <reference types="vite-plugin-svgr/client" />` to `vite-env.d.ts` or create one
4. Extract each SVG to its file — strip JSX-specific attrs (camelCase → kebab-case, remove curly braces)
5. Update `TopicIcon.tsx` — import each SVG as `ReactComponent`, render with `className` prop
6. Update `Layout.tsx` — import logo SVG, replace inline `<svg>` block
7. Update `CardAnswerInput.tsx` — import stop/mic SVGs, render conditionally

## SVG File Format Note
SVGR imports SVGs as React components when using `?react` suffix:
```ts
import LogoIcon from "~/assets/icons/logo-brain.svg?react";
```
The SVG file itself uses standard SVG attributes (kebab-case), not JSX attrs.
`currentColor` references work because SVGR passes through the SVG as-is.
`className` on the imported component sets the `class` on the `<svg>` element.
