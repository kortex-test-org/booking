# State Management

## Server/Remote State
The application predominantly delegates remote state to **TanStack React Query** (`@tanstack/react-query`).
- Custom hooks encapsulating PocketBase queries reside in `src/queries/` (`bookings.ts`, `services.ts`, `time-slots.ts`, `users.ts`).
- React Query handles caching, background fetching, and intelligent cache invalidation.

## Local State
Component-level state relies exclusively on React's standard hooks (`useState`, `useReducer`). There are no global stores (e.g., Zustand or Redux) installed. Complex form state is likely handled locally or coupled with React Query mutations.

## Context Providers
Application boundaries use Context via `<Providers>` exported from `src/queries/query-client.tsx`, which wraps the root layout (`src/app/layout.tsx`) to inject the `QueryClientProvider` and enable global data fetching.
