import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Ошибка верификации подписи вебхука:`, err.message);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 },
      );
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (
        !metadata ||
        !metadata.userId ||
        !metadata.serviceId ||
        !metadata.timeSlotId
      ) {
        console.error("Отсутствует metadata в сессии. ID сессии:", session.id);
        return NextResponse.json({ received: true }, { status: 200 }); // Возвращаем 200, чтобы Stripe не повторял попытки, так как это данные, которых у нас все равно не будет
      }

      // Инициализация PocketBase
      const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

      // Авторизуемся как администратор
      if (
        !process.env.POCKETBASE_ADMIN_EMAIL ||
        !process.env.POCKETBASE_ADMIN_PASSWORD
      ) {
        console.error(
          "Отсутствуют учетные данные администратора PocketBase в ENV.",
        );
        return NextResponse.json(
          { error: "Ошибка конфигурации сервера" },
          { status: 500 },
        );
      }

      await pb.admins.authWithPassword(
        process.env.POCKETBASE_ADMIN_EMAIL,
        process.env.POCKETBASE_ADMIN_PASSWORD,
      );

      // Обновляем существующую запись бронирования (pending → paid)
      if (metadata.bookingId) {
        await pb.collection("bookings").update(metadata.bookingId, {
          status: "paid",
          stripe_payment_id: session.payment_intent || session.id,
        });
      } else {
        // Фаллбэк: создаём новую запись (для старых сессий без bookingId)
        await pb.collection("bookings").create({
          user: metadata.userId,
          service: metadata.serviceId,
          time_slot: metadata.timeSlotId,
          status: "paid",
          stripe_payment_id: session.payment_intent || session.id,
        });
      }

      console.log(
        `✅ Бронирование подтверждено для пользователя ${metadata.userId} и слота ${metadata.timeSlotId}`,
      );
    }

    // Возвращаем 200 для подтверждения получения вебхука
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("Ошибка обработки вебхука:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
