import { BookingCard, type BookingStatus } from "@/components/molecules/booking-card";

// Моковые данные бронирований
const MOCK_BOOKINGS = [
  {
    id: "B-29001",
    serviceName: "Стратегическая сессия (Офлайн)",
    date: "14 апреля 2026",
    time: "15:00 - 17:00",
    status: "paid" as BookingStatus,
    price: 250,
  },
  {
    id: "B-29002",
    serviceName: "Онлайн консультация",
    date: "18 апреля 2026",
    time: "10:00 - 11:00",
    status: "pending" as BookingStatus,
    price: 30,
  },
  {
    id: "B-28501",
    serviceName: "Экспресс Аудит",
    date: "2 апреля 2026",
    time: "12:00 - 12:30",
    status: "paid" as BookingStatus,
    price: 15,
  },
  {
    id: "B-28400",
    serviceName: "Обучение команды",
    date: "25 марта 2026",
    time: "10:00 - 14:00",
    status: "cancelled" as BookingStatus,
    price: 300,
  },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Мои бронирования</h1>
        <p className="text-muted-foreground">Здесь отображается история ваших записей и их текущий статус.</p>
      </div>

      {MOCK_BOOKINGS.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
          {MOCK_BOOKINGS.map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10">
          <p className="text-muted-foreground mb-4">У вас пока нет активных бронирований</p>
        </div>
      )}
    </div>
  );
}
