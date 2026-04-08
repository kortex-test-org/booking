"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TimeSlotPicker } from "@/components/organisms/time-slot-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

export default function BookingServicePage() {
  const params = useParams();
  const router = useRouter();
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: Date; time: string } | null>(null);

  const handleTimeSelect = (date: Date, time: string) => {
    setSelectedDateTime({ date, time });
  };

  const handleProceed = () => {
    // В реальном приложении здесь будет логика создания бронирования в PocketBase
    // и редирект на Stripe Checkout
    if (selectedDateTime) {
      router.push("/booking/success");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-20 max-w-5xl">
      <div className="mb-8">
        <Badge variant="secondary" className="mb-4">Услуга #{params.serviceId}</Badge>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Выберите время</h1>
        <p className="text-muted-foreground text-lg">
          Укажите удобную для вас дату и время для бронирования услуги.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <TimeSlotPicker onSelectTime={handleTimeSelect} />
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
                    <h4 className="font-medium text-sm text-muted-foreground">Дата</h4>
                    <p className="font-medium text-foreground">
                      {selectedDateTime 
                        ? selectedDateTime.date.toLocaleDateString("ru-RU", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                        : "Не выбрана"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">Время</h4>
                    <p className="font-medium text-foreground">
                      {selectedDateTime ? selectedDateTime.time : "Не выбрано"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium">Итого к оплате</span>
                  <span className="text-2xl font-bold">30 €</span>
                </div>
                <Button 
                  className="w-full text-base h-12 shadow-sm rounded-xl group" 
                  disabled={!selectedDateTime}
                  onClick={handleProceed}
                >
                  Оплатить и подтвердить
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
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
