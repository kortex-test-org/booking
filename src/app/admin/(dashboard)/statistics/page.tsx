"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BOOKING_STATUS } from "@/lib/constants";
import { useBookings } from "@/queries/bookings";
import { useServices } from "@/queries/services";
import type { Booking } from "@/services/bookings";
import type { TimeSlot } from "@/services/time-slots";

type Period = "day" | "week" | "month" | "year";
type Direction = "past" | "future";

const PERIOD_LABEL: Record<Period, string> = {
  day: "День",
  week: "Неделя",
  month: "Месяц",
  year: "Год",
};


type BookingExpanded = Booking & {
  expand?: {
    time_slot?: TimeSlot;
  };
};

function getBookingDate(booking: BookingExpanded): Date {
  const slot = booking.expand?.time_slot;
  if (slot?.date) {
    return new Date(`${slot.date}T${slot.time ?? "00:00"}:00`);
  }
  return new Date(booking.created);
}

function getPeriodRange(
  period: Period,
  direction: Direction,
): { start: Date; end: Date } {
  const now = new Date();
  if (direction === "past") {
    const start = new Date(now);
    if (period === "day") start.setDate(start.getDate() - 1);
    else if (period === "week") start.setDate(start.getDate() - 7);
    else if (period === "month") start.setDate(start.getDate() - 30);
    else start.setFullYear(start.getFullYear() - 1);
    return { start, end: now };
  }
  const end = new Date(now);
  if (period === "day") end.setDate(end.getDate() + 1);
  else if (period === "week") end.setDate(end.getDate() + 7);
  else if (period === "month") end.setDate(end.getDate() + 30);
  else end.setFullYear(end.getFullYear() + 1);
  return { start: now, end };
}

function getChartSteps(period: Period): number {
  if (period === "day") return 24;
  if (period === "week") return 7;
  if (period === "month") return 30;
  return 12;
}

function formatDateKey(date: Date, period: Period): string {
  if (period === "day") {
    return `${String(date.getHours()).padStart(2, "0")}:00`;
  }
  if (period === "year") {
    return date.toLocaleDateString("ru-RU", { month: "short", year: "2-digit" });
  }
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  loading?: boolean;
}

