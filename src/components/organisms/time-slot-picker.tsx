"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTimeSlots } from "@/queries/time-slots";

interface TimeSlotPickerProps {
  serviceId: string;
  onSelectTime: (date: Date, time: string) => void;
}

export function TimeSlotPicker({ serviceId, onSelectTime }: TimeSlotPickerProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { data: slots = [], isLoading } = useTimeSlots();

  const availableSlots = useMemo(() => {
    return slots.filter((slot) => {
      if (slot.service !== serviceId) return false;
      const slotBookings: { status: string }[] = slot.expand?.bookings_via_time_slot ?? [];
      const isBooked = slotBookings.some((b) => b.status !== "cancelled");
      return !isBooked;
    });
  }, [slots, serviceId]);

  const availableDateStrings = useMemo(() => {
    return new Set(availableSlots.map(s => s.date));
  }, [availableSlots]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !date && availableDateStrings.size > 0) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      let targetDateStr = '';
      
      if (availableDateStrings.has(todayStr)) {
        targetDateStr = todayStr;
      } else {
        const sortedDates = Array.from(availableDateStrings).sort();
        const futureDates = sortedDates.filter(d => d >= todayStr);
        if (futureDates.length > 0) {
          targetDateStr = futureDates[0];
        } else if (sortedDates.length > 0) {
          targetDateStr = sortedDates[sortedDates.length - 1];
        }
      }

      if (targetDateStr) {
        const [y, m, d] = targetDateStr.split('-');
        setDate(new Date(Number(y), Number(m) - 1, Number(d)));
      }
    }
  }, [mounted, isLoading, date, availableDateStrings]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (date) {
      onSelectTime(date, time);
    }
  };

  const availableTimes = useMemo(() => {
    if (!date) return [];
    const dateStr = format(date, 'yyyy-MM-dd');
    return availableSlots
      .filter((s) => s.date === dateStr)
      .map((s) => s.time)
      .sort();
  }, [date, availableSlots]);

  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="flex-shrink-0 w-[350px] h-[350px] mx-auto md:mx-0 border-muted/50 dark:bg-card/50 backdrop-blur-sm animate-pulse" />
        <div className="flex-1 space-y-4">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-10 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <Card className="flex-shrink-0 w-fit mx-auto md:mx-0 border-muted/50 dark:bg-card/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Calendar
            mode="single"
            locale={ru}
            selected={date}
            onSelect={(d) => {
              setDate(d);
              setSelectedTime(null);
            }}
            disabled={(d) => {
              const dStr = format(d, 'yyyy-MM-dd');
              return !availableDateStrings.has(dStr);
            }}
            className="p-4"
            classNames={{
              day_today: "bg-muted text-muted-foreground",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            }}
          />
        </CardContent>
      </Card>
      
      <div className="flex-1">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Доступное время {date ? `на ${date.toLocaleDateString("ru-RU")}` : ""}
        </h3>
        {date ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {availableTimes.length > 0 ? (
              availableTimes.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={`transition-all ${
                    selectedTime === time 
                      ? "shadow-md scale-105" 
                      : "hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </Button>
              ))
            ) : (
              <p className="text-muted-foreground col-span-full py-4 bg-muted/20 text-center rounded-xl border border-dashed">
                Нет доступного времени в этот день
              </p>
            )}
          </div>
        ) : (
          <div className="py-12 text-center border rounded-xl border-dashed bg-muted/20">
            <p className="text-muted-foreground">Пожалуйста, выберите дату слева</p>
          </div>
        )}
      </div>
    </div>
  );
}
