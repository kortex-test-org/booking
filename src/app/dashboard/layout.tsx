import { DashboardLayout as LayoutComponent } from "@/components/templates/dashboard-layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <LayoutComponent>{children}</LayoutComponent>;
}
