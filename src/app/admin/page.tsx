"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { ru } from "date-fns/locale";

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
    status: "paid",
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

const ADMIN_MOCK_SLOTS = [
  { id: "S-1", date: "18 апр 2026", time: "10:00", booked: true },
  { id: "S-2", date: "18 апр 2026", time: "11:00", booked: false },
  { id: "S-3", date: "18 апр 2026", time: "12:00", booked: true },
  { id: "S-4", date: "19 апр 2026", time: "09:00", booked: false },
  { id: "S-5", date: "19 апр 2026", time: "10:00", booked: false },
  { id: "S-6", date: "20 апр 2026", time: "15:00", booked: true },
  { id: "S-7", date: "20 апр 2026", time: "16:00", booked: false },
];

const TIME_OPTIONS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

export default function AdminDashboardPage() {
  // UI-only state for the "Add slot" dialog form
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Управление бронированиями</h1>
        <p className="text-muted-foreground">Обзор всех записей и их статусов.</p>
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
                  {booking.date}<br />
                  <span className="text-xs text-muted-foreground">{booking.time}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === "paid" ? "default" :
                        booking.status === "cancelled" ? "destructive" : "outline"
                    }
                    className={booking.status === "paid" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    {booking.status === "paid" ? "Оплачено" :
                      booking.status === "cancelled" ? "Отменено" : "Ожидает"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{booking.price}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">Одобрить (paid)</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive">Отменить бронь</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-destructive font-semibold">Удалить</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="text-xl font-bold tracking-tight">Управление доступностью (Слоты)</h2>
          <Dialog>
            <DialogTrigger render={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Добавить слот
              </Button>
            } />
            <DialogContent className="sm:max-w-fit">
              <DialogHeader>
                <DialogTitle>Новый слот</DialogTitle>
                <DialogDescription>Выберите дату и время для нового слота</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-2">
                <Calendar
                  mode="single"
                  locale={ru}
                  selected={newDate}
                  onSelect={setNewDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
                <div className="w-full px-1">
                  <Select value={newTime} onValueChange={setNewTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                {/* TODO: интеграция с бэком */}
                <Button type="button" disabled={!newDate || !newTime}>Создать</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ADMIN_MOCK_SLOTS.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell className="font-medium">{slot.date}</TableCell>
                  <TableCell>{slot.time}</TableCell>
                  <TableCell>
                    <Badge
                      variant={slot.booked ? "destructive" : "outline"}
                      className={!slot.booked ? "text-green-600 border-green-400" : ""}
                    >
                      {slot.booked ? "Занят" : "Свободен"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {/* TODO: интеграция с бэком */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      disabled={slot.booked}
                      title={slot.booked ? "Нельзя удалить занятый слот" : "Удалить слот"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
