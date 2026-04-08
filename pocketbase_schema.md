# PocketBase Schema — Booking App

## Collections

### users (встроенная)

Стандартная коллекция PocketBase Auth. Дополнительных полей нет.

---

### services

| Поле               | Тип    | Обязательное |
| ------------------ | ------ | ------------ |
| `name`             | Text   | ✅           |
| `description`      | Text   | ❌           |
| `price`            | Number | ✅           |
| `duration_minutes` | Number | ✅           |

---

### time_slots

| Поле      | Тип                 | Обязательное |
| --------- | ------------------- | ------------ |
| `service` | Relation → services | ✅           |
| `date`    | Text (YYYY-MM-DD)   | ✅           |
| `time`    | Text (HH:MM)        | ✅           |

---

### bookings

| Поле                | Тип                                    | Обязательное |
| ------------------- | -------------------------------------- | ------------ |
| `user`              | Relation → users                       | ✅           |
| `service`           | Relation → services                    | ✅           |
| `time_slot`         | Relation → time_slots                  | ✅           |
| `status`            | Select: `pending`, `paid`, `cancelled` | ✅           |
| `stripe_payment_id` | Text                                   | ❌           |

---

## API Rules

### services

- **List/View:** публичный (все могут читать)
- **Create/Update/Delete:** только авторизованные

### time_slots

- **List/View:** публичный
- **Create/Update/Delete:** только admin

### bookings

- **List/View:** `@request.auth.id = user.id` (только свои)
- **Create:** авторизованные пользователи
- **Update/Delete:** `@request.auth.id = user.id`

---

## Связи

- `bookings` → `users` (кто забронировал)
- `bookings` → `services` (какая услуга)
- `bookings` → `time_slots` (на какое время)
- `time_slots` → `services` (к какой услуге относится слот)

---

## Base URL

```
NEXT_PUBLIC_POCKETBASE_URL=http://pocketbase-cdvl7muq00j1ch8av5esbgvn.176.112.158.3.sslip.io/
```

---

## Примеры запросов

### Получить все услуги

```
GET /api/collections/services/records
```

### Получить слоты для услуги (с букингами для вычисления занятости)

```
GET /api/collections/time_slots/records?filter=(service='SERVICE_ID')&expand=bookings_via_time_slot
```
> Слот занят если в `expand.bookings_via_time_slot` есть запись со статусом `pending` или `paid`.

### Создать бронирование

```
POST /api/collections/bookings/records
{
  "user": "USER_ID",
  "service": "SERVICE_ID",
  "time_slot": "SLOT_ID",
  "status": "pending"
}
```

### Получить свои бронирования

```
GET /api/collections/bookings/records?expand=service,time_slot
```
