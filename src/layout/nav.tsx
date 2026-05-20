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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-orange-100 bg-white px-4 lg:px-6">
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={toggleMobile}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-orange-50 hover:text-orange-700 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {/* Mobile: current page name only */}
        {crumb && (
          <span className="text-[13px] font-semibold text-slate-700 lg:hidden">{crumb}</span>
        )}

        {/* Desktop: Entivia / crumb */}
        <Link
          href="/"
          aria-label="Go to Entivia home"
          className="hidden lg:inline text-xs font-semibold text-orange-600 transition-colors hover:text-orange-700"
        >
          Entivia
        </Link>
        {crumb && (
          <span className="hidden lg:flex items-center gap-2">
            <span className="text-[13px] text-orange-200">/</span>
            <span className="text-[13px] font-semibold text-slate-700">{crumb}</span>
          </span>
        )}

        <h1 className="sr-only">{title}</h1>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Desktop-only controls */}
        <div className="hidden lg:flex items-center gap-2">
          <SearchInput placeholder="Search recommendations…" />
          <NotificationBell />
        </div>

        {canConnectData && (
          <Link
            href="/dashboard/connections"
            data-tour="connect-data"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm shadow-orange-600/15 transition-colors hover:bg-orange-700 active:bg-orange-800 lg:h-10 lg:w-auto lg:gap-2 lg:px-4"
          >
            <Database size={14} />
            <span className="hidden lg:inline text-[13px] font-semibold leading-none">Connect Data</span>
          </Link>
        )}
      </div>
    </header>
  );
}
