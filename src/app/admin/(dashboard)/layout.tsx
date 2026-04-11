"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import {
  AdminMobileSidebarTrigger,
  AdminSidebar,
} from "@/components/organisms/admin-sidebar";
import { Header } from "@/components/organisms/header";
import { useAuth } from "@/lib/auth-context";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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

      <div className="flex-1 container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        <div className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
          Админ Панель
        </div>

        <div className="flex gap-6 items-start">
          <AdminSidebar />

          <main className="flex-1 min-w-0">
            <div className="bg-background rounded-2xl border shadow-sm p-4 md:p-8 min-h-125">
              {children}
            </div>
          </main>
        </div>
      </div>

      <AdminMobileSidebarTrigger />
    </div>
  );
}
