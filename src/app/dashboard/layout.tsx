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
        <div className="flex h-screen overflow-hidden bg-[#f6f8fb] text-slate-900">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <VerifyEmailBanner />
            <SetupBanner />
            <ProductTour />
            <Nav />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
