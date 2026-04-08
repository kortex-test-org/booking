"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/organisms/header";
import { useAuth } from "@/lib/auth-context";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isValid, isSuperuser } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isValid || !isSuperuser)) {
      router.replace("/admin/login");
    }
  }, [mounted, isValid, isSuperuser, router]);

  if (!mounted || !isValid || !isSuperuser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <div className="flex-1 container mx-auto px-4 md:px-8 py-8 max-w-5xl">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
          Админ Панель
        </div>

        <main className="w-full">
          <div className="bg-background rounded-2xl border shadow-sm p-6 md:p-8 min-h-125">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
