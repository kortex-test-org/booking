import { MainLayout } from "@/components/templates/main-layout";
import { ServiceCard } from "@/components/molecules/service-card";
import { Button } from "@/components/ui/button";

const MOCK_SERVICES = [
  {
    id: "srv_1",
    title: "Консультация (Онлайн)",
    description: "Индивидуальная онлайн-консультация по вашему запросу. Подробный разбор ситуации и план действий.",
    price: 30,
    duration: 60,
    category: "Консультации",
  },
  {
    id: "srv_2",
    title: "Офлайн встреча",
    description: "Личная встреча в нашем комфортном офисе. Полное погружение в проект и детальное обсуждение.",
    price: 100,
    duration: 120,
    category: "Встречи",
  },
  {
    id: "srv_3",
    title: "Экспресс Аудит",
    description: "Быстрый разрез и анализ текущей ситуации. Подходит для срочных вопросов.",
    price: 15,
    duration: 30,
    category: "Аналитика",
  },
  {
    id: "srv_4",
    title: "Разработка стратегии",
    description: "Создание пошаговой стратегии развития вашего продукта с нуля до запуска.",
    price: 250,
    duration: 240,
    category: "Стратегия",
  },
];

export default function Home() {
  return (
    <MainLayout>
      <section className="relative overflow-hidden w-full pt-16 md:pt-32 pb-16 md:pb-24">
        {/* Abstract Background */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-4 md:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
            ✨ Версия MVP 1.0
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight lg:leading-[1.1] max-w-3xl mb-6">
            Бронируйте услуги <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">быстро и удобно</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            Современная платформа для записи на наши премиум-услуги. Выберите удобное время, забронируйте слот и управляйте своими записями в одном месте.
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all text-base px-8 h-12">
              Смотреть услуги
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-12">
              О нас
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 py-16 md:py-24" id="services">
        <div className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Наши услуги</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Выберите подходящую услугу из списка ниже. Мы предлагаем различные форматы работы для решения ваших задач.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {MOCK_SERVICES.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
