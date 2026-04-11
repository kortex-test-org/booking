import type { ReactNode } from "react";
import { MainLayout } from "@/components/templates/main-layout";

interface BookingLayoutProps {
  children: ReactNode;
}

export default function BookingLayout({ children }: BookingLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
