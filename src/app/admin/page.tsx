import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

const ADMIN_MOCK_BOOKINGS = [
  {
    id: "B-29001",
    customer: "Иван Иванов",
    service: "Стратегическая сессия (Офлайн)",
    date: "14 апр 2026",
    time: "15:00",
    status: "paid",
    price: "250 €",
  },
  {
    id: "B-29002",
    customer: "Анна Смирнова",
    service: "Онлайн консультация",
    date: "18 апр 2026",
    time: "10:00",
    status: "pending",
    price: "30 €",
  },
  {
    id: "B-28501",
    customer: "Петр Васильев",
    service: "Экспресс Аудит",
    date: "2 апр 2026",
    time: "12:00",
    status: "completed",
    price: "15 €",
  },
  {
    id: "B-28400",
    customer: "ООО Ромашка",
    service: "Обучение команды",
    date: "25 мар 2026",
    time: "10:00",
    status: "cancelled",
    price: "300 €",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Управление бронированиями</h1>
          <p className="text-muted-foreground">Обзор всех записей и их статусов.</p>
        </div>
        <Button>Добавить бронь</Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead className="hidden md:table-cell">Услуга</TableHead>
              <TableHead className="hidden sm:table-cell">Дата / Время</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ADMIN_MOCK_BOOKINGS.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-mono text-xs">{booking.id}</TableCell>
                <TableCell className="font-medium">{booking.customer}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{booking.service}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {booking.date}<br/>
                  <span className="text-xs text-muted-foreground">{booking.time}</span>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      booking.status === "paid" ? "default" :
                      booking.status === "completed" ? "secondary" :
                      booking.status === "cancelled" ? "destructive" : "outline"
                    }
                    className={booking.status === "paid" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {booking.status === "paid" ? "Оплачено" :
                     booking.status === "completed" ? "Завершено" :
                     booking.status === "cancelled" ? "Отменено" : "Ожидает"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{booking.price}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-bold tracking-tight mb-4 border-b pb-2">Управление доступностью (Слоты)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
           {/* Mock interface for slot management */}
           <div className="border rounded-lg p-4 bg-muted/10">
             <div className="flex justify-between items-center mb-2">
               <span className="font-medium">18 апр 2026</span>
               <Badge>3 слота</Badge>
             </div>
             <p className="text-sm text-muted-foreground mb-4">Настроено времени: 10:00, 11:00, 12:00</p>
             <Button variant="outline" size="sm" className="w-full">Редактировать день</Button>
           </div>
           
           <div className="border border-dashed rounded-lg p-4 bg-muted/5 flex flex-col items-center justify-center text-center min-h-[140px] hover:bg-muted/10 transition-colors cursor-pointer">
             <span className="text-muted-foreground font-medium">+ Добавить доступный день</span>
           </div>
        </div>
      </div>
    </div>
  );
}
