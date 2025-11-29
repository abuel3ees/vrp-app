"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive"; // ✅ FIXED IMPORT
import { DataTable } from "@/components/data-table";

import { usePage } from "@inertiajs/react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function DashboardPage() {
  const {
    drivers = 0,
    vehicles = 0,
    deliveries = 0,
    recentDeliveries = [],
    roadCounts = {},
  } = usePage().props;

  // Safe fallbacks in case any category is missing
  const {
    avenues = 0,
    streets = 0,
    paths = 0,
    highways = 0,
    links = 0,
    municipal = 0,
    plazas = 0,
    roundabouts = 0,
  } = roadCounts;

  // Prepare data for the summary cards
  const summary = {
    drivers,
    vehicles,
    deliveries,
    totalRoads:
      avenues +
      streets +
      paths +
      highways +
      links +
      municipal +
      plazas +
      roundabouts,
  };


  const staticDeliveryData = [
  { date: "2025-01-01", completed: 12, failed: 1, total: 13 },
  { date: "2025-01-02", completed: 15, failed: 0, total: 15 },
  { date: "2025-01-03", completed: 9,  failed: 3, total: 12 },
  { date: "2025-01-04", completed: 18, failed: 2, total: 20 },
  { date: "2025-01-05", completed: 22, failed: 1, total: 23 },
  { date: "2025-01-06", completed: 17, failed: 4, total: 21 },
  { date: "2025-01-07", completed: 25, failed: 0, total: 25 },
];
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">

            {/* SUMMARY CARDS */}
            <SectionCards data={summary} />

            {/* DELIVERY CHART */}
            <div className="px-4 lg:px-6">
  <ChartAreaInteractive data={staticDeliveryData} />
</div>

            {/* RECENT DELIVERIES TABLE */}
            <div className="px-4 lg:px-6">
              <DataTable data={recentDeliveries} />
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}