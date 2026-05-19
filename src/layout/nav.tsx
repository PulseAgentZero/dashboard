"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Database } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import { NotificationBell } from "@/components/nav/notification-bell";
import { RetakeTourButton } from "@/components/tour/retake-tour-button";

const pageMeta: Record<string, { title: string; crumb: string }> = {
  "/dashboard": { title: "Dashboard", crumb: "Overview" },
  "/dashboard/entities": { title: "Entities", crumb: "Entities" },
  "/dashboard/recommendations": { title: "Recommendations", crumb: "Recommendations" },
  "/dashboard/analytics": { title: "Analytics", crumb: "Analytics" },
  "/dashboard/studio": { title: "Studio", crumb: "Studio" },
  "/dashboard/agent": { title: "Agent", crumb: "Agent" },
  "/dashboard/pipeline": { title: "Pipeline", crumb: "Pipeline" },
  "/dashboard/schema-mappings": { title: "Schema mappings", crumb: "Schema mappings" },
  "/dashboard/audit-logs": { title: "Audit logs", crumb: "Audit logs" },
  "/dashboard/notifications": { title: "Notifications", crumb: "Notifications" },
  "/dashboard/connections": { title: "Connections", crumb: "Connections" },
  "/dashboard/alerts": { title: "Alerts", crumb: "Alerts" },
  "/dashboard/team": { title: "Team & Roles", crumb: "Team & Roles" },
  "/dashboard/settings": { title: "Settings", crumb: "Settings" },
  "/dashboard/api-keys": { title: "API Keys", crumb: "API Keys" },
  "/dashboard/webhooks": { title: "Webhooks", crumb: "Webhooks" },
  "/dashboard/playground": { title: "Playground", crumb: "Playground" },
};

const sortedRoutes = Object.keys(pageMeta).sort((a, b) => b.length - a.length);

function getPageMeta(pathname: string) {
  if (pageMeta[pathname]) return pageMeta[pathname];
  const match = sortedRoutes.find((route) => pathname.startsWith(route + "/"));
  return match ? pageMeta[match] : { title: "Pulse", crumb: "" };
}

export default function Nav() {
  const pathname = usePathname();
  const { title, crumb } = getPageMeta(pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      {/* Breadcrumb + title */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs text-slate-500 font-medium">Pulse</span>
        {crumb && (
          <>
            <span className="text-[13px] text-slate-300">/</span>
            <span className="text-[13px] font-semibold text-slate-700">{crumb}</span>
          </>
        )}
        <h1 className="sr-only">{title}</h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <SearchInput placeholder="Search recommendations…" />

        <NotificationBell />

        <RetakeTourButton variant="icon" label="Product tour" />

        {/* Connect Data CTA */}
        <Link
          href="/dashboard/connections"
          data-tour="connect-data"
          className="flex h-10 items-center gap-1 rounded-lg bg-blue-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800"
        >
          <Database size={12} />
          <span className="hidden sm:inline text-[14px] mb-0.5">Connect Data</span>
        </Link>
      </div>
    </header>
  );
}
