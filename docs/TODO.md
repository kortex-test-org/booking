# TODO

## Skeleton loaders + fade-in animations

Везде заменить спиннеры и резкое появление контента на skeleton-заглушки с плавным `animate-in fade-in` после загрузки.

- [ ] **dashboard/page.tsx** — заменить `Loader2` спиннер (авторизация + загрузка бронирований) на skeleton-карточки `BookingCard`-размера
- [ ] **booking/[serviceId]/page.tsx** — заменить `Loader2` спиннер при загрузке услуги/слотов на skeleton страницы бронирования (заголовок, описание, TimeSlotPicker, боковая карточка)
- [ ] **time-slot-picker.tsx** — заменить текущий `!mounted || isLoading` возврат (пустой flex-блок) на skeleton-заглушки календаря и слотов
- [ ] **admin/(dashboard)/page.tsx** — заменить `"Загрузка..."` в строках таблицы бронирований и слотов на skeleton-строки таблицы
- [ ] **admin/(dashboard)/services/page.tsx** — заменить `isLoading` состояние таблицы услуг на skeleton-строки таблицы
