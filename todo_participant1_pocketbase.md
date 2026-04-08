# 👤 Участник 1 — PocketBase & Инфраструктура

> **Твоя зона ответственности:** настройка базы данных, API, авторизация и деплой PocketBase через Coolify.

---

## День 1 — Coolify + PocketBase

- [ ] Задеплоить PocketBase в Coolify как Docker-контейнер
- [ ] ⚠️ **КРИТИЧНО:** Добавить Persistent Volume → путь `/pb/pb_data`
  - Без этого все данные сотрутся при перезапуске контейнера!
- [ ] Убедиться, что PocketBase Admin UI доступен по публичному URL
- [ ] Настроить HTTPS (Coolify делает это автоматически)
- [ ] Поделиться URL и логином от Admin UI с командой

---

## День 1–2 — Collections (таблицы)

Создать следующие коллекции в PocketBase Admin UI:

### 📋 `services` — Услуги
| Поле | Тип |
|------|-----|
| `name` | Text (required) |
| `description` | Text |
| `price` | Number (required) |
| `duration_minutes` | Number (required) |

### 🕐 `time_slots` — Доступное время
| Поле | Тип |
|------|-----|
| `service` | Relation → services |
| `date` | Text (формат: YYYY-MM-DD) |
| `time` | Text (формат: HH:MM) |
| `is_available` | Bool (default: true) |

### 📅 `bookings` — Бронирования
| Поле | Тип |
|------|-----|
| `user` | Relation → users |
| `service` | Relation → services |
| `time_slot` | Relation → time_slots |
| `status` | Select: `pending`, `paid`, `cancelled` |
| `stripe_payment_id` | Text |

---

## День 2 — API правила безопасности

Настроить правила доступа в каждой коллекции:

### `services`
- **List/View:** `""` (все могут читать)
- **Create/Update/Delete:** `@request.auth.id != "" && @request.auth.collectionName = "users"` (только авторизованные)

### `time_slots`
- **List/View:** `""` (все могут читать)
- **Create/Update/Delete:** только через admin

### `bookings`
- **List/View:** `@request.auth.id = user.id` (только свои бронирования!)
- **Create:** `@request.auth.id != ""`
- **Update/Delete:** `@request.auth.id = user.id`

---

## День 2 — Тестирование API

- [ ] Протестировать все endpoints через браузер или Postman:
  - `GET /api/collections/services/records`
  - `GET /api/collections/time_slots/records`
  - `POST /api/collections/bookings/records`
- [ ] Проверить, что неавторизованный пользователь НЕ видит чужие бронирования
- [ ] Задокументировать все API endpoints для команды (записать в README или в общий чат)

---

## День 5 — Stripe Webhook

- [ ] Создать endpoint в PocketBase для приёма Stripe webhook
- [ ] При получении события `checkout.session.completed`:
  - Найти бронирование по `stripe_payment_id`
  - Обновить статус на `paid`
  - Установить `is_available = false` для слота
- [ ] Протестировать webhook локально через Stripe CLI

---

## День 7 — Финальная проверка

- [ ] Persistent Volume работает (перезапустить контейнер — данные должны сохраниться)
- [ ] Все Collections созданы и настроены
- [ ] API правила корректны — проверить вручную
- [ ] PocketBase Admin URL доступен и передан команде
- [ ] Добавить свою часть в README.md

---

## 🔗 Полезные ссылки

- [PocketBase Docs](https://pocketbase.io/docs/)
- [PocketBase API Rules](https://pocketbase.io/docs/api-rules-and-filters/)
- [Coolify Docs](https://coolify.io/docs/)