function StatCard({ title, value, sub, loading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        {sub && !loading && (
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [direction, setDirection] = useState<Direction>("past");

  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const { data: services = [] } = useServices();

  const serviceMap = useMemo(
    () => new Map(services.map((s) => [s.id, s])),
    [services],
  );

  const expandedBookings = bookings as BookingExpanded[];

  const periodRange = useMemo(
    () => getPeriodRange(period, direction),
    [period, direction],
  );

  const paidBookings = useMemo(
    () => expandedBookings.filter((b) => b.status === BOOKING_STATUS.PAID),
    [expandedBookings],
  );

  const periodBookings = useMemo(
    () =>
      expandedBookings.filter((b) => {
        const date = getBookingDate(b);
        return date >= periodRange.start && date <= periodRange.end;
      }),
    [expandedBookings, periodRange],
  );

  const periodPaid = useMemo(
    () => periodBookings.filter((b) => b.status === BOOKING_STATUS.PAID),
    [periodBookings],
  );

  const periodPending = useMemo(
    () => periodBookings.filter((b) => b.status === BOOKING_STATUS.PENDING),
    [periodBookings],
  );

  const periodRevenue = useMemo(
    () =>
      periodPaid.reduce(
        (sum, b) => sum + (serviceMap.get(b.service)?.price ?? 0),
        0,
      ),
    [periodPaid, serviceMap],
  );

const chartData = useMemo(() => {
    const { start } = periodRange;
    const steps = getChartSteps(period);
    const buckets = new Map<
      string,
      { paid: number; cancelled: number; pending: number }
    >();

    for (let i = 0; i < steps; i++) {
      const d = new Date(start);
      if (period === "day") d.setHours(d.getHours() + i);
      else if (period === "year") d.setMonth(d.getMonth() + i);
      else d.setDate(d.getDate() + i);
      buckets.set(formatDateKey(d, period), {
        paid: 0,
        cancelled: 0,
        pending: 0,
      });
    }

    for (const booking of expandedBookings) {
      const date = getBookingDate(booking);
      if (date < periodRange.start || date > periodRange.end) continue;
      const key = formatDateKey(date, period);
      const bucket = buckets.get(key);
      if (!bucket) continue;
      if (booking.status === BOOKING_STATUS.PAID) bucket.paid++;
      else if (booking.status === BOOKING_STATUS.CANCELLED) bucket.cancelled++;
      else bucket.pending++;
    }

    return Array.from(buckets.entries()).map(([label, counts]) => ({
      label,
      ...counts,
    }));
  }, [expandedBookings, period, periodRange]);

  const revenueChartData = useMemo(() => {
    const { start } = periodRange;
    const steps = getChartSteps(period);
    const buckets = new Map<string, number>();

    for (let i = 0; i < steps; i++) {
      const d = new Date(start);
      if (period === "day") d.setHours(d.getHours() + i);
      else if (period === "year") d.setMonth(d.getMonth() + i);
      else d.setDate(d.getDate() + i);
      buckets.set(formatDateKey(d, period), 0);
    }

    for (const booking of paidBookings) {
      const date = getBookingDate(booking);
      if (date < periodRange.start || date > periodRange.end) continue;
      const key = formatDateKey(date, period);
      const svc = serviceMap.get(booking.service);
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + (svc?.price ?? 0));
      }
    }

    return Array.from(buckets.entries()).map(([label, revenue]) => ({
      label,
      revenue,
    }));
  }, [paidBookings, serviceMap, period, periodRange]);

  const topServices = useMemo(() => {
    const counts = new Map<
      string,
      { name: string; bookings: number; revenue: number }
    >();
    for (const b of periodPaid) {
      const svc = serviceMap.get(b.service);
      const name = svc?.name ?? b.service;
      const existing = counts.get(b.service) ?? {
        name,
        bookings: 0,
        revenue: 0,
      };
      existing.bookings++;
      existing.revenue += svc?.price ?? 0;
      counts.set(b.service, existing);
    }
    return Array.from(counts.values())
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 6);
  }, [periodPaid, serviceMap]);

const loading = bookingsLoading;
  const revenueTitle =
    direction === "future" ? "Ожидаемый доход" : "Доход";
  const fourthCard =
    direction === "future"
      ? { title: "Ожидает оплаты", value: periodPending.length }
      : { title: "Всего броней", value: periodBookings.length };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
          Статистика
        </h1>
        <p className="text-muted-foreground">
          Обзор ключевых показателей и графиков.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex rounded-lg border p-0.5 gap-0.5">
          <Button
            variant={direction === "past" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDirection("past")}
          >
            Прошлое
          </Button>
          <Button
            variant={direction === "future" ? "default" : "ghost"}
            size="sm"
            onClick={() => setDirection("future")}
          >
            Будущее
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Период:</span>
          <Select
            value={period}
            onValueChange={(v) => setPeriod(v as Period)}
          >
            <SelectTrigger className="w-32">
              <SelectValue>{PERIOD_LABEL[period]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">День</SelectItem>
              <SelectItem value="week">Неделя</SelectItem>
              <SelectItem value="month">Месяц</SelectItem>
              <SelectItem value="year">Год</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Оплачено" value={periodPaid.length} loading={loading} />
        <StatCard
          title={revenueTitle}
          value={`\u20ac${periodRevenue.toFixed(2)}`}
          loading={loading}
        />
        <StatCard
          title="Всего броней"
          value={periodBookings.length}
          loading={loading}
        />
        <StatCard {...fourthCard} loading={loading} />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            Брони —{" "}
            <span className="text-muted-foreground font-normal">
              {direction === "past" ? "прошлые" : "будущие"},{" "}
              {PERIOD_LABEL[period].toLowerCase()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={chartData}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="gradCancelled"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  name="Оплачено"
                  stroke="#22c55e"
                  fill="url(#gradPaid)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground justify-center">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-0.5 bg-green-500" />
              Оплачено
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {revenueTitle} по времени —{" "}
            <span className="text-muted-foreground font-normal">
              {PERIOD_LABEL[period].toLowerCase()}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart
                data={revenueChartData}
                margin={{ top: 4, right: 8, left: -4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `\u20ac${v}`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => {
                    const num = typeof value === "number" ? value : 0;
                    return [`\u20ac${num.toFixed(2)}`, revenueTitle];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name={revenueTitle}
                  stroke="var(--primary)"
                  fill="url(#gradRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Топ услуг по броням</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : topServices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Нет данных
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={topServices}
                margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={90}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => [value ?? 0, "Броней"]}
                />
                <Bar
                  dataKey="bookings"
                  name="Броней"
                  radius={[0, 4, 4, 0]}
                  fill="var(--primary)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            Доход по услугам (оплаченные брони)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : topServices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">
              Нет данных
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={topServices}
                margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `\u20ac${v}`}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  formatter={(value) => {
                    const num = typeof value === "number" ? value : 0;
                    return [`\u20ac${num.toFixed(2)}`, "Доход"];
                  }}
                />
                <Bar
                  dataKey="revenue"
                  name="Доход"
                  radius={[4, 4, 0, 0]}
                  fill="#22c55e"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
