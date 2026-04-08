"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ru } from "date-fns/locale";

// Моковые слоты времени
const MOCK_SLOTS = [
  "09:00", "09:30", "10:00", "11:00", "13:30", "14:00", "15:00", "16:30", "17:00"
];

interface TimeSlotPickerProps {
  onSelectTime: (date: Date, time: string) => void;
}

export function TimeSlotPicker({ onSelectTime }: TimeSlotPickerProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
  }, []);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (date) {
      onSelectTime(date, time);
    }
  };

  if (!mounted) {
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
            {MOCK_SLOTS.map((time) => (
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
            ))}
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
