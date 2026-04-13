# Booking App — Projekti Dokumentatsioon

> Veebipõhine teenuste broneerimisrakendus koos online-maksetega

---

## Sisukord

1. [Projekti ülevaade](#1-projekti-ülevaade)
2. [Tehnoloogiad](#2-tehnoloogiad)
3. [Arhitektuur](#3-arhitektuur)
4. [Andmebaasi struktuur](#4-andmebaasi-struktuur)
5. [Autentimine](#5-autentimine)
6. [Broneerimise voog](#6-broneerimise-voog)
7. [Maksete töötlemine](#7-maksete-töötlemine)
8. [Administraatori paneel](#8-administraatori-paneel)
9. [Kasutaja dashboard](#9-kasutaja-dashboard)
10. [Rakenduse käivitamine](#10-rakenduse-käivitamine)
11. [Keskkonna muutujad](#11-keskkonna-muutujad)

---

## 1. Projekti ülevaade

**Booking App** on täisfunktsionaalne teenuste broneerimisplatvorm, mis võimaldab:

- **Kasutajatel** — sirvida saadaolevaid teenuseid, valida sobiv aeg, maksta online ja hallata oma broneeringuid
- **Administraatoritel** — lisada/muuta teenuseid, luua ajaslotte, vaadata kõiki broneeringuid ja statistikat

Rakendus on üles ehitatud **Next.js 16** baasil koos **PocketBase** taustasüsteemiga ja **Stripe** maksete töötlemisega.

---

## 2. Tehnoloogiad

| Kiht | Tehnoloogia | Eesmärk |
|---|---|---|
| Frontend raamistik | **Next.js 16** (App Router) | SSR/SSG lehekülgede genereerimine, marsruutimine |
| UI teek | **React 19** | Kasutajaliidese komponentide ehitamine |
| Stiilid | **Tailwind CSS v4** + **shadcn/ui** | Visuaalne disain ja valmiskomponendid |
| Taustasüsteem | **PocketBase** | Andmebaas, autentimine, REST API |
| Server-state | **TanStack React Query** | Andmete pärimine, vahemälu haldus |
| Klient-state | **Zustand** | Globaalne autentimise olek |
| Maksed | **Stripe Checkout** | Online-maksete töötlemine |
| Tüübisüsteem | **TypeScript** (strict mode) | Staatilise tüübi kontroll |
| Ehitusvahend | **Vite** (vinext) + **Bun** | Arendus- ja tootmisserver |
| Linter/Formatter | **Biome** | Koodi kvaliteet ja konsistentsus |

---

## 3. Arhitektuur

### 3.1 Kaustade struktuur

Rakendus järgib **Atomic Design** põhimõtet komponentide organiseerimisel:

```
src/
├── app/                    # Next.js App Router — marsruutimine
│   ├── (auth)/             # Sisselogimine ja registreerimine
│   ├── admin/              # Administraatori paneel
│   ├── booking/            # Broneerimise voog
│   ├── dashboard/          # Kasutaja isiklik ala
│   ├── api/checkout/       # Stripe Checkout sessiooni loomine
│   └── stripe-webhook/     # Stripe sündmuste vastuvõtmine
│
├── components/             # UI komponendid (Atomic Design)
│   ├── ui/                 # Alustaseme üksused (shadcn/ui)
│   ├── atoms/              # Algkomponendid (ThemeToggle, ThemeProvider)
│   ├── molecules/          # Kombineeritud komponendid (ServiceCard, BookingCard)
│   ├── organisms/          # Keerulised plokid (Header, TimeSlotPicker)
│   └── templates/          # Lehekülje paigutused (MainLayout, DashboardLayout)
│
├── queries/                # TanStack Query hooks
│   ├── bookings.ts         # Broneeringute päringud ja mutatsioonid
│   ├── services.ts         # Teenuste päringud
│   ├── time-slots.ts       # Ajaslottide päringud
│   └── users.ts            # Kasutajate päringud
│
├── services/               # PocketBase API kliendid
│   ├── pb.ts               # PocketBase instantsid (kasutaja + admin)
│   ├── auth.ts             # Autentimise funktsioonid
│   ├── bookings.ts         # Broneeringute CRUD
│   ├── services.ts         # Teenuste CRUD
│   └── time-slots.ts       # Ajaslottide CRUD
│
└── lib/                    # Ühised utiliidid
    ├── auth-context.tsx    # Autentimise React Context
    ├── auth-store.ts       # Zustand store autentimise oleku jaoks
    └── constants.ts        # Globaalsed konstandid
```

### 3.2 Renderdamisstrateegia

- **Avaleht** (`/`) — `force-dynamic` SSR: teenused ja ajaslotid päritakse iga külastuse korral serverist, et kuvada reaalajas saadavust
- **Broneerimisleht** (`/booking/[serviceId]`) — Kliendipoolne komponent (`"use client"`), mis kasutab TanStack Query hooks
- **Admin paneel** — Täielikult kliendipoolne, kuna vajab rikkalikku interaktiivsust
- **Staatilised lehed** (login, register, success, cancel) — Serveri komponendid

---

## 4. Andmebaasi struktuur

PocketBase hallab nelja põhikollektsiooni:

### `users` — Kasutajad
Sisseehitatud PocketBase Auth kollektsioon. Haldab registreerimist, sisselogimist ja JWT-tokeneid.

### `services` — Teenused
| Väli | Tüüp | Kirjeldus |
|---|---|---|
| `name` | Text | Teenuse nimetus |
| `description` | Text | Lühikirjeldus |
| `price` | Number | Hind eurodes (€) |
| `duration_minutes` | Number | Teenuse kestus minutites |

### `time_slots` — Ajaslotid
| Väli | Tüüp | Kirjeldus |
|---|---|---|
| `service` | Relation → services | Millise teenuse juurde slot kuulub |
| `date` | Text (YYYY-MM-DD) | Kuupäev |
| `time` | Text (HH:MM) | Kellaaeg |

### `bookings` — Broneeringud
| Väli | Tüüp | Kirjeldus |
|---|---|---|
| `user` | Relation → users | Kes broneeris |
| `service` | Relation → services | Millist teenust broneeriti |
| `time_slot` | Relation → time_slots | Millise sloti peale |
| `status` | Select | `pending` / `paid` / `cancelled` |
| `stripe_payment_id` | Text | Stripe makse identifikaator |

### Seoste diagramm

```
users ──────────────────┐
                        ▼
services ──── time_slots ──── bookings
    │                              │
    └──────────────────────────────┘
```

### Ajasloti vaba/hõivatu loogikat

Slot loetakse **hõivatuks**, kui sellega seotud broneeringute hulgas on vähemalt üks staatusega `pending` või `paid`. Tühistatud (`cancelled`) broneeringud ei loe slotti hõivatuks.

---

## 5. Autentimine

Rakenduses on **kaks eraldi autentimise voogu**:

### 5.1 Kasutaja autentimine

```
Registreerimine/Sisselogimine
        ↓
PocketBase JWT token
        ↓
Zustand store (useAuthStore)
        ↓
React Context (useAuth hook)
        ↓
Kõik kaitstud komponendid
```

- Token salvestatakse PocketBase SDK authStore'i, mille Zustand jälgib
- `useAuth()` hook pakub `user`, `isAuthenticated` ja teisi autentimise andmeid kõikjal rakenduses
- Automaatne ümberpõöramine sisselogimislehele, kui kasutaja pole autentitud

### 5.2 Administraatori autentimine

Administraator logib sisse eraldi lehe (`/admin/login`) kaudu, kasutades PocketBase superuser kontot (`_superusers` kollektsioon). Admin sessiooni jälgitakse samas Zustand stores, kuid eraldi väljadel (`adminRecord`, `isAdminValid`).

### 5.3 API-taseme autentimine (Checkout)

Kassalehe API (`/api/checkout`) nõuab autentimist kahel viisil:
1. **Bearer token** `Authorization` päises (esmane variant)
2. **Cookie** `pb_auth` (fallback)

Mõlemal juhul valideeritakse kasutaja identiteet enne Stripe sessiooni loomist.

---

## 6. Broneerimise voog

```
Avaleht (/)
    │
    ▼ Kasutaja klõpsab "Broneerida"
Broneerimisleht (/booking/[serviceId])
    │
    ├── Päritakse teenuse andmed
    ├── Päritakse tulevased ajaslotid
    │
    ▼ Kasutaja valib kuupäeva kalenderist
TimeSlotPicker
    │
    ▼ Kasutaja valib konkreetse kellaaja
Tellimuse kokkuvõte (OrderSummary)
    │
    ▼ Kasutaja klõpsab "Maksa"
POST /api/checkout
    │
    ├── Kontrollitakse autentimist
    ├── Kontrollitakse, et slot pole hõivatud
    ├── Luuakse broneering staatusega "pending"
    ├── Luuakse Stripe Checkout sessioon
    │
    ▼
Stripe Checkout lehekülg (stripe.com)
    │
    ├── [Edu] → /booking/success
    └── [Tühistamine] → /booking/cancel
```

### Sloti saadavuse kontroll

Enne Stripe sessiooni loomist kontrollitakse serveris, et valitud slotil poleks juba aktiivseid broneeringuid (`pending` või `paid`). See väldib topeltbroneeringuid.

---

## 7. Maksete töötlemine

Stripe integratsiooni tööpõhimõte:

```
Kasutaja → /api/checkout ──→ Stripe Checkout sessioon loodud
                                    │
                                    ▼
                        Kasutaja maksab Stripe lehel
                                    │
                                    ▼
                    Stripe saadab webhook → /stripe-webhook
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            Signatuuri       Metadata         PocketBase
            verificatsioon   lugemine         uuendamine
                                         (status → "paid")
```

### Webhook turvalisus

Stripe webhook kasutab **kriptograafilist signatuuri** (`stripe-signature` päis), mida valideeritakse `STRIPE_WEBHOOK_SECRET` võtmega. Ilma kehtiva signatuurita tagastatakse `400 Bad Request`. See välistab võltsitud webhook-päringud.

### Oleku haldus

| Sündmus | Broneering |
|---|---|
| Checkout sessioon avatud | `pending` |
| Makse õnnestus (`checkout.session.completed`) | `paid` |
| Kasutaja tühistas | broneering jääb `pending` (käsitsi tühistatav) |
| Admin tühistab | `cancelled` |

---

## 8. Administraatori paneel

Kättesaadav aadressil `/admin`. Nõuab eraldi admin sisselogimist.

### 8.1 Broneeringute haldus (`/admin`)

- Tabel kõigi broneeringutega koos filtreerimisega
- Broneering staatuse muutmine (pending → paid → cancelled)
- Broneeringu kustutamine
- Ajaslottide loomine ja kustutamine (kuupäev + kellaaeg)

### 8.2 Teenuste haldus (`/admin/services`)

- Kõigi teenuste loetelu tabelis
- Teenuse lisamine (nimi, kirjeldus, hind, kestus)
- Teenuse redigeerimine modaalaknas
- Teenuse kustutamine

### 8.3 Statistika (`/admin/statistics`)

- Interaktiivsed graafikud Recharts teeki kasutades
- Filtreerimine perioodi järgi: päev / nädal / kuu / aasta
- Broneeringute arvu trend (AreaChart)
- Tulud teenuste kaupa (BarChart)
- Filtreerimine suuna järgi: mineviku või tuleviku andmed

---

## 9. Kasutaja dashboard

Kättesaadav aadressil `/dashboard` pärast sisselogimist.

- Kõigi kasutaja broneeringute nimekiri
- Broneeringu üksikasiad: teenus, kuupäev, kellaaeg, hind, staatus
- Tühistamise võimalus (staatuse muutmine `cancelled`-ks)
- Profiili seaded (`/dashboard/settings`): nime ja parooli muutmine

---

## 10. Rakenduse käivitamine

### Eeltingimused

- [Bun](https://bun.sh/) ≥ 1.0
- Töötav PocketBase instants (lokaalne või pilv)
- Stripe konto (test- või live-võtmed)

### Arenduskeskkond

```sh
# Sõltuvuste installimine
bun install

# Arendusserveri käivitamine
bun dev
# Rakendus avatud: http://localhost:3000
```

### Tootmise ehitamine

```sh
bun build
bun start
```

### Docker

```sh
docker build -t booking-app .
docker run -p 3000:3000 --env-file .env.local booking-app
```

---

## 11. Keskkonna muutujad

Koopeerida `example.env.local` failist `.env.local`:

| Muutuja | Kirjeldus | Näide |
|---|---|---|
| `NEXT_PUBLIC_POCKETBASE_URL` | PocketBase serveri aadress | `http://localhost:8090` |
| `STRIPE_SECRET_KEY` | Stripe salajane võti | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe avalik võti | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signatuuri saladus | `whsec_...` |
| `POCKETBASE_ADMIN_EMAIL` | PocketBase admin e-post (webhook jaoks) | `admin@example.com` |
| `POCKETBASE_ADMIN_PASSWORD` | PocketBase admin parool | `supersecret` |
| `NEXT_PUBLIC_APP_URL` | Rakenduse avalik URL (Stripe redirect) | `http://localhost:3000` |

> **Oluline:** `.env.local` faili ei tohi kunagi lisada versioonihaldusesse (git). See sisaldab tundlikku informatsiooni.

---

## Andmevoo kokkuvõte

```
Kasutaja brauser
      │
      │  HTTPS
      ▼
Next.js rakendus (Vercel / Docker)
      │
      ├─── Staatilised lehed (SSR/SSG) ──→ PocketBase REST API
      │
      ├─── /api/checkout ──────────────→ PocketBase (broneering)
      │                   └──────────→ Stripe API (sessioon)
      │
      └─── /stripe-webhook ───────────→ PocketBase (staatuse uuendus)
                            ↑
                        Stripe serverid
```
