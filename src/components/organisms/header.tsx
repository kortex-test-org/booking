"use client";

import { Crown, LayoutDashboard, LogOut, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { logoutUser, logoutAdmin } from "@/services/auth";

export function Header() {
  const { isUserValid, isAdminValid, userRecord, isInitialized } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logoutUser();
    router.push("/");
  }

  function handleAdminLogout() {
    logoutAdmin();
    setMobileOpen(false);
  }

  const displayName = userRecord?.["name"] ?? userRecord?.["email"] ?? "";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        {/* Logo + Desktop nav */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-black leading-none">
                P
              </span>
            </div>
            Prime.
          </Link>

          {/* Desktop nav */}
          {isInitialized && isUserValid && (
            <nav className="hidden sm:flex items-center gap-1 animate-in fade-in duration-300">
              <Link href="/dashboard">
                <Button variant="ghost" className="font-medium">
                  Мои записи
                </Button>
              </Link>
            </nav>
          )}
        </div>

        {/* Desktop right */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          {isInitialized && isAdminValid && (
            <div className="relative group">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <Crown className="w-4 h-4 text-yellow-500" />
                </Button>
              </Link>
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 pointer-events-none scale-95 origin-top group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 transition-all duration-200">
                <div className="rounded-lg bg-popover shadow-md ring-1 ring-foreground/10 min-w-44">
                  <Link
                    href="/admin"
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm hover:bg-accent transition-colors rounded-t-lg"
                  >
                    Панель управления
                  </Link>
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    Выйти из админки
                  </button>
                </div>
              </div>
            </div>
          )}
          {!isInitialized ? (
            <>
              <Skeleton className="h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
            </>
          ) : !isUserValid ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium shadow-sm">Старт</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <Link
                href="/dashboard/settings"
                className="hidden sm:inline text-xs text-muted-foreground font-medium hover:text-foreground transition-colors"
              >
                {displayName}
              </Link>
              <Button
                variant="ghost"
                className="font-medium text-muted-foreground hover:text-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выход
              </Button>
            </div>
          )}
        </div>

        {/* Mobile right */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          {!isInitialized ? (
            <Skeleton className="h-9 w-9 rounded-md" />
          ) : !isUserValid ? (
            <Link href="/login">
              <Button size="sm" className="font-medium">
                Войти
              </Button>
            </Link>
          ) : (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Меню" />
                }
              >
                <Menu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="border-b px-4 py-4">
                  <SheetTitle className="text-left">Меню</SheetTitle>
                  {displayName && (
                    <p className="text-xs text-muted-foreground text-left truncate">
                      {displayName}
                    </p>
                  )}
                </SheetHeader>

                <nav className="flex flex-col p-3 gap-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                    Мои записи
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                  >
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    Настройки профиля
                  </Link>

                  {isAdminValid && (
                    <>
                      <div className="my-1 border-t" />
                      <Link
                        href="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
                      >
                        <Crown className="w-4 h-4 text-yellow-500" />
                        Панель управления
                      </Link>
                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Выйти из админки
                      </button>
                    </>
                  )}
                </nav>

                <div className="mt-auto border-t p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Выход
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
