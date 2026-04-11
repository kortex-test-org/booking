"use client";

import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { BOOKING_STATUS } from "@/lib/constants";
import {
  useBookings,
  useCreateBooking,
  useDeleteBooking,
  useUpdateBookingStatus,
} from "@/queries/bookings";
import { useServices } from "@/queries/services";
import {
  useCreateTimeSlot,
  useDeleteTimeSlot,
  useTimeSlots,
} from "@/queries/time-slots";
import { useUsers } from "@/queries/users";

const TIME_OPTIONS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

const STATUS_LABEL: Record<string, string> = {
  [BOOKING_STATUS.PAID]: "Оплачено",
  [BOOKING_STATUS.PENDING]: "Ожидает",
  [BOOKING_STATUS.CANCELLED]: "Отменено",
};

const EMPTY_BOOKING_FORM = {
  userId: "",
  serviceId: "",
  slotId: "",
  status: BOOKING_STATUS.PENDING,
};

export default function AdminDashboardPage() {
  const [slotOpen, setSlotOpen] = useState(false);
  const [newDate, setNewDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState<string | null>(null);
  const [newServiceId, setNewServiceId] = useState<string | null>(null);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING_FORM);

  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: slots = [], isLoading: slotsLoading } = useTimeSlots();
  const { data: services = [] } = useServices();
  const { data: users = [] } = useUsers();
  const createSlot = useCreateTimeSlot();
  const deleteSlot = useDeleteTimeSlot();
  const updateStatus = useUpdateBookingStatus();
  const deleteBooking = useDeleteBooking();
  const createBooking = useCreateBooking();

  const availableSlotsForForm = slots.filter((s) => {
    if (bookingForm.serviceId && s.service !== bookingForm.serviceId)
      return false;
    const slotBookings: { status: string }[] =
      s.expand?.bookings_via_time_slot ?? [];
    return !slotBookings.some((b) => b.status !== BOOKING_STATUS.CANCELLED);
  });

  function handleCreateBooking() {
    const { userId, serviceId, slotId, status } = bookingForm;
    if (!userId || !serviceId || !slotId) return;
    createBooking.mutate(
      { user: userId, service: serviceId, time_slot: slotId, status },
      {
        onSuccess: () => {
          setBookingOpen(false);
          setBookingForm(EMPTY_BOOKING_FORM);
        },
      },
    );
  }

  function handleCreate() {
    if (!newDate || !newTime || !newServiceId) return;
    createSlot.mutate(
      {
        service: newServiceId,
        date: format(newDate, "yyyy-MM-dd"),
        time: newTime,
      },
      {
        onSuccess: () => {
          setSlotOpen(false);
          setNewDate(undefined);
          setNewTime(null);
          setNewServiceId(null);
        },
      },
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
            Управление бронированиями
          </h1>
          <p className="text-muted-foreground">
            Обзор всех записей и их статусов.
          </p>
        </div>

        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Создать бронь
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Новое бронирование</DialogTitle>
              <DialogDescription>
                Создайте бронирование вручную от имени клиента
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Клиент</label>
                <Select
                  value={bookingForm.userId}
                  onValueChange={(v) =>
                    setBookingForm((f) => ({ ...f, userId: v ?? "" }))
                  }
                  itemToStringLabel={(v) => {
                    const u = users.find((x) => x.id === v);
                    return u?.name || u?.email || v;
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name || u.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Услуга</label>
                <Select
                  value={bookingForm.serviceId}
                  onValueChange={(v) =>
                    setBookingForm((f) => ({
                      ...f,
                      serviceId: v ?? "",
                      slotId: "",
                    }))
                  }
                  itemToStringLabel={(v) =>
                    services.find((s) => s.id === v)?.name ?? v
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Слот</label>
                <Select
                  value={bookingForm.slotId}
                  onValueChange={(v) =>
                    setBookingForm((f) => ({ ...f, slotId: v ?? "" }))
                  }
                  disabled={!bookingForm.serviceId}
                  itemToStringLabel={(v) => {
                    const s = availableSlotsForForm.find((x) => x.id === v);
                    return s ? `${s.date} · ${s.time}` : v;
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        bookingForm.serviceId
                          ? "Выберите слот"
                          : "Сначала выберите услугу"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlotsForForm.length === 0 && (
                      <SelectItem value="__none" disabled>
                        Нет свободных слотов
                      </SelectItem>
                    )}
                    {availableSlotsForForm.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.date} · {s.time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Статус</label>
                <Select
                  value={bookingForm.status}
                  onValueChange={(v) =>
                    setBookingForm((f) => ({
                      ...f,
                      status: v as typeof f.status,
                    }))
                  }
                  itemToStringLabel={(v) => STATUS_LABEL[v] ?? v}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BOOKING_STATUS.PENDING}>
                      Ожидает
                    </SelectItem>
                    <SelectItem value={BOOKING_STATUS.PAID}>
                      Оплачено
                    </SelectItem>
                    <SelectItem value={BOOKING_STATUS.CANCELLED}>
                      Отменено
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={
                  !bookingForm.userId ||
                  !bookingForm.serviceId ||
                  !bookingForm.slotId ||
                  createBooking.isPending
                }
                onClick={handleCreateBooking}
              >
                {createBooking.isPending ? "Создание..." : "Создать"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="min-w-30">Клиент</TableHead>
              <TableHead className="min-w-30">Услуга</TableHead>
              <TableHead className="min-w-27.5">Дата / Время</TableHead>
              <TableHead className="min-w-25">Статус</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookingsLoading && (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-6 rounded" /></TableCell>
                </TableRow>
              ))
            )}
            {!bookingsLoading && bookings.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Бронирований нет
                </TableCell>
              </TableRow>
            )}
            {bookings.map((booking) => {
              const service = booking.expand?.service;
              const slot = booking.expand?.time_slot;
              const user = booking.expand?.user;
              const slotTaken = bookings.some(
                (b) =>
                  b.id !== booking.id &&
                  b.time_slot === booking.time_slot &&
                  b.status !== BOOKING_STATUS.CANCELLED,
              );
              return (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">
                    {user?.name ?? user?.email ?? booking.user}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {service?.name ?? "—"}
                  </TableCell>
                  <TableCell>
                    {slot?.date ?? "—"}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {slot?.time ?? ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === BOOKING_STATUS.PAID
                          ? "default"
                          : booking.status === BOOKING_STATUS.CANCELLED
                            ? "destructive"
                            : "outline"
                      }
                      className={
                        booking.status === BOOKING_STATUS.PAID
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                    >
                      {STATUS_LABEL[booking.status] ?? booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        {booking.status !== BOOKING_STATUS.PAID && (
                          <DropdownMenuItem
                            className="cursor-pointer"
                            disabled={
                              booking.status === BOOKING_STATUS.CANCELLED &&
                              slotTaken
                            }
                            onClick={() =>
                              updateStatus.mutate({
                                id: booking.id,
                                status: BOOKING_STATUS.PAID,
                              })
                            }
                          >
                            Одобрить (paid)
                            {booking.status === BOOKING_STATUS.CANCELLED &&
                              slotTaken && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                  слот занят
                                </span>
                              )}
                          </DropdownMenuItem>
                        )}
                        {booking.status !== BOOKING_STATUS.CANCELLED && (
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive"
                            onClick={() =>
                              updateStatus.mutate({
                                id: booking.id,
                                status: BOOKING_STATUS.CANCELLED,
                              })
                            }
                          >
                            Отменить бронь
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="cursor-pointer text-destructive font-semibold"
                          onClick={() => deleteBooking.mutate(booking.id)}
                        >
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-2 mb-4 gap-3">
          <h2 className="text-xl font-bold tracking-tight">
            Управление доступностью (Слоты)
          </h2>
          <Dialog open={slotOpen} onOpenChange={setSlotOpen}>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Добавить слот
                </Button>
              }
            />
            <DialogContent className="sm:max-w-fit">
              <DialogHeader>
                <DialogTitle>Новый слот</DialogTitle>
                <DialogDescription>
                  Выберите услугу, дату и время для нового слота
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="w-full px-1">
                  <Select
                    value={newServiceId ?? ""}
                    onValueChange={setNewServiceId}
                    itemToStringLabel={(v) =>
                      services.find((s) => s.id === v)?.name ?? v
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите услугу" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Calendar
                  mode="single"
                  locale={ru}
                  selected={newDate}
                  onSelect={setNewDate}
                  className="[--cell-size:min(2.8rem,calc((100vw-5rem)/7))]"
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
                <div className="w-full px-1">
                  <Select value={newTime ?? ""} onValueChange={setNewTime}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите время" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  disabled={
                    !newDate ||
                    !newTime ||
                    !newServiceId ||
                    createSlot.isPending
                  }
                  onClick={handleCreate}
                >
                  {createSlot.isPending ? "Создание..." : "Создать"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="min-w-27.5">Дата</TableHead>
                <TableHead className="min-w-20">Время</TableHead>
                <TableHead className="min-w-30">Услуга</TableHead>
                <TableHead className="min-w-25">Статус</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slotsLoading && (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-6 rounded" /></TableCell>
                  </TableRow>
                ))
              )}
              {!slotsLoading && slots.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    Слоты не найдены
                  </TableCell>
                </TableRow>
              )}
              {slots.map((slot) => {
                const slotBookings: { status: string }[] =
                  slot.expand?.bookings_via_time_slot ?? [];
                const isBooked = slotBookings.some(
                  (b) => b.status !== BOOKING_STATUS.CANCELLED,
                );
                const serviceName = slot.expand?.service?.name ?? "—";
                return (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">{slot.date}</TableCell>
                    <TableCell>{slot.time}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {serviceName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isBooked ? "destructive" : "outline"}
                        className={
                          !isBooked ? "text-green-600 border-green-400" : ""
                        }
                      >
                        {isBooked ? "Занят" : "Свободен"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        disabled={isBooked || deleteSlot.isPending}
                        title={
                          isBooked
                            ? "Нельзя удалить занятый слот"
                            : "Удалить слот"
                        }
                        onClick={() => deleteSlot.mutate(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
