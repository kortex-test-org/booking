import { format } from "date-fns";
import { ServiceCard } from "@/components/molecules/service-card";
import { MainLayout } from "@/components/templates/main-layout";
import { BOOKING_STATUS } from "@/lib/constants";
import { getServices, type Service } from "@/services/services";
import { getTimeSlotsServer } from "@/services/time-slots";

interface BookingExpand {
  status: string;
}

type ServiceWithAvailability = Service & { hasAvailableSlots: boolean };

export const dynamic = "force-dynamic";

export default async function Home() {
  let availableServices: ServiceWithAvailability[] = [];
  try {
    const services = await getServices();
    const slots = await getTimeSlotsServer();

    const todayStr = format(new Date(), "yyyy-MM-dd");
    availableServices = services.map((service) => {
      const serviceSlots = slots.filter(
        (s) => s.service === service.id && s.date >= todayStr,
      );
      const hasAvailableSlots = serviceSlots.some((slot) => {
        const bookings: BookingExpand[] =
          slot.expand?.bookings_via_time_slot ?? [];
        return !bookings.some(
          (booking) => booking.status !== BOOKING_STATUS.CANCELLED,
        );
      });
      return { ...service, hasAvailableSlots };
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
  return (
    <MainLayout>
      <section className="relative overflow-hidden w-full pt-16 md:pt-32 pb-16 md:pb-24">
        {/* Abstract Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

        <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight lg:leading-[1.1] max-w-3xl mb-6">
            Бронируйте услуги{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
              быстро и удобно
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Современная платформа для записи на наши премиум-услуги. Выберите
            удобное время, забронируйте слот и управляйте своими записями в
            одном месте.
          </p>
        </div>
      </section>

      <section
        className="container mx-auto px-4 md:px-8 py-16 md:py-24"
        id="services"
      >
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Наши услуги
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Выберите подходящую услугу из списка ниже. Мы предлагаем различные
            форматы работы для решения ваших задач.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {availableServices.length > 0 ? (
            availableServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                price={service.price}
                duration_minutes={service.duration_minutes}
                hasAvailableSlots={service.hasAvailableSlots}
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-8">
              Услуги пока не добавлены.
            </p>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
