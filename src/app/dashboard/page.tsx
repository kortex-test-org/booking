"use client";

import { useEffect, useState } from "react";
import { BookingCard, type BookingStatus } from "@/components/molecules/booking-card";
import { useAuth } from "@/lib/auth-context";
import { getUserBookings, type Booking } from "@/services/bookings";
import type { Service } from "@/services/services";
import type { TimeSlot } from "@/services/time-slots";
import { Loader2 } from "lucide-react";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(":").map(Number);
  const start = new Date(0, 0, 0, hours, minutes);
  const end = new Date(0, 0, 0, hours, minutes + durationMinutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`;
}

export default function DashboardPage() {
  const { record, isValid } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isValid || !record?.id) {
      setLoading(false);
      return;
    }

    getUserBookings(record.id)
      .then(setBookings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isValid, record?.id]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Мои бронирования</h1>
        <p className="text-muted-foreground">Здесь отображается история ваших записей и их текущий статус.</p>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {bookings.map((booking) => {
            const service = booking.expand?.service as Service | undefined;
            const timeSlot = booking.expand?.time_slot as TimeSlot | undefined;

            return (
              <BookingCard
                key={booking.id}
                id={booking.id}
                serviceName={service?.name ?? "—"}
                date={timeSlot?.date ? formatDate(timeSlot.date) : "—"}
                time={
                  timeSlot?.time && service?.duration_minutes
                    ? formatTime(timeSlot.time, service.duration_minutes)
                    : timeSlot?.time ?? "—"
                }
                status={booking.status as BookingStatus}
                price={service?.price ?? 0}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground mb-4">У вас пока нет активных бронирований</p>
        </div>
      )}
    </div>
  );
}
