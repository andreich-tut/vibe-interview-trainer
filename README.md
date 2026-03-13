# Interview Prep — React/Frontend

An fully vibecoded interactive interview preparation app for React and frontend developer positions. Covers 7 topic areas with flashcards, theory, practice mode, and an event loop visualizer. Supports Russian and English.

## Features

- **Flashcard System** — Question/answer cards for rapid self-testing
- **Theory Mode** — Structured explanations per topic
- **Practice Mode** — Simulated interview with LLM-based answer evaluation
- **Voice Input** — Speech-to-text for submitting answers
- **Event Loop Trainer** — Visual step-through of the JavaScript event loop
- **Bilingual** — Full Russian/English support with cookie-persisted language preference
- **Dark/Light Theme** — Theme toggle with cookie persistence
- **Progress Tracking** — Tracks completion per topic

## Topics

JavaScript · React · Next.js · Node.js · CSS · CI/CD · Testing

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Router v7 (framework mode, SSR) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS v4 |
| Build | Vite 7 |
| Components | Radix UI primitives + custom UI layer |
| Icons | Lucide React |
| Testing | Playwright (E2E) |

## Project Structure

```
interview-cloude/
├── vibe-interview-app/   # Main React application
├── reference/
│   ├── event-loop-trainer.html   # Standalone event loop tool
│   └── questions/                # Raw interview question banks (.txt)
├── planning/             # Per-session task plans
└── CLAUDE.md             # Project rules & architecture guide
```

### App Structure

```
vibe-interview-app/app/
├── routes/               # Home, topic theory, practice, event loop
├── components/           # UI primitives + feature components
├── contexts/             # LanguageContext (RU/EN)
├── hooks/                # useTranslation, useTheme, useProgress, useSpeechRecognition
├── lib/                  # i18n, cookies, LLM integration, content loader
└── data/                 # Flashcard and theory content (JSON)
```

Content is served from `public/content/{lang}/` — separate JSON files per language for UI strings, topics, cards, and theory.

## Getting Started

```bash
cd vibe-interview-app
npm install
npm run dev       # http://localhost:5173
```

### Other Commands

```bash
npm run build       # Production build
npm run start       # Serve production build (port 3000)
npm run typecheck   # React Router typegen + tsc
npm run lint        # ESLint
npm run format      # Prettier
```

## LLM Answer Evaluation

Practice mode can evaluate answers using an LLM. Enter your OpenAI API key in the app — it is stored locally in the browser and never sent to any server other than the LLM provider.

## E2E Tests

```bash
cd vibe-interview-app
npx playwright test
```

Tests cover: home page, practice flow, and API key input.
