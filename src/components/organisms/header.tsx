"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { logout } from "@/services/auth";

export function Header() {
  const { isValid, isSuperuser, record, isInitialized } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
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
          {isInitialized && isValid && (
            <nav className="flex items-center gap-1 animate-in fade-in duration-300">
              {isSuperuser ? (
                <Link href="/admin">
                  <Button variant="ghost" className="font-medium">
                    Админка
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button variant="ghost" className="font-medium">
                    Мои записи
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!isInitialized ? (
            <>
              <Skeleton className="hidden sm:block h-9 w-16 rounded-md" />
              <Skeleton className="h-9 w-16 rounded-md" />
            </>
          ) : !isValid ? (
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
              <span className="hidden sm:inline text-xs text-muted-foreground font-medium">
                {isSuperuser
                  ? "Администратор"
                  : (record?.name ?? record?.email)}
              </span>
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
      </div>
    </header>
  );
}
