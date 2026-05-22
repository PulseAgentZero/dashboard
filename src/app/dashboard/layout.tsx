"use client";

import { useLayoutEffect } from "react";
import { SidebarProvider } from "@/lib/sidebar-context";
import Sidebar from "@/layout/sidebar";
import Nav from "@/layout/nav";
import AuthGuard from "@/components/auth/auth-guard";
import { InactivityMonitor } from "@/components/auth/inactivity-monitor";
import VerifyEmailBanner from "@/components/auth/verify-email-banner";
import { SetupBanner } from "@/components/dashboard/setup-banner";
import { ProductTour } from "@/components/tour/product-tour";
import { FirstRunOverlay } from "@/components/tour/first-run-overlay";

function useDashboardLightTheme() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "docs-dark");
    root.style.colorScheme = "light";
  }, []);
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useDashboardLightTheme();

  return (
    <AuthGuard>
      <InactivityMonitor />
      <SidebarProvider>
        <div className="flex min-h-[100dvh] h-[100dvh] overflow-hidden bg-[#f6f8fb] text-slate-900">
          <Sidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col pt-14">
            <Nav />
            <VerifyEmailBanner />
            <SetupBanner />
            <FirstRunOverlay />
            <ProductTour />
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
