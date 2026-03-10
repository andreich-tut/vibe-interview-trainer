# Deployment Plan — Vercel

## Strategy

Switch React Router v7 from SSR to **SPA mode** (`ssr: false`).

**Why SPA?** All data is static TypeScript imports — no loaders, no server DB, no API calls.
SPA mode produces a pure static build → zero serverless functions, free Vercel tier, simpler setup.

## Changes

### 1. `vibe-interview-app/react-router.config.ts`
Set `ssr: false` to enable SPA mode.

### 2. `vibe-interview-app/vercel.json`
- `outputDirectory`: `build/client` (SPA build output)
- `buildCommand`: `npm run build`
- Rewrite all routes to `index.html` so client-side routing works on direct URL access / refresh

## Steps

- [x] Create DEPLOY.md
- [x] Set `ssr: false` in `react-router.config.ts`
- [x] Add `vercel.json` with rewrites
- [x] Run `npm run build` — verify build passes ✓
- [ ] Push repo to GitHub
- [ ] Import project on vercel.com:
  - Root Directory → `vibe-interview-app`
  - Build/output settings are read from `vercel.json` automatically
- [ ] Deploy

## Vercel Dashboard Settings

| Setting | Value |
|---|---|
| Root Directory | `vibe-interview-app` |
| Framework Preset | Vite (or Other — vercel.json overrides it) |
| Build Command | `npm run build` |
| Output Directory | `build/client` |

No environment variables required.
