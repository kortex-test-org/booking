"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingCard } from "@/components/molecules/booking-card";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BOOKING_STATUS } from "@/lib/constants";
import { useUpdateBookingStatus, useUserBookings } from "@/queries/bookings";
import { useServices } from "@/queries/services";
import { useTimeSlotsBasic } from "@/queries/time-slots";
import type { Booking } from "@/services/bookings";
import { pb } from "@/services/pb";

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

function BookingCardSkeleton() {
  return (
    <Card className="overflow-hidden border-muted h-full flex flex-col p-0 gap-0">
      <CardHeader className="bg-muted/30 pt-5 pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-5 w-24 shrink-0 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-5 pb-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
      <CardFooter className="py-4 px-6 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}

export default function DashboardPage() {
  const { isValid, isInitialized } = useAuth();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const { data: bookings = [], isLoading: isBookingsLoading } =
    useUserBookings();
  const { data: servicesList = [], isLoading: isServicesLoading } =
    useServices();
  const { data: slotsList = [], isLoading: isSlotsLoading } =
    useTimeSlotsBasic();
  const updateStatus = useUpdateBookingStatus();
  const { mutate: cancelBooking } = updateStatus;

  const services = new Map(
    servicesList.map((service) => [service.id, service]),
  );
  const timeSlots = new Map(slotsList.map((slot) => [slot.id, slot]));
  const loading = isBookingsLoading || isServicesLoading || isSlotsLoading;

  const cancelledParam = searchParams.get("cancelled");
  const bookingIdParam = searchParams.get("bookingId");

  useEffect(() => {
    if (cancelledParam === "1" && bookingIdParam) {
      cancelBooking({ id: bookingIdParam, status: BOOKING_STATUS.CANCELLED });
    }
  }, [cancelledParam, bookingIdParam, cancelBooking]);

  async function handlePay(booking: Booking) {
    setPayingId(booking.id);
    try {
      const token = pb.authStore.token;
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          serviceId: booking.service,
          timeSlotId: booking.time_slot,
          bookingId: booking.id,
          cancelUrl: "/dashboard",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Pay error:", err);
    } finally {
      setPayingId(null);
    }
  }

  async function handleCancel(bookingId: string) {
    setCancellingId(bookingId);
    await updateStatus
      .mutateAsync({ id: bookingId, status: BOOKING_STATUS.CANCELLED })
      .catch((err) => {
        console.error("Cancel error:", err);
      });
    setCancellingId(null);
  }

  const showSkeleton = !isInitialized || loading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          Мои бронирования
        </h1>
        <p className="text-muted-foreground">
          Здесь отображается история ваших записей и их текущий статус.
        </p>
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <BookingCardSkeleton key={index} />
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 animate-in fade-in duration-300">
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
                    : (slot?.time ?? "—")
                }
                status={booking.status}
                price={service?.price ?? 0}
                onPay={() => handlePay(booking)}
                payLoading={payingId === booking.id}
                onCancel={() => handleCancel(booking.id)}
                cancelLoading={cancellingId === booking.id}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground mb-4">
            У вас пока нет активных бронирований
          </p>
        </div>
      )}
    </div>
  );
}
