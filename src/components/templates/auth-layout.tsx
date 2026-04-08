import { ReactNode } from "react";
import Link from "next/link";

export function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  linkText: string;
  linkHref: string;
}) {
  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Prime
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Эта система бронирования сэкономила мне бесчисленное количество часов и позволила масштабировать бизнес быстрее, чем когда-либо."
            </p>
            <footer className="text-sm">Алекс Фишер, Владелец студии</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8 flex h-full items-center justify-center relative">
        <Link
          href={linkHref}
          className="absolute right-4 top-4 md:right-8 md:top-8 text-sm font-medium hover:underline underline-offset-4"
        >
          {linkText}
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
