import Breadcrumbs from "@/components/breadcrumbs";
import CardWrapper from "./components/adminCards";
import { Suspense } from "react";
import { CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/components/skeletons";
import RevenueChart from "@/app/(authenticated)/client/dashboard/_components/revenue-chart";
import LatestInvoices from "@/app/(authenticated)/client/dashboard/_components/latest-invoices";
import ClientSubscriberChart from "./components/user-statistics"; // Import the chart component

export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[{ label: "Tableau de bord", href: "/admin/dashboard" }]}
      />
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3"> 
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <ClientSubscriberChart /> 
        </Suspense>
      </div>
    </main>
  );
}
