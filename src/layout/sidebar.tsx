"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  Cable,
  BarChart3,
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Cpu,
  CreditCard,
  Gauge,
  Layers,
  LayoutDashboard,
  Inbox,
  Loader2,
  Lock,
  LogOut,
  ScrollText,
  Settings,
  Target,
  Terminal,
  BookOpen,
  UserCog,
  Users,
} from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { canAccessPage, type Role } from "@/lib/permissions";
import { useAuth } from "@/providers/auth-provider";
import { useLogout } from "@/hooks/auth/use-logout";
import { useConnections } from "@/hooks/connections/use-connections";
import { useAuditLogAccess } from "@/hooks/use-audit-log-access";
import { isDocsHref } from "@/components/dashboard/docs-link";
import { BladeFan } from "../../public/icon/bladeFan";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  minRole?: Role;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Entities", href: "/dashboard/entities", icon: Users },
      { label: "Recommendations", href: "/dashboard/recommendations", icon: Target },
      { label: "Analytics", href: "/dashboard/analytics", icon: ChartNoAxesCombined },
      { label: "Studio", href: "/dashboard/studio", icon: BarChart3 },
      { label: "Agent", href: "/dashboard/agent", icon: Bot },
    ],
  },
  {
    label: "Data & pipeline",
    items: [
      { label: "Connections", href: "/dashboard/connections", icon: Cable, minRole: "manager" },
      { label: "Pipeline", href: "/dashboard/pipeline", icon: Cpu },
      { label: "Data mapping", href: "/dashboard/schema-mappings", icon: Layers, minRole: "manager" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Alerts", href: "/dashboard/alerts", icon: Bell, minRole: "manager" },
      { label: "Audit logs", href: "/dashboard/audit-logs", icon: ScrollText, minRole: "admin" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { label: "Notifications", href: "/dashboard/notifications", icon: Inbox },
      { label: "Usage", href: "/dashboard/usage", icon: Gauge },
      { label: "Plan & billing", href: "/dashboard/plan", icon: CreditCard, minRole: "manager" },
      { label: "Team & roles", href: "/dashboard/team", icon: UserCog, minRole: "manager" },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    label: "Developer",
    items: [
      { label: "Playground", href: "/dashboard/playground", icon: Terminal, minRole: "manager" },
      { label: "Documentation", href: "/docs", icon: BookOpen },
    ],
  },
];

function isActive(href: string, pathname: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function BrandMark({
  logoUrl,
  label,
  collapsed,
}: {
  logoUrl?: string | null;
  label: string;
  collapsed: boolean;
}) {
  const frame = collapsed ? "h-9 w-9" : "h-9 w-9";
  const rounded = logoUrl ? "rounded-lg" : "";

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt=""
        className={`${frame} ${rounded} shrink-0 object-cover`}
      />
    );
  }

  return (
    <div className={`flex ${frame} shrink-0 items-center justify-center`}>
      <BladeFan />
    </div>
  );
}

function UserAvatar({
  imageUrl,
  name,
  size = "h-8 w-8",
}: {
  imageUrl?: string | null;
  name: string;
  size?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt=""
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-teal-400 text-[10px] font-bold text-white ring-2 ring-white`}
    >
      {initials || "?"}
    </div>
  );
}

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const pathname = usePathname();
  const { user, org } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: connections } = useConnections();
  const { hasAccess: auditLogsUnlocked } = useAuditLogAccess();

  const connectionDot =
    connections == null
      ? null
      : connections.some((c) => c.status === "active" || c.status === "connected")
        ? "bg-emerald-400"
        : connections.length > 0
          ? "bg-amber-400"
          : "bg-slate-300";

  const displayName = user?.full_name || user?.email || "User";

  const visibleNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessPage(user?.role, item.href)),
    }))
    .filter((group) => group.items.length > 0);

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

      <Link
        href="/dashboard"
        aria-label="Go to dashboard home"
        className={`flex items-center gap-3 border-b border-slate-200 px-4 py-5 transition-colors hover:bg-slate-50/80 ${
          collapsed ? "justify-center px-0" : ""
        }`}
      >
        <BrandMark
          logoUrl={org?.logo_url}
          label={org?.name ?? "Entivia"}
          collapsed={collapsed}
        />
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="truncate text-[13px] font-semibold text-slate-800">
              {org?.name ?? "Entivia"}
            </p>
            <p className="truncate text-[11px] text-slate-500">
              {org?.name ? "Workspace" : "Intelligence Platform"}
            </p>
          </div>
        )}
      </Link>

      <nav
        data-tour="sidebar-nav"
        className="flex-1 overflow-y-auto py-3 [&::-webkit-scrollbar]:hidden"
      >
        <div className="space-y-4 px-2">
          {visibleNavGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href, pathname);
                  const opensDocs = isDocsHref(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        data-tour={
                          href === "/dashboard"
                            ? "nav-dashboard"
                            : href === "/dashboard/connections"
                              ? "nav-connections"
                              : undefined
                        }
                        title={collapsed ? label : undefined}
                        {...(opensDocs
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-colors ${
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
                          <span className="flex min-w-0 flex-1 items-center gap-1.5 truncate font-medium">
                            {label}
                            {href === "/dashboard/audit-logs" && !auditLogsUnlocked && (
                              <Lock
                                size={12}
                                className="shrink-0 text-slate-400"
                                aria-hidden
                              />
                            )}
                          </span>
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
          <Link href="/dashboard/settings" title={displayName}>
            <UserAvatar
              imageUrl={user?.profile_image_url}
              name={displayName}
            />
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/dashboard/settings" className="shrink-0">
              <UserAvatar
                imageUrl={user?.profile_image_url}
                name={displayName}
              />
            </Link>
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="truncate text-xs font-medium text-slate-700">
                {displayName}
              </p>
              <span className="mt-0.5 inline-block rounded bg-blue-50 px-1.5 py-px text-[10px] font-medium capitalize text-blue-600">
                {user?.role || "member"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              disabled={isLoggingOut}
              className="shrink-0 text-slate-500 hover:text-slate-800 disabled:opacity-50"
              aria-label="Log out"
            >
              {isLoggingOut ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <LogOut size={14} />
              )}
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
