import { Suspense } from "react";
import { DashboardContent } from "./_components/DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
