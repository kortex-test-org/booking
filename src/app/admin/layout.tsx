import { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/organisms/header";
import { LayoutDashboard, Users, CalendarDays, Settings, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />
      
      <div className="flex-1 container mx-auto px-4 md:px-8 py-8 max-w-5xl">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
          Админ Панель
        </div>
        
        {/* Main Content */}
        <main className="w-full">
          <div className="bg-background rounded-2xl border shadow-sm p-6 md:p-8 min-h-[500px]">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
}
