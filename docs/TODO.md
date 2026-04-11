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

- [ ] **`any` types** — убрать все `: any` из `src/app/page.tsx` (строки 10–11, 25) и `src/app/api/checkout/route.ts` (строки 87, 99, 103). Заменить на тип `Booking` из `src/services/bookings.ts`.
- [ ] **`catch (error: any)`** — убрать аннотацию типа из catch-блоков в `checkout/route.ts` (строка 154) и `stripe-webhook/route.ts` (строки 17, 88). В strict mode `unknown` — дефолт.
- [ ] **Type assertions в env-переменных** — в `checkout/route.ts` и `stripe-webhook/route.ts` заменить `process.env.X as string` на явную проверку переменных при старте (guard + `throw`).
- [ ] **Type assertions в коде** — убрать `params.serviceId as string`, `booking.status as BookingStatus`, `event.data.object as Stripe.Checkout.Session`, `record as {...}` — заменить на type guards или explicit checks.
- [ ] **`dashboard/page.tsx`** — переписать data fetching: убрать `useState` + `useEffect` для загрузки bookings/services/time-slots. Заменить на три `useQuery` вызова из existing хуков в `src/queries/`.

## Phase 5: Refactoring — Medium Severity

- [ ] **Magic strings** — создать `src/lib/constants.ts` с `BOOKING_STATUS = { PENDING: "pending", PAID: "paid", CANCELLED: "cancelled" } as const`. Заменить все хардкоды (~20+ мест) в `page.tsx`, `booking-card.tsx`, `time-slot-picker.tsx`, `route.ts`, `stripe-webhook/route.ts`, admin page.
- [ ] **Barrel exports** — создать `index.ts` в: `src/components/molecules/`, `src/components/organisms/`, `src/components/templates/`, `src/services/`, `src/queries/`, `src/lib/`.
- [ ] **`src/queries/` → `src/services/`** — переместить хуки TanStack Query (`bookings.ts`, `services.ts`, `time-slots.ts`, `users.ts`) в `src/services/` (collocated с сервисными функциями). Обновить все импорты. `query-client.tsx` оставить в `src/lib/`.
- [ ] **Auth state → Zustand** — заменить `src/lib/auth-context.tsx` (React Context + useState + useEffect) на Zustand store. Store подписывается на `pb.authStore.onChange`. Обновить все `useAuth()` вызовы.
- [ ] **Props interfaces** — добавить именованные interface для props в: `auth-layout.tsx`, `admin-sidebar.tsx` (NavLinks, MobileNavContent), `AdminLayout`, wrapper layouts.

## Phase 6: Refactoring — Low Severity

- [ ] **Atomic Design coupling** — в `organisms/time-slot-picker.tsx` убрать прямой импорт `useTimeSlots`. Принимать слоты как props от страницы (данные fetchятся на уровне page и передаются вниз).
- [ ] **Named exports в layout wrappers** — `src/app/booking/layout.tsx` и `src/app/dashboard/layout.tsx` можно сделать named exports (это не page.tsx, фреймворк не требует default).
