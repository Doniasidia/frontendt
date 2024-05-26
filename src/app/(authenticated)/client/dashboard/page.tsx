import Breadcrumbs from "@/components/breadcrumbs";
import CardWrapper from "./_components/cards";
import { Suspense } from "react";
import {CardsSkeleton, LatestInvoicesSkeleton, RevenueChartSkeleton} from "@/components/skeletons";
import RevenueChart from "@/app/(authenticated)/client/dashboard/_components/revenue-chart";
import LatestInvoices from "@/app/(authenticated)/client/dashboard/_components/latest-invoices";

export default async function Page() {
  return (
      <main>
          <Breadcrumbs
              breadcrumbs={[{label: "Tableau de bord", href: "/client/dashboard"}]}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Suspense fallback={<CardsSkeleton/>}>
                  <CardWrapper/>
              </Suspense>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
              <Suspense fallback={<RevenueChartSkeleton/>}>
                  <RevenueChart/>
              </Suspense>
              <Suspense fallback={<LatestInvoicesSkeleton/>}>
                  <LatestInvoices/>
              </Suspense>
          </div>
      </main>
  );
}
