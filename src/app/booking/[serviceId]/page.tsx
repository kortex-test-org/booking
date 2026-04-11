"use client";

import {
  ArrowRight,
  CalendarDays,
  Clock,
  Hourglass,
  Loader2,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TimeSlotPicker } from "@/components/organisms/time-slot-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { BOOKING_STATUS } from "@/lib/constants";
import { useUpdateBookingStatus } from "@/queries/bookings";
import { useServices } from "@/queries/services";
import { useTimeSlots } from "@/queries/time-slots";
import { pb } from "@/services/pb";

export default function BookingServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = Array.isArray(params.serviceId)
    ? params.serviceId[0]
    : (params.serviceId ?? "");
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: Date;
    time: string;
    slotId: string;
  } | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const { data: services = [], isLoading: isServicesLoading } = useServices();
  const { data: slots = [], isLoading: isSlotsLoading } = useTimeSlots();
  const service = services.find((s) => s.id === serviceId);
  const { isValid, isInitialized } = useAuth();
  const searchParams = useSearchParams();
  const { mutate: cancelBooking } = useUpdateBookingStatus();

  const cancelledParam = searchParams.get("cancelled");
  const bookingIdParam = searchParams.get("bookingId");

  useEffect(() => {
    if (cancelledParam === "1" && bookingIdParam) {
      cancelBooking({ id: bookingIdParam, status: BOOKING_STATUS.CANCELLED });
    }
  }, [cancelledParam, bookingIdParam, cancelBooking]);

  useEffect(() => {
    if (isInitialized && !isValid) {
      const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isInitialized, isValid, router]);

  const handleTimeSelect = (date: Date, time: string, slotId: string) => {
    setSelectedDateTime({ date, time, slotId });
  };

  const handleProceed = async () => {
    if (!selectedDateTime || !service) return;

    try {
      setIsCheckoutLoading(true);

      // PocketBase хранит токен в памяти/localStorage, а не в куки.
      // Передаём его явно в заголовке Authorization.
      const token = pb.authStore.token;
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          serviceId: serviceId,
          timeSlotId: selectedDateTime.slotId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании платежа");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Произошла ошибка при переходе к оплате. Попробуйте еще раз.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (
    !isInitialized ||
    (isInitialized && !isValid) ||
    isServicesLoading ||
    isSlotsLoading
  ) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-24 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-24 text-center min-h-[50vh]">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Услуга не найдена
        </h1>
        <p className="text-muted-foreground mb-8">
          Возможно, ссылка устарела или услуга была удалена.
        </p>
        <Button onClick={() => router.push("/")} size="lg">
          На главную
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-5xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">
          Бронирование
        </Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {service.name}
        </h1>
        {service.description && (
          <p className="text-muted-foreground text-lg max-w-3xl">
            {service.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TimeSlotPicker
            serviceId={serviceId}
            slots={slots}
            isLoading={isSlotsLoading}
            onSelectTime={handleTimeSelect}
          />
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-muted/50 shadow-lg">
            <CardHeader className="bg-muted/30">
              <CardTitle>Детали бронирования</CardTitle>
              <CardDescription>Итоговая информация</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Дата
                    </h4>
                    <p className="font-medium text-foreground">
                      {selectedDateTime
                        ? selectedDateTime.date.toLocaleDateString("ru-RU", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Не выбрана"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Время начала
                    </h4>
                    <p className="font-medium text-foreground">
                      {selectedDateTime ? selectedDateTime.time : "Не выбрано"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hourglass className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Длительность
                    </h4>
                    <p className="font-medium text-foreground">
                      {service.duration_minutes} мин
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium">Итого к оплате</span>
                  <span className="text-2xl font-bold">{service.price} €</span>
                </div>
                <Button
                  className="w-full text-base h-12 shadow-sm rounded-xl group"
                  disabled={!selectedDateTime || isCheckoutLoading}
                  onClick={handleProceed}
                >
                  {isCheckoutLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Обработка...
                    </>
                  ) : (
                    <>
                      Оплатить и подтвердить
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Вы будете перенаправлены на защищенную страницу оплаты Stripe
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
