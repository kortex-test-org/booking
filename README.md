# Booking App

A full-stack service booking platform with online payments, built with Next.js and PocketBase.

## Features

- Browse available services with real-time slot availability
- Select a date and time slot via an interactive calendar
- Secure online payments via Stripe Checkout
- Personal dashboard to view and cancel bookings
- Admin panel to manage services, time slots, and view statistics

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Backend | PocketBase (database + auth + REST API) |
| Payments | Stripe Checkout |
| Server state | TanStack React Query |
| Client state | Zustand |
| Language | TypeScript (strict) |
| Runtime / Package manager | Bun |
| Linter / Formatter | Biome |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) ≥ 1.0
- A running PocketBase instance
- A Stripe account (test or live keys)

### Installation

```bash
bun install
```

### Environment variables

Copy `example.env.local` to `.env.local` and fill in the values:

```bash
cp example.env.local .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_POCKETBASE_URL` | PocketBase server URL |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_...`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (`pk_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `POCKETBASE_ADMIN_EMAIL` | PocketBase superuser email (used by webhook) |
| `POCKETBASE_ADMIN_PASSWORD` | PocketBase superuser password |

### Run in development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
bun build
bun start
```

### Docker

```bash
docker build -t booking-app .
docker run -p 3000:3000 --env-file .env.local booking-app
```

## Project Structure

```
src/
├── app/              # Next.js App Router (pages and API routes)
├── components/       # UI components following Atomic Design
│   ├── ui/           # shadcn/ui primitives
│   ├── atoms/        # Basic building blocks
│   ├── molecules/    # Composed components (ServiceCard, BookingCard)
│   ├── organisms/    # Complex sections (Header, TimeSlotPicker)
│   └── templates/    # Page layouts
├── queries/          # TanStack Query hooks
├── services/         # PocketBase API client functions
└── lib/              # Shared utilities, constants, auth context
```

## Database Schema

Four PocketBase collections:

- **`users`** — built-in PocketBase Auth
- **`services`** — name, description, price (€), duration (minutes)
- **`time_slots`** — date, time, relation to service
- **`bookings`** — user, service, time slot, status (`pending` / `paid` / `cancelled`), Stripe payment ID

## Booking Flow

1. User browses services on the home page
2. Selects a service → picks a date and time slot
3. Clicks "Pay" → server creates a `pending` booking and opens a Stripe Checkout session
4. User completes payment on Stripe
5. Stripe sends a webhook → server verifies the signature → booking status updated to `paid`

## Stripe Webhook

The `/stripe-webhook` endpoint verifies each incoming request using a cryptographic signature (`stripe-signature` header + `STRIPE_WEBHOOK_SECRET`). Requests without a valid signature are rejected with `400`.

## Scripts

```bash
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run Biome linter
bun format       # Run Biome formatter
bun typecheck    # Run TypeScript type check
```
