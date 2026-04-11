import Link from "next/link";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  linkText: string;
  linkHref: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      {/* Декоративный фон */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-125 h-125 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        {/* Логотип */}
        <Link
          href="/"
          className="flex items-center gap-2 justify-center mb-8 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-black text-lg leading-none">
              P
            </span>
          </div>
          <span className="font-bold text-xl tracking-tighter">Prime.</span>
        </Link>

        {/* Карточка */}
        <div className="bg-background rounded-2xl border shadow-sm p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {children}
        </div>

        {/* Ссылка переключения */}
        <p className="text-center text-sm text-muted-foreground mt-5">
          <Link
            href={linkHref}
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            {linkText}
          </Link>
        </p>
      </div>
    </div>
  );
}
