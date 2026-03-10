---
name: react-frontend-planner
description: Plan, scaffold, and develop small React frontend projects. Use this skill whenever a user wants to start a new React project, needs help with architecture decisions, wants to scaffold components, set up routing, state management, or build out features in a TypeScript/React stack. Trigger for phrases like "создай React проект", "помоги с архитектурой", "scaffold компонент", "new React app", "frontend project structure", or any time the user is building a self-contained React application from scratch or from early stages. Also trigger when the user asks about best practices for small React apps, wants a plan before coding, or asks "с чего начать" for a frontend project.
---

# React Frontend Planner

A skill for planning and scaffolding small, focused React projects. Guides LLM through a structured process: understand → plan → scaffold → build.

---

## Phase 1: Understand the Project

Before writing any code, ask (or infer from context):

1. **What does this app do?** — One sentence: the core user action.
2. **Who uses it?** — End-users, internal tool, developer demo?
3. **What's the data model?** — What entities exist? Where does data come from (API, local, mock)?
4. **Any constraints?** — Must use specific libraries? Needs auth? Mobile support?

If the user is in a hurry, proceed with reasonable defaults and flag assumptions.

---

## Phase 2: Tech Stack Decision

For small React projects, default to this stack unless the user specifies otherwise:

| Concern | Default | Alternatives |
|---|---|---|
| Bundler | **Vite** | CRA (legacy), Next.js (if SSR needed) |
| Language | **TypeScript** | JS (only if user insists) |
| Styling | **Tailwind CSS** | CSS Modules, styled-components |
| State | **useState / useReducer** | Zustand (if 3+ components share state), Jotai |
| Data fetching | **TanStack Query** | SWR, raw fetch |
| Routing | **React Router v6** | TanStack Router (if type-safety critical) |
| Forms | **React Hook Form** | Formik (heavier) |
| UI primitives | **shadcn/ui** | Radix UI, Headless UI |
| Testing | **Vitest + Testing Library** | Jest |

**Rule**: don't add a library unless it solves a real pain point in *this* project. Small projects stay small.

---

## Phase 3: Project Structure

Use this structure as a baseline. Adjust based on project size.

```
src/
├── components/        # Shared, reusable UI components
│   └── ui/            # shadcn/ui or primitives
├── features/          # Feature-based folders (preferred over type-based)
│   └── [feature]/
│       ├── components/
│       ├── hooks/
│       └── types.ts
├── hooks/             # Shared custom hooks
├── lib/               # Utils, helpers, config
├── pages/ (or routes/) # Top-level route components
├── services/          # API calls, data access
├── store/             # Global state (if needed)
├── types/             # Shared TypeScript types
└── main.tsx
```

**Avoid** `components/Button`, `components/Card`, `components/Modal` flat soup. Prefer feature-colocation.

---

## Phase 4: Component Planning

For each feature or page, plan components in this order:

### 1. Identify the "smart" container
- Owns state and data fetching
- Passes data down via props

### 2. List "dumb" presentational components
- Pure rendering, no business logic
- Accept typed props, emit typed callbacks

### 3. Define the data contract (types first)

```ts
// Define before implementing
interface User {
  id: string
  name: string
  email: string
}

interface UserCardProps {
  user: User
  onEdit: (id: string) => void
}
```

### 4. Sketch the component tree (text is fine)
```
<UserListPage>            ← fetches data, owns selection state
  <UserFilters />         ← controlled, emits filter changes up
  <UserList users={...}>
    <UserCard key={id} /> ← pure, dumb
  </UserList>
  <Pagination />          ← controlled
</UserListPage>
```

---

## Phase 5: State Management Guidance

| Situation | Solution |
|---|---|
| Local UI state (open/close, input value) | `useState` |
| Complex local state with transitions | `useReducer` |
| Shared across 2–3 sibling components | Lift state up to common parent |
| Shared across the whole app, rarely changes | React Context |
| Shared, frequently changing | Zustand |
| Server state (API data, caching) | TanStack Query |
| URL as state | `useSearchParams` (React Router) |

**Don't reach for Zustand/Redux on day one.** Most small apps need only `useState` + TanStack Query.

---

## Phase 6: Code Quality Defaults

Always apply these patterns:

### TypeScript
- No `any`. Use `unknown` + type narrowing when needed.
- Define prop types with interfaces, not inline.
- Prefer `type` for unions/aliases, `interface` for objects.

### React patterns
- Prefer function components + hooks.
- Extract logic into custom hooks (`useUsers`, `useAuth`).
- Keep components under ~150 lines. If longer — split.
- Avoid prop drilling beyond 2 levels — use context or composition.

### File conventions
- One component per file.
- Named exports for components (not default), except pages/routes.
- Co-locate styles, tests, and types with the component.

### Async/error handling
- Always handle loading and error states in UI.
- Use TanStack Query's `isLoading`, `isError`, `data` destructuring.
- Don't swallow errors silently.

---

## Phase 7: Scaffolding Output Format

When generating code, always produce in this order:

1. **Types** (`types.ts`) — data shapes first
2. **Service/API layer** (`services/`) — data access functions
3. **Custom hooks** — business logic separated from UI
4. **Components** — from leaf (dumb) to container (smart)
5. **Page/Route component** — wires everything together

Each file should:
- Have a clear single responsibility
- Be independently testable
- Include TypeScript types for all exports

---

## Quick Scaffolding Prompts

Use these as sub-prompts when the user wants specific pieces:

**New feature scaffold:**
> "Create the types, service layer, custom hook, and main component for [feature]. Use TanStack Query for data fetching, TypeScript strict mode, and Tailwind for styles."

**Component from design:**
> "Build a React component matching this UI: [description]. Use TypeScript, Tailwind. Make it accept props for data and callbacks. No hardcoded data."

**Hook extraction:**
> "Extract the business logic from this component into a custom hook. The hook should own [state X] and [side effect Y]."

---

## Red Flags to Watch For

Flag these patterns and suggest alternatives:

| Anti-pattern | Better approach |
|---|---|
| `useEffect` for data fetching | TanStack Query |
| Props drilling 3+ levels | Context or component composition |
| Giant 300+ line component | Split into feature sub-components |
| `any` type everywhere | Proper TypeScript interfaces |
| Business logic in JSX | Extract to custom hook |
| Direct DOM manipulation | React refs + state |
| `index.ts` barrel exports everywhere | Direct imports (avoids circular deps) |

---

## Output Checklist

Before finishing a planning session, confirm:

- [ ] Stack decisions documented
- [ ] Folder structure defined
- [ ] Key types/interfaces written
- [ ] Component tree sketched
- [ ] State ownership mapped
- [ ] Data fetching approach decided
- [ ] Error/loading states planned
