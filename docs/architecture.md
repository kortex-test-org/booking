# Architecture Documentation

## Overview
This project uses **Next.js 16 (App Router)** as the framework with **PocketBase** serving as the backend database and authentication provider.

## Routing (`src/app/`)
- `(auth)`: Route group for authentication flows (e.g., login, register).
- `admin`: Administrative tooling for managing time slots, services, and viewing all bookings.
- `api`: Next.js Route Handlers (likely used for backend validation, safe Stripe endpoints).
- `booking`: The main user booking flow interface.
- `dashboard`: The logged-in user dashboard (viewing personal bookings).
- `stripe-webhook`: Dedicated endpoint for external Stripe webhook events.

## Components Structure (Atomic Design)
Components are located in `src/components/`, strictly partitioned by scale:
- `ui/`: Atoms. Base, highly reusable primitives (mostly shadcn/ui elements like Buttons, Inputs).
- `molecules/`: Simple combinations of atoms (e.g., a form field wrapper with a label and input).
- `organisms/`: Complex, self-contained sections (e.g., Header, BookingForm, ServicesList).
- `templates/`: Page-level layouts that organisms slot into.

## Database & Data Layer (PocketBase)
The backend architecture is modeled via PocketBase collections.
- Main Collections: `users` (Auth), `services`, `time_slots`, `bookings`.
- Data is accessed securely via PocketBase API Rules using the `pocketbase` JS SDK, with Stripe payment IDs occasionally synced safely to the DB after Checkout.
