"use client";

import { BarChart2, CalendarCheck, LogOut, Menu, Scissors, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logoutAdmin } from "@/services/auth";

function handleAdminLogout() {
  logoutAdmin();
  window.location.href = "/admin/login";
}

const NAV_ITEMS = [
  { href: "/admin", label: "Бронирования", icon: CalendarCheck, exact: true },
  { href: "/admin/services", label: "Услуги", icon: Scissors, exact: false },
  { href: "/admin/statistics", label: "Статистика", icon: BarChart2, exact: false },
];

interface NavLinksProps {
  onNavigate?: () => void;
}

function NavLinks({ onNavigate }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex md:flex-col w-52 shrink-0 gap-2">
      <NavLinks />
      <div className="mt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
          onClick={handleAdminLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Выйти из админки
        </Button>
      </div>
    </aside>
  );
}

interface MobileNavContentProps {
  onClose: () => void;
}

function MobileNavContent({ onClose }: MobileNavContentProps) {
  const pathname = usePathname();
  return (
    <>
      <nav className="flex flex-col px-4 pt-6 pb-2 gap-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-4 rounded-xl px-5 py-4 text-base font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground bg-muted hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 pb-8 pt-2 flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl text-base gap-2 text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleAdminLogout}
        >
          <LogOut className="h-5 w-5" />
          Выйти из админки
        </Button>
        <SheetClose
          render={
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-base gap-2"
            />
          }
        >
          <X className="h-5 w-5" />
          Закрыть
        </SheetClose>
      </div>
    </>
  );
}

export function AdminMobileSidebarTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="default"
            size="icon"
            className="md:hidden fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg"
            aria-label="Меню"
          />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="p-0 rounded-t-2xl"
      >
        <MobileNavContent onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
