import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function BookingSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-500/10 animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Бронирование успешно!</h1>
      <p className="text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
        Ваша оплата прошла успешно, и время забронировано. Вся информация была отправлена вам на email.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/dashboard">
          <Button size="lg" className="w-full sm:w-auto h-12 px-8 shadow-md rounded-full">
            Перейти в личный кабинет
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full">
            На главную
          </Button>
        </Link>
      </div>
    </div>
  );
}
