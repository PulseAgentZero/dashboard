"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bubbles,
  FlameKindling,
  Angry,
  Antenna,
  Birdhouse,
  Earth,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { BladeFan } from "../../public/icon/bladeFan";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Bubbles },
  { label: "Entities", href: "/dashboard/entities", icon: FlameKindling },
  { label: "Recommendations", href: "/dashboard/recommendations", icon: Angry },
  { label: "Analytics", href: "/dashboard/analytics", icon: Antenna },
  { label: "Agent", href: "/dashboard/agent", icon: Birdhouse },
  { label: "Settings", href: "/dashboard/settings", icon: Earth },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? "w-16" : "w-58"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-7 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:text-slate-700"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {/* Org logo + name */}
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
            <p className="truncate text-[13px] font-semibold text-slate-800">Pulse</p>
            <p className="truncate text-[11px] text-slate-500">Intelligence Platform</p>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href, pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`flex items-center gap-4 rounded-lg px-3 py-2.5 text-[13px] transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon
                    size={17}
                    className={`shrink-0 ${active ? "text-blue-600" : ""}`}
                  />
                  {!collapsed && (
                    <span className="truncate font-medium">{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + role badge */}
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
              <p className="truncate text-xs font-medium text-slate-700">Admin User</p>
              <span className="mt-0.5 inline-block rounded bg-blue-50 px-1.5 py-px text-[10px] font-medium text-blue-600">
                Admin
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
