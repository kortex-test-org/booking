]633;E;body "$RULES_BASE/project.md";ebce9ced-6341-4444-83e7-b8be7066142b]633;C
# Project: Booking App

## Description

A booking application built with Next.js and PocketBase.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4 & shadcn/ui
- PocketBase & @tanstack/react-query
- TypeScript & Biome

## Architecture

- Atomic Design

## Custom conventions

- Always use bun and bunx instead of node, npm or npx commands.
- Always follow atomic design.
- For installing new packages use bun add command, never edit package.json file yourself to install packages.
- shadcn/ui components install to @/components/ui directory.
- All pages text on russian.
- All prices in euro.

---


# Code Style

## TypeScript

Enable `strict: true` in `tsconfig.json`. No exceptions.

### Forbidden patterns

```ts
// ❌ any
const data: any = fetchData()

// ❌ type assertion
const user = response as User

// ❌ non-null assertion
const name = user!.name
```

```ts
// ✅ explicit typing
const data: User = fetchData()

// ✅ explicit check
if (user) {
  const name = user.name
}

// ✅ optional chaining
const name = user?.name
```

### `interface` vs `type`

Use `interface` for object shapes:

```ts
interface UserProfile {
  id: number
  email: string
  createdAt: Date
}
```

Use `type` for transformations of existing types:

```ts
type PublicProfile = Omit<UserProfile, 'createdAt'>
type UserId = Pick<UserProfile, 'id'>
type NullableUser = UserProfile | null
```

### Type imports

Always use `import type` when importing purely for TypeScript types. This ensures bundlers drop the types cleanly. Use inline type imports when mixing types and values.

```ts
// ✅
import { getUser, type UserProfile } from "@repository/user"
import type { AppConfig } from "@shared/config"

// ❌
import { getUser, UserProfile } from "@repository/user"
import { AppConfig } from "@shared/config"
```

---

## Naming

All variables, parameters, and functions must have meaningful names. No single-letter abbreviations:

```ts
// ✅
users.forEach((user) => { ... })
array.map((item, index) => { ... })
fetch("url").catch((error) => { ... })

// ❌
users.forEach((u) => { ... })
array.map((x, i) => { ... })
fetch("url").catch((e) => { ... })
```

---

## Functions over classes

Write services, controllers, and repositories as files with exported functions:

```ts
// ✅ db/repository/user.ts
export const getUser = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id)
  })
}

// ❌ no need to wrap in a class
export class UserRepository {
  async getUser(id: number) { ... }
}
```

---

## Error handling

Use `.catch(() => null)` when you only need to handle absence — less nesting:

```ts
const user = await getUser(id).catch(() => null)

if (!user) {
  return { error: "User not found" }
}
```

Use `try/catch` when you need detailed handling or multiple operations:

```ts
try {
  await saveUser(profile)
  await sendWelcomeEmail(profile.email)
} catch (error) {
  logger.error(`Failed to register user: ${error}`)
  throw new Error("Registration failed")
}
```

---

## Constants and magic numbers

Never hardcode "magic numbers" or special string literals throughout the codebase. Extract them into a shared constants file, use `as const` objects, or declare them as variables at the top of the file.

```ts
// ❌
if (user.status === "pending") {
  setTimeout(retry, 5000)
}

// ✅
export const USER_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
} as const

const RETRY_DELAY_MS = 5000

if (user.status === USER_STATUS.PENDING) {
  setTimeout(retry, RETRY_DELAY_MS)
}
```

---

## Comments

Do not write comments — write readable code. If code needs explanation, rename variables and functions instead:

```ts
// ❌
const b = await getBan(id)
if (b) res.send(403)

// ✅ code explains itself
const activeBan = await getActiveBan(userId).catch(() => null)
if (activeBan) {
  return response.forbidden(activeBan.reason)
}
```

---

## Barrel exports

Every module and layer exports its public API through `index.ts`:

