"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingCard, type BookingStatus } from "@/components/molecules/booking-card";
import { useAuth } from "@/lib/auth-context";
import { getUserBookings, type Booking } from "@/services/bookings";
import { getServices, type Service } from "@/services/services";
import { getTimeSlotsBasic, type TimeSlot } from "@/services/time-slots";
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
  const { record, isValid, isInitialized } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Map<string, Service>>(new Map());
  const [timeSlots, setTimeSlots] = useState<Map<string, TimeSlot>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isInitialized && !isValid) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isInitialized, isValid, router]);

  useEffect(() => {
    if (!isInitialized || !isValid || !record?.id) return;

    let cancelled = false;

    Promise.all([
      getUserBookings(),
      getServices({ requestKey: null }),
      getTimeSlotsBasic(),
    ])
      .then(([bookingsList, servicesList, slotsList]) => {
        if (cancelled) return;
        setBookings(bookingsList);
        setServices(new Map(servicesList.map((s) => [s.id, s])));
        setTimeSlots(new Map(slotsList.map((s) => [s.id, s])));
      })
      .catch((err) => { if (!cancelled) console.error("Dashboard fetch error:", err?.url, err); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [isInitialized, isValid, record?.id]);

  if (!isInitialized || (isInitialized && !isValid)) {
    return (
      <div className="py-20 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
            const service = services.get(booking.service);
            const slot = timeSlots.get(booking.time_slot);

            return (
              <BookingCard
                key={booking.id}
                id={booking.id}
                serviceName={service?.name ?? "—"}
                date={slot?.date ? formatDate(slot.date) : "—"}
                time={
                  slot?.time && service?.duration_minutes
                    ? formatTime(slot.time, service.duration_minutes)
                    : slot?.time ?? "—"
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
