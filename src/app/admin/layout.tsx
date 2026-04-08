import { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/organisms/header";
import { LayoutDashboard, Users, CalendarDays, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      
      <div className="flex-1 flex flex-col md:flex-row container mx-auto px-4 md:px-8 py-8 gap-8">
        {/* Admin Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="mb-4 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Админ Панель
          </div>
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              Бронирования
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl font-medium transition-colors"
            >
              <CalendarDays className="w-5 h-5" />
              Слоты времени
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl font-medium transition-colors"
            >
              <Users className="w-5 h-5" />
              Клиенты
            </Link>
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl font-medium transition-colors"
            >
              <Settings className="w-5 h-5" />
              Настройки
            </Link>
            <div className="hidden md:block my-4 border-t" />
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 hover:bg-destructive/10 text-destructive rounded-xl font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Выход
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-background rounded-2xl border shadow-sm p-6 md:p-8 min-h-[500px]">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
