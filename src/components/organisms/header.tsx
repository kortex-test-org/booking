"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const isLoggedInMock = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-black leading-none">P</span>
            </div>
            Prime.
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            {!isLoggedInMock ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hidden sm:inline-flex font-medium">
                    Войти
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="font-medium shadow-sm">Старт</Button>
                </Link>
              </>
            ) : (
              <Link href="/">
                <Button variant="ghost" className="font-medium text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4 mr-2" />
                  Выход
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
