import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const { serviceId, timeSlotId, bookingId: existingBookingId, cancelUrl } = await req.json();

    if (!serviceId || !timeSlotId) {
      return NextResponse.json(
        { error: "Не переданы обязательные поля" },
        { status: 400 },
      );
    }

    // Инициализация PocketBase
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    // Авторизация: читаем Bearer-токен из заголовка Authorization
    // (PocketBase SDK хранит токен в памяти/localStorage, не в куки)
    const authHeader = req.headers.get("Authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (bearerToken) {
      // Загружаем токен напрямую в authStore
      pb.authStore.save(bearerToken, null);
    } else {
      // Fallback: пробуем куки
      const cookieStore = await cookies();
      const pbAuthCookie = cookieStore.get("pb_auth");
      if (pbAuthCookie) {
        pb.authStore.loadFromCookie(`pb_auth=${pbAuthCookie.value}`);
      }
    }

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Извлекаем userId из JWT-пейлоада (model может быть null, если токен загружен через save())
    let userId: string | null =
      pb.authStore.record?.id ?? pb.authStore.model?.id ?? null;
    if (!userId && pb.authStore.token) {
      try {
        const payload = JSON.parse(
          Buffer.from(pb.authStore.token.split(".")[1], "base64").toString(),
        );
        userId = payload.id ?? null;
      } catch {
        // не удалось декодировать
      }
    }
    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    // Получаем услугу для верификации стоимости
    const service = await pb.collection("services").getOne(serviceId);

    if (!service || !service.price) {
      return NextResponse.json(
        { error: "Услуга не найдена или не имеет стоимости" },
        { status: 404 },
      );
    }

    // Получаем слот времени для верификации
    const slot = await pb.collection("time_slots").getOne(timeSlotId, {
      expand: "bookings_via_time_slot",
    });

    if (!slot) {
      return NextResponse.json(
        { error: "Временной слот не найден" },
        { status: 404 },
      );
    }

    // Проверяем, не занят ли слот (исключая текущую pending-запись, если переоплачиваем)
    const slotBookings = slot.expand?.bookings_via_time_slot || [];
    const isBooked = slotBookings.some(
      (b: any) => b.status !== "cancelled" && b.id !== existingBookingId,
    );

    if (isBooked) {
      return NextResponse.json(
        { error: "Этот слот уже занят" },
        { status: 400 },
      );
    }

    // Удаляем отменённые записи для этого слота перед созданием новой
    const cancelledBookings = slotBookings.filter(
      (b: any) => b.status === "cancelled",
    );
    if (cancelledBookings.length > 0) {
      await Promise.allSettled(
        cancelledBookings.map((b: any) => pb.collection("bookings").delete(b.id)),
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    // Если переоплачиваем существующую запись — реиспользуем её, иначе создаём новую
    const booking = existingBookingId
      ? await pb.collection("bookings").getOne(existingBookingId)
      : await pb.collection("bookings").create({
          user: userId,
          service: serviceId,
          time_slot: timeSlotId,
          status: "pending",
        });

    // Создаем Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: service.name,
              description:
                service.description ||
                `Бронирование на ${slot.date} в ${slot.time}`,
            },
            unit_amount: Math.round(service.price * 100), // конвертация в центы
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/booking/success`,
      cancel_url: cancelUrl
        ? `${baseUrl}${cancelUrl}?cancelled=1&bookingId=${booking.id}`
        : `${baseUrl}/booking/${serviceId}?cancelled=1&bookingId=${booking.id}`,
      metadata: {
        userId,
        serviceId,
        timeSlotId,
        bookingId: booking.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: error.message || "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
