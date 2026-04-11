import { NextResponse } from "next/server";
import PocketBase from "pocketbase";
import Stripe from "stripe";
import { BOOKING_STATUS } from "@/lib/constants";

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    console.error("Missing Stripe environment variables");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : String(err);
      console.error(`⚠️ Ошибка верификации подписи вебхука:`, errMessage);
      return NextResponse.json(
        { error: `Webhook Error: ${errMessage}` },
        { status: 400 },
      );
    }

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
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

      if (metadata.bookingId) {
        await pb.collection("bookings").update(metadata.bookingId, {
          status: BOOKING_STATUS.PAID,
          stripe_payment_id: session.payment_intent || session.id,
        });
      } else {
        await pb.collection("bookings").create({
          user: metadata.userId,
          service: metadata.serviceId,
          time_slot: metadata.timeSlotId,
          status: BOOKING_STATUS.PAID,
          stripe_payment_id: session.payment_intent || session.id,
        });
      }

      console.log(
        `✅ Бронирование подтверждено для пользователя ${metadata.userId} и слота ${metadata.timeSlotId}`,
      );
    }

    // Возвращаем 200 для подтверждения получения вебхука
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Ошибка обработки вебхука:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
