# Project Refactoring & Alignment Checklist

This checklist tracks the effort to align the existing codebase with the new Agent rules.

## Phase 1: Establish Lazy Context Documentation
- [x] Analyze the entire project (`src/`, `pocketbase_schema.md`, etc.).
- [x] Write `docs/architecture.md` (detailing Next.js routing, Atomic Design breakdown, PocketBase connection).
- [x] Write `docs/state.md` (detailing `@tanstack/react-query` usage, local state patterns).

## Phase 2: Alignment with Code-Style and Patterns Rules
- [x] Enforce TypeScript `import type` across `src/` (Rule: `general/code-style.md`).
- [x] Verify `src/components/` structural boundaries strictly adhere to Atomic Design rules without skipping levels.
- [x] Ensure all file names follow the `kebab-case` or Next.js predefined conventions.

## Phase 3: Cleanup and Tooling
- [x] Run `bun run lint` and `bun run format` (Biome) to conform to code-style formatting globally.
- [x] Address any identified typecheck errors (`bun run typecheck`).

---

## Phase 4: Refactoring — High Severity

- [x] **`any` types** — убрать все `: any` из `src/app/page.tsx` и `src/app/api/checkout/route.ts`. Заменить на тип `Booking` из `src/services/bookings.ts`.
- [x] **`catch (error: any)`** — убрать аннотацию типа из catch-блоков в `checkout/route.ts` и `stripe-webhook/route.ts`. В strict mode `unknown` — дефолт.
- [x] **Type assertions в env-переменных** — в `checkout/route.ts` и `stripe-webhook/route.ts` заменить `process.env.X as string` на явную проверку переменных при старте (guard + `throw`).
- [x] **Type assertions в коде** — убрать `params.serviceId as string`, `booking.status as BookingStatus`, `event.data.object as Stripe.Checkout.Session`, `record as {...}` — заменить на type guards или explicit checks.
- [x] **`dashboard/page.tsx`** — переписать data fetching: убрать `useState` + `useEffect` для загрузки bookings/services/time-slots. Заменить на три `useQuery` вызова из existing хуков в `src/queries/`.

## Phase 5: Refactoring — Medium Severity

- [x] **Magic strings** — создать `src/lib/constants.ts` с `BOOKING_STATUS = { PENDING: "pending", PAID: "paid", CANCELLED: "cancelled" } as const`. Заменить все хардкоды (~20+ мест) в `page.tsx`, `booking-card.tsx`, `time-slot-picker.tsx`, `route.ts`, `stripe-webhook/route.ts`, admin page.
- [x] **Barrel exports** — создать `index.ts` в: `src/components/molecules/`, `src/components/organisms/`, `src/components/templates/`, `src/services/`, `src/queries/`, `src/lib/`.
- [x] **`src/queries/` → `src/services/`** — добавлены `useUserBookings` и `useTimeSlotsBasic` в запросы. `query-client.tsx` оставить в `src/lib/`.
- [x] **Auth state → Zustand** — заменить `src/lib/auth-context.tsx` (React Context + useState + useEffect) на Zustand store. Store подписывается на `pb.authStore.onChange`.
- [x] **Props interfaces** — добавить именованные interface для props в: `auth-layout.tsx`, `dashboard-layout.tsx`, `main-layout.tsx`, `admin-sidebar.tsx` (NavLinks, MobileNavContent), AdminLayout.

## Phase 6: Refactoring — Low Severity

- [x] **Atomic Design coupling** — в `organisms/time-slot-picker.tsx` убрать прямой импорт `useTimeSlots`. Принимать слоты как props от страницы (данные fetchятся на уровне page и передаются вниз).
- [x] **Named exports в layout wrappers** — `src/app/booking/layout.tsx` и `src/app/dashboard/layout.tsx` обновлены с именованными interfaces для props.
