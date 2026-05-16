"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  Cable,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
  Settings,
  Target,
  UserCog,
  Users,
} from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/auth/use-logout";
import { useConnections } from "@/hooks/connections/use-connections";
import { BladeFan } from "../../public/icon/bladeFan";

const navGroups = [
  {
    // label: "Intelligence",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Entities", href: "/dashboard/entities", icon: Users },
      { label: "Recommendations", href: "/dashboard/recommendations", icon: Target },
      { label: "Analytics", href: "/dashboard/analytics", icon: ChartNoAxesCombined },
      { label: "Agent", href: "/dashboard/agent", icon: Bot },
      { label: "Onboarding", href: "/dashboard/onboarding", icon: ListChecks },
      { label: "Connections", href: "/dashboard/connections", icon: Cable },
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell },
      { label: "Team & Roles", href: "/dashboard/team", icon: UserCog },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  }
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const { user } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: connections } = useConnections();

  const connectionDot =
    connections == null
      ? null
      : connections.some((c) => c.status === "active" || c.status === "connected")
        ? "bg-emerald-400"
        : connections.length > 0
          ? "bg-amber-400"
          : "bg-slate-300";

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        onClick={toggle}
        className="absolute -right-3 top-7 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-700"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      <div
        className={`flex items-center gap-3 border-b border-slate-200 px-4 py-5 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center">
          <BladeFan />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="truncate text-[13px] font-semibold text-slate-800">
              Pulse
            </p>
            <p className="truncate text-[11px] text-slate-500">
              Intelligence Platform
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-5 px-2">
          {navGroups.map((group, index) => (
            <div key={index}>
              <ul className="space-y-1">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href, pathname);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        title={collapsed ? label : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                          active
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        } ${collapsed ? "justify-center px-0" : ""}`}
                      >
                        <div className="relative shrink-0">
                          <Icon
                            size={17}
                            className={active ? "text-blue-600" : ""}
                          />
                          {href === "/dashboard/connections" && connectionDot && (
                            <span
                              className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white ${connectionDot}`}
                            />
                          )}
                        </div>
                        {!collapsed && (
                          <span className="truncate font-medium">{label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div
        className={`border-t border-slate-200 px-3 py-4 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        {collapsed ? (
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-blue-500 to-teal-400" />
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 rounded-full bg-linear-to-br from-blue-500 to-teal-400" />
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-slate-700">
                {user?.full_name || user?.email || "User"}
              </p>
              <span className="mt-0.5 inline-block rounded bg-blue-50 px-1.5 py-px text-[10px] font-medium text-blue-600 capitalize">
                {user?.role || "member"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="shrink-0 text-[11px] font-medium text-slate-500 hover:text-slate-800 disabled:opacity-50"
            >
              {isLoggingOut ? "…" : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
