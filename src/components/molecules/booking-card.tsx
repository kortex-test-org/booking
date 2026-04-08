import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, CreditCard } from "lucide-react";

export type BookingStatus = "pending" | "paid" | "cancelled";

export interface BookingCardProps {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
}

const statusConfig: Record<BookingStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает оплаты", variant: "outline" },
  paid: { label: "Оплачено", variant: "default" },
  cancelled: { label: "Отменено", variant: "destructive" },
};

export function BookingCard({ id, serviceName, date, time, status, price }: BookingCardProps) {
  const config = statusConfig[status];

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-muted group h-full flex flex-col p-0 gap-0">
      <CardHeader className="bg-muted/30 pt-5 pb-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1 font-mono">{id}</div>
            <CardTitle className="text-lg leading-tight">{serviceName}</CardTitle>
          </div>
          <Badge variant={config.variant} className={`shrink-0 self-start ${status === "paid" ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-5 pb-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-y-3 gap-x-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 text-primary/70" />
            <span className="font-medium text-foreground">{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary/70" />
            <span className="font-medium text-foreground">{time}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="w-4 h-4 text-primary/70" />
            <span>{price} €</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