```ts
// modules/user/index.ts
export { createUser, updateUser } from "./user.service"
export type { UserProfile } from "./user.types"
```

Repositories (`db/repository/*`) are an exception — import them directly via path alias:

```ts
// ✅
import { getUser } from "@repository/user"

// ❌
import { getUser } from "../../db/repository/user"
```

---

## Path aliases

Always use path aliases instead of relative paths. Each alias points to a folder with an `index.ts`:

```ts
// ✅
import { Button } from "@shared/ui"
import { useAuth } from "@features/auth"

// ❌
import { Button } from "../../shared/ui"
import { useAuth } from "../features/auth"
```

---


# Git

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>
```

| Type | When to use |
|---|---|
| `feat` | New functionality |
| `fix` | Bug fix |
| `refactor` | Refactoring without behavior change |
| `chore` | Dependency updates, config changes |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |
| `perf` | Performance improvement |

Examples:

```
feat(auth): add JWT refresh token support
fix(user): handle null profile on first login
refactor(api): extract error handling to middleware
chore: update drizzle-orm to 0.31
```

Rules:
- Lowercase description
- No trailing period
- English only
- Describe *what* was done, not *how*

---

## Branches

```
main        — production, merge via PR only
dev         — main development branch
feat/<n>    — new feature
fix/<n>     — bug fix
chore/<n>   — technical tasks
```

Examples:

```
feat/user-auth
fix/login-redirect
chore/update-deps
```

---

## Pull Requests

- PR target is always `dev`, never `main`
- PR title follows the same format as commits: `feat(auth): add JWT refresh`
- One PR — one task
- Squash commits if there are more than three before merging

---


# Security

## Secrets and environment variables

Never hardcode secrets. Always use environment variables:

```ts
// ❌
const db = new Database("postgresql://user:password@localhost/mydb")

// ✅
const db = new Database(process.env.DATABASE_URL)
```

- Add `.env` to `.gitignore`
- Keep `.env.example` with all keys but no real values
- Validate required variables at startup:

```ts
// config.ts
const required = ["DATABASE_URL", "JWT_SECRET", "API_KEY"]

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env variable: ${key}`)
  }
}

export const config = {
  databaseUrl: process.env.DATABASE_URL!,
  jwtSecret: process.env.JWT_SECRET!,
}
```

---

## Input validation

