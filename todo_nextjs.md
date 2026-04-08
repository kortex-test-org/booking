# Next.js — Система бронирования

## Инициализация проекта

- [ ] Создать GitHub репозиторий, добавить всех как collaborators
- [ ] Инициализировать Next.js проект:
  ```bash
  npx create-next-app@latest booking-app --typescript --tailwind --app
  ```
- [ ] Установить зависимости:
  ```bash
  npm install pocketbase @stripe/stripe-js stripe
  ```
- [ ] Настроить `.gitignore` — убедиться, что `.env.local` в списке
- [ ] Создать `.env.local`:
  ```
  NEXT_PUBLIC_POCKETBASE_URL=https://pb.your-domain.com
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  ```
- [ ] Создать `.env.example` (без значений!) и закоммитить его

---

## PocketBase клиент и авторизация

- [ ] Создать PocketBase singleton `/lib/pocketbase.ts`:
  ```typescript
  import PocketBase from 'pocketbase';
  export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  ```
- [ ] Создать контекст авторизации `/lib/auth-context.tsx`
- [ ] Страница `/login` — вход через email/пароль
- [ ] Страница `/register` — регистрация нового пользователя
- [ ] Middleware для защиты приватных маршрутов (`/dashboard`, `/admin`)

---

## Страницы

- [ ] `/` — главная, список услуг из PocketBase
- [ ] `/booking/[serviceId]` — выбор доступного времени для услуги, при клике → переход к оплате
- [ ] `/dashboard` — личный кабинет, список своих бронирований со статусами
- [ ] `/admin` — только для admin: все бронирования, управление `time_slots`
- [ ] `/booking/success` — страница успешной оплаты
- [ ] `/booking/cancel` — страница отменённой оплаты

---

## Компоненты

- [ ] `ServiceCard` — карточка услуги с ценой и длительностью
- [ ] `TimeSlotPicker` — сетка доступного времени
- [ ] `BookingCard` — карточка бронирования в дашборде
- [ ] Loading состояния для всех запросов к API
- [ ] Пустые состояния ("У вас нет бронирований")

---

## Stripe интеграция

- [ ] API route `/app/api/stripe/create-checkout/route.ts` — создать Checkout Session, сохранить `bookingId` в metadata
- [ ] API route `/app/api/stripe/webhook/route.ts` — верифицировать подпись, при `checkout.session.completed` обновить статус бронирования в PocketBase на `paid`
- [ ] Протестировать с картой `4242 4242 4242 4242`

---

## Деплой в Coolify

- [ ] Создать `Dockerfile`:
  ```dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build
  EXPOSE 3000
  CMD ["npm", "start"]
  ```
- [ ] Подключить GitHub репозиторий к Coolify
- [ ] Добавить все ENV переменные в Coolify UI
- [ ] Настроить автоматический деплой при push в `main`

---

## ⚠️ Важно

- URL только через `process.env.NEXT_PUBLIC_POCKETBASE_URL` — не хардкодить
- Приватные Stripe ключи (`sk_test_...`) — только на сервере, никогда в `NEXT_PUBLIC_`
- Проверять авторизацию перед каждым запросом к PocketBase
- Всегда добавлять error handling и показывать ошибки пользователю

---

## 🔗 Полезные ссылки

- [PocketBase JS SDK](https://github.com/pocketbase/js-sdk)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Stripe Next.js Guide](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhook Docs](https://stripe.com/docs/webhooks)
