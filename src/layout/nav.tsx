"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Database, Menu } from "lucide-react";
import SearchInput from "@/components/ui/search-input";
import { NotificationBell } from "@/components/nav/notification-bell";
import { hasMinRole } from "@/lib/permissions";
import { useSidebar } from "@/lib/sidebar-context";
import { useAuth } from "@/providers/auth-provider";

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
  return match ? pageMeta[match] : { title: "Entivia", crumb: "" };
}

export default function Nav() {
  const pathname = usePathname();
  const { title, crumb } = getPageMeta(pathname);
  const { toggleMobile } = useSidebar();
  const { user } = useAuth();
  const canConnectData = hasMinRole(user?.role, "manager");

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4">
      {/* Left: Platform root & Dynamic breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleMobile}
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium font-sans tracking-tight">
          <Link
            href="/"
            className="font-bold text-neutral-900 transition-colors hover:opacity-80"
          >
            Entivia
          </Link>
          {crumb && (
            <>
              <span className="text-neutral-300 font-normal">/</span>
              <span className="font-semibold text-neutral-600 truncate max-w-35 sm:max-w-xs">
                {crumb}
              </span>
            </>
          )}
        </div>

        <h1 className="sr-only">{title}</h1>
      </div>

      {/* Right: Operational utility controls */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-3">
          <SearchInput placeholder="Search recommendations…" />
          <NotificationBell />
        </div>

        {canConnectData && (
          <Link
            href="/dashboard/connections"
            data-tour="connect-data"
            className="flex h-8 w-8 sm:w-auto items-center justify-center gap-1.5 rounded-md bg-orange-600 px-0 sm:px-3 text-xs font-semibold text-white transition-colors hover:bg-orange-700 active:bg-orange-800 shadow-sm"
          >
            <Database size={13} />
            <span className="hidden sm:inline">Connect Data</span>
          </Link>
        )}
      </div>
    </header>
  );
}