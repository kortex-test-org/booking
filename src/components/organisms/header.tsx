"use client";

import { Crown, LogOut } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { logoutUser, logoutAdmin } from "@/services/auth";

export function Header() {
  const { isUserValid, isAdminValid, userRecord, isInitialized } = useAuth();
  const isAnyLoggedIn = isUserValid || isAdminValid;

  function handleLogout() {
    logoutUser();
    window.location.href = "/";
  }

  function handleAdminLogout() {
    logoutAdmin();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
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
          {isInitialized && isAnyLoggedIn && (
            <nav className="flex items-center gap-1 animate-in fade-in duration-300">
              {isUserValid && (
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium">
                    Мои записи
                  </Button>
                </Link>
              )}
              {isAdminValid && (
                <Link href="/admin">
                  <Button variant="ghost" className="font-medium">
                    Админка
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
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
                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
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
              <Skeleton className="hidden sm:block h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
            </>
          ) : !isUserValid ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex font-medium"
                >
                  Войти
                </Button>
              </Link>
              <Link href="/register">
                <Button className="font-medium shadow-sm">Старт</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              {isUserValid && (
                <>
                  <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
                    {userRecord?.name ?? userRecord?.email}
                  </span>
                  <Button
                    variant="ghost"
                    className="font-medium text-muted-foreground hover:text-foreground"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выход
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
