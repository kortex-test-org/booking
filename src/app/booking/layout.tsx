import { MainLayout } from "@/components/templates/main-layout";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