Always validate data at the boundary — user input, external APIs, database results. Use [Valibot](https://valibot.dev/):

```ts
import * as v from "valibot"

const CreateUserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
  name: v.pipe(v.string(), v.minLength(1), v.maxLength(100)),
})

export const createUser = async (input: unknown) => {
  const data = v.parse(CreateUserSchema, input)
  // data is now typed and validated
}
```

---

## Dependencies

- Do not add dependencies without a clear reason
- Before installing a package check: weekly downloads, maintenance activity, last publish date
- Keep dependencies up to date: `bun update`
- Do not ignore `bun audit` warnings

---


# Testing

## Test runner

Use the built-in Bun test runner. No need for Jest or Vitest:

```ts
import { describe, it, expect, mock } from "bun:test"
```

---

## What to test

- **Services** — primary focus. All business logic must be covered
- **Repositories** — integration tests against a test database
- **Controllers** — not tested directly, covered through service tests

---

## Test structure

```ts
import { describe, it, expect, mock } from "bun:test"
import { createUser } from "./user.service"

describe("createUser", () => {
  it("creates a new user with hashed password", async () => {
    mock.module("@repository/user", () => ({
      getUserByEmail: mock(() => Promise.resolve(null)),
      insertUser: mock(() => Promise.resolve({ id: 1, email: "test@test.com" })),
    }))

    const result = await createUser({ email: "test@test.com", password: "password123" })

    expect(result.id).toBe(1)
    expect(result.email).toBe("test@test.com")
  })

  it("throws if email already exists", async () => {
    mock.module("@repository/user", () => ({
      getUserByEmail: mock(() => Promise.resolve({ id: 1, email: "test@test.com" })),
    }))

    expect(createUser({ email: "test@test.com", password: "password123" }))
      .rejects.toThrow("Email already in use")
  })
})
```

---

## Rules

- One `it` — one scenario
- Test names describe behavior, not implementation: `"throws if email already exists"` not `"test error case"`
- Test files live next to the file under test: `user.service.ts` → `user.service.test.ts`
- Test only the public API of a module, not internal implementation details

---


# Tooling

## Package manager

Use Bun as the package manager and runtime. Never edit `package.json` manually to add dependencies — always use `bun add` to get the latest versions:

```sh
# ✅ install dependency
bun add hono

# ✅ install dev dependency
bun add -d @types/bun

# ✅ install multiple
bun add valibot @tanstack/react-query zustand

# ❌ do not manually edit package.json to add packages
```

Other Bun commands:

```sh
bun install       # install all dependencies
bun update        # update dependencies
bun remove <pkg>  # remove a dependency
bun run <script>  # run a script from package.json
bun audit         # check for vulnerabilities
```

---

## Formatter and linter

Use [Biome](https://biomejs.dev/) for both formatting and linting. Do not use Prettier or ESLint:

```sh
bun add -d @biomejs/biome
bunx biome init
```

Minimal `biome.json`:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

Run:

```sh
bunx biome check .          # lint + format check
bunx biome check --write .  # lint + format fix
```

Add to CI and pre-commit — do not commit code that fails Biome checks.

---


# Scaffolding

Always use official scaffold commands to initialize projects. Never create folder structure, `package.json`, or config files manually.

---

## Monorepo

```sh
bunx create-turbo@latest
```

---

## Frontend

Next.js:

```sh
bunx create-next-app@latest
```

Vite + React:

```sh
bun create vite
# select React + TypeScript
```

Astro:

```sh
bunx create-astro@latest
```

---

## Backend

Elysia:

```sh
bunx @elysiajs/create@latest
```

---

## UI libraries

HeroUI (into existing project):

```sh
bun add @heroui/react framer-motion
```

shadcn/ui (into existing Next.js project):

```sh
bunx shadcn@latest init
```

Add individual shadcn components:

```sh
bunx shadcn@latest add button
bunx shadcn@latest add input dialog
```

---

## Drizzle

```sh
bun add drizzle-orm
bun add -d drizzle-kit
```

---

## Rules

- Always run scaffold commands first, then install additional dependencies with `bun add`
- Never manually write `package.json`, `tsconfig.json`, or framework config files from scratch — scaffold commands generate them correctly
- After scaffolding, extend `tsconfig.json` rather than replacing it

---


# Workflow and Planning

This document outlines how AI agents must organize their workflow to write safe, maintainable code without bloating the context window.

## 1. Task Planning (The `TODO.md` Rule)

Never jump straight into writing massive amounts of code.

- When starting a complex task, always create or update a `docs/TODO.md` file.
- Break down the task into small, verifiable steps using a markdown checklist (`[ ] step 1`).
- Execute one step at a time. After completing a step, check it off (`[x] step 1`) and verify the code compiles and works.
- If you encounter a roadblock, update the `TODO.md` to reflect the new direction or sub-steps.

## 2. Lazy Context (Avoiding Context Bloat)

Do not inject large architectural overviews or domain logic into persistent memory files like `.cursorrules` or `CLAUDE.md`. Instead, use "Lazy Loading" for context.

- Keep specific domain documentation in the `docs/` folder (e.g., `docs/auth.md`, `docs/database.md`, `docs/architecture/`).
- **Rule:** If you are about to work on a specific area (e.g., Authentication), you MUST first read the relevant file in `docs/` (e.g. `docs/auth.md`) using your file viewing tools to refresh your memory on the project's exact implementation.

## 3. Maintaining Documentation

The AI agent must keep documentation alive and truthful.
- Whenever you make architectural changes, add new environment variables, or change core domain logic, you MUST independently update the relevant files in the `docs/` directory to reflect the new reality.
- For completely new architectural decisions, briefly summarize them in `docs/adr/` (Architecture Decision Records) so future agents understand the "why" and do not repeat mistakes.

## 4. Commits

- Commit frequently. Tie each commit to a completed step from `docs/TODO.md`.

---


# React Components

## Component structure

One component per file. File name matches the component name in PascalCase:

```
UserCard.tsx
AuthForm.tsx
DashboardLayout.tsx
```

Always use named exports:

```tsx
// ✅
export const UserCard = ({ user }: UserCardProps) => {
  return <div>{user.name}</div>
}

// ❌
export default function UserCard() { ... }
```

---

## Props

Always define props as an interface:

```tsx
interface UserCardProps {
  user: UserProfile
  onSelect?: (id: number) => void
}

export const UserCard = ({ user, onSelect }: UserCardProps) => {
  ...
}
```

---

## UI libraries

If the project includes a UI library (HeroUI, shadcn/ui, etc.) — always use its components first before writing custom ones:

```tsx
// ✅ use library component
import { Button } from "@heroui/react"

// ❌ don't reimplement what the library already provides
const Button = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
)
```

Custom components are only built when the library does not cover the use case.

---

## Architecture

Choose one of the two patterns per project. Do not mix.

---

### Option A — Atomic Design

```
src/
├── components/
│   ├── ui/        # components from UI libraries (HeroUI, shadcn/ui)
│   ├── atoms/     # basic building blocks: Button, Input, Badge
│   ├── molecules/ # combinations of atoms: SearchField, UserAvatar
│   ├── organisms/ # complex sections: Header, UserTable, AuthForm
│   └── templates/ # page layouts without real data
├── views/         # pages — assemble organisms into screens
└── app/           # routing
```

Components from UI libraries (HeroUI, shadcn/ui) go into `components/ui/`, not into `atoms/`:

```tsx
// ✅ src/components/ui/button.tsx  — re-export or wrap library component
// ✅ src/components/atoms/Badge.tsx — your own atom
// ❌ src/components/atoms/Button.tsx — don't recreate library components
```

Import rule — components only import from the same level or below:

```
templates → organisms → molecules → atoms
```

API layer — all backend communication lives in `src/services/`:

```
src/
└── services/
    ├── api.ts       # base ky instance with baseURL, auth headers, error handling
    ├── user.ts      # getUser, updateUser, deleteUser
    └── auth.ts      # login, logout, refreshToken
```

**If backend is Elysia** — use [Eden Treaty](https://elysiajs.com/eden/treaty/overview) for full end-to-end type safety without codegen:

```ts
// services/api.ts
import { treaty } from "@elysiajs/eden"
import type { App } from "@server/index" // imported from monorepo workspace

export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL!)
```

```ts
// services/user.ts
import { api } from "./api"

export const getUser = async (id: number) => {
  const { data, error } = await api.users({ id }).get()
  if (error) throw error
  return data
}

export const updateUser = async (id: number, body: UpdateUserInput) => {
  const { data, error } = await api.users({ id }).patch(body)
  if (error) throw error
  return data
}
```

**If backend is not Elysia** — use [ky](https://github.com/sindresorhus/ky):

```ts
// services/api.ts
import ky from "ky"

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token")
        if (token) request.headers.set("Authorization", `Bearer ${token}`)
      },
    ],
  },
})

// services/user.ts
import { api } from "./api"
import type { UserProfile } from "@shared/types"

export const getUser = (id: number) =>
  api.get(`users/${id}`).json<UserProfile>()
```

TanStack Query hooks consume services directly:

```ts
import { useQuery } from "@tanstack/react-query"
import { getUser } from "@services/user"

export const useUser = (id: number) =>
  useQuery({ queryKey: ["user", id], queryFn: () => getUser(id) })
```

Path aliases:

```json
{
  "@ui/*":        "src/components/ui/*",
  "@atoms/*":     "src/components/atoms/*",
  "@molecules/*": "src/components/molecules/*",
  "@organisms/*": "src/components/organisms/*",
  "@templates/*": "src/components/templates/*",
  "@views/*":     "src/views/*",
  "@services/*":  "src/services/*"
}
```

---

### Option B — Feature-Sliced Design (FSD)

```
src/
├── app/       # routing (Next.js app router or ReactRouter routes.ts)
├── views/     # screens/pages — assemble widgets and features
├── widgets/   # self-contained UI blocks: Sidebar, Feed, CommentThread
├── features/  # user actions: add-to-cart, submit-review, toggle-theme
├── entities/  # business entities: user, product, order
└── shared/    # reusable primitives with no business logic
    ├── ui/    # UI components: Button, Modal, Input
    ├── lib/   # utilities and helpers
    ├── api/   # base API client
    └── types/ # global types
```

`views/` is used instead of `pages/` to avoid conflicts with Next.js routing conventions.

`app/` holds routing only:
- Next.js — app router directory
- React Router — `routes.ts` config file

**Import rule — each layer can only import from layers below it:**

```
app → views → widgets → features → entities → shared
```

```tsx
// ✅ features can import from entities
import { UserCard } from "@entities/user"

// ❌ entities cannot import from features
import { addToCart } from "@features/add-to-cart"
```

API layer — backend communication is split across layers by ownership:

```
shared/api/           # base ky instance, config, error handling
entities/user/api/    # getUser, updateUser — entity-level requests
features/auth/api/    # login, logout — feature-level requests
```

**If backend is Elysia** — use [Eden Treaty](https://elysiajs.com/eden/treaty/overview) in `shared/api/`:

```ts
// shared/api/client.ts
import { treaty } from "@elysiajs/eden"
import type { App } from "@server/index" // imported from monorepo workspace

export const api = treaty<App>(process.env.NEXT_PUBLIC_API_URL!)

// entities/user/api/index.ts
import { api } from "@shared/api/client"

export const getUser = async (id: number) => {
  const { data, error } = await api.users({ id }).get()
  if (error) throw error
  return data
}
```

**If backend is not Elysia** — use [ky](https://github.com/sindresorhus/ky):

```ts
// shared/api/client.ts
import ky from "ky"

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token")
        if (token) request.headers.set("Authorization", `Bearer ${token}`)
      },
    ],
  },
})

// entities/user/api/index.ts
import { api } from "@shared/api/client"
import type { UserProfile } from "../model/types"

export const getUser = (id: number) =>
  api.get(`users/${id}`).json<UserProfile>()
```

TanStack Query hooks live in `model/` of the same slice:

```ts
// entities/user/model/queries.ts
import { useQuery } from "@tanstack/react-query"
import { getUser } from "../api"

export const useUser = (id: number) =>
  useQuery({ queryKey: ["user", id], queryFn: () => getUser(id) })
```

Path aliases:

```json
{
  "@app/*":      "src/app/*",
  "@views/*":    "src/views/*",
  "@widgets/*":  "src/widgets/*",
  "@features/*": "src/features/*",
  "@entities/*": "src/entities/*",
  "@shared/*":   "src/shared/*"
}
```

Each slice has an `index.ts` that defines its public API. Never import from internal files of another slice:

```ts
// ✅
import { UserCard } from "@entities/user"

// ❌
import { UserCard } from "@entities/user/ui/UserCard"
```

---


# State Management

## Local state

Use `useState` and `useReducer` for component-level state. Do not reach for global state if the data is only needed in one component or a small subtree:

```tsx
const [isOpen, setIsOpen] = useState(false)
const [count, setCount] = useState(0)
```

Use `useReducer` when state has multiple sub-values or complex transitions:

```tsx
type State = { status: "idle" | "loading" | "error"; data: User | null }
type Action = { type: "fetch" } | { type: "success"; data: User } | { type: "error" }

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "fetch": return { ...state, status: "loading" }
    case "success": return { status: "idle", data: action.data }
    case "error": return { ...state, status: "error" }
  }
}
```

---

## Server state

Use [TanStack Query](https://tanstack.com/query) for all data fetching, caching, and synchronization with the server.

If the backend is Elysia, use [Eden Treaty](https://elysiajs.com/eden/treaty/overview) as the API client — it provides end-to-end type safety without codegen. Otherwise use [ky](https://github.com/sindresorhus/ky). Either way, wrap calls in TanStack Query:

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUser, updateUser } from "@services/user" // or @entities/user/api in FSD

// Fetching
const { data: user, isLoading } = useQuery({
  queryKey: ["user", userId],
  queryFn: () => getUser(userId), // getUser lives in services/ or entity api/
})

// Mutations
const queryClient = useQueryClient()

const { mutate: updateUser } = useMutation({
  mutationFn: (data: UpdateUserInput) => apiUpdateUser(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["user", userId] })
  },
})
```

Do not use `useEffect` + `useState` for data fetching — always use TanStack Query.

---

## Global client state

Use [Zustand](https://zustand.dev/) for global UI state that is not server data (modals, sidebar, user preferences, etc.):

```tsx
import { create } from "zustand"

interface UIStore {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
```

Keep stores small and focused. One store per domain, not one global store for everything.

Do not put server data into Zustand — that is TanStack Query's job.

---

## Forms

Use [TanStack Form](https://tanstack.com/form) for form state management. Validate with [Valibot](https://valibot.dev/):

```tsx
import { useForm } from "@tanstack/react-form"
import * as v from "valibot"

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
})

export const LoginForm = () => {
  const form = useForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onChange: ({ value }) => {
        const result = v.safeParse(LoginSchema, value)
        if (!result.success) return result.issues[0].message
      },
    },
    onSubmit: async ({ value }) => {
      await login(value)
    },
  })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <form.Field name="email">
        {(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
    </form>
  )
}
```

---

## Decision guide

| Data type | Tool |
|---|---|
| Component-local UI state | `useState` / `useReducer` |
| Server data (fetch, cache, sync) | TanStack Query |
| Global UI state (modals, prefs) | Zustand |
| Form state | TanStack Form + Valibot |

---


# Next.js

## React Server Components (RSC)

All Next.js (App Router) components are Server Components by default. 

- Keep components as Server Components whenever possible.
- Use the `"use client"` directive only when necessary (e.g., when you need `useState`, `useEffect`, event listeners, or browser APIs).
- Push `"use client"` as far down the component tree as possible. Only add it to the specific "leaf" component that needs interactivity (like a button, input, or complex form), leaving the parent layouts and pages as Server Components.

### Data Fetching and Interactivity

- Fetch initial data on the server in Server Components.
- For mutations, prefer using TanStack Query along with standard REST endpoints. Server Actions should generally be avoided for complex client state logic.
- Pass fetched data to Client Components as props or use TanStack Query `initialData` for hydration.

---

## Rendering Strategies

Choose the right rendering strategy for pages:

### Static Site Generation (SSG)

Use Static Generation for pages where data does not change frequently.
- If you have dynamic routes (e.g., pages with translations or blog posts), use `generateStaticParams` to build these pages at compile time.

### Incremental Static Regeneration (ISR)

If data is updated periodically from the server and doesn't need to be strictly real-time, use ISR (`revalidate`).
- Allows you to update static pages in the background without a full rebuild.

### Decision making

When building a new page or feature, always evaluate which rendering strategy (Static, ISR, or Dynamic) is best. If there isn't a single obvious choice, suggest multiple options to the team and ask for their preference.

