import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookingCancelPage() {
  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-8 shadow-xl shadow-destructive/5 animate-in zoom-in duration-500">
        <XCircle className="w-12 h-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Оплата отменена
      </h1>
      <p className="text-xl text-muted-foreground max-w-lg mb-10 leading-relaxed">
        Процесс оплаты не был завершен. Ваше бронирование не подтверждено. Если
        у вас возникли проблемы, вы можете попробовать снова.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button
            size="lg"
            className="w-full sm:w-auto h-12 px-8 shadow-md rounded-full"
          >
            Вернуться к услугам
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto h-12 px-8 rounded-full"
          >
            В личный кабинет
          </Button>
        </Link>
      </div>
    </div>
  );
}
