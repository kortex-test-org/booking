import type { ReactNode } from "react";
import { DashboardLayout as LayoutComponent } from "@/components/templates/dashboard-layout";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <LayoutComponent>{children}</LayoutComponent>;
}
