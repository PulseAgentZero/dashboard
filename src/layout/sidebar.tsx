"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bot,
  Link2,
  TrendingUp,
  Code2,
  ChevronLeft,
  ChevronRight,
  GitFork,
  CreditCard,
  Gauge,
  Layers,
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
    items: [{ label: "Dashboard", href: "/dashboard", icon: Gauge }],
  },
  {
    label: "Intelligence",
    items: [
      { label: "Entities", href: "/dashboard/entities", icon: Users },
      { label: "Recommendations", href: "/dashboard/recommendations", icon: Target },
      { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
      { label: "Studio", href: "/dashboard/studio", icon: Code2 },
      { label: "Co-Pilot", href: "/dashboard/agent", icon: Bot },
    ],
  },
  {
    label: "Data & pipeline",
    items: [
      { label: "Connections", href: "/dashboard/connections", icon: Link2, minRole: "manager" },
      { label: "Pipeline", href: "/dashboard/pipeline", icon: GitFork },
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
      { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
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
  collapsed,
}: {
  logoUrl?: string | null;
  label: string;
  collapsed: boolean;
}) {
  const frame = "h-9 w-9";
  const rounded = logoUrl ? "rounded-xl" : "";

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
  size = "h-9 w-9",
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
        className={`${size} shrink-0 rounded-full object-cover ring-2 ring-white shadow-xs`}
      />
    );
  }

  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-[11px] font-bold text-white ring-2 ring-white shadow-xs`}
    >
      {initials || "?"}
    </div>
  );
}

export default function Sidebar() {
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebar();
  const pathname = usePathname();
  const { user, org } = useAuth();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { data: connections } = useConnections();
  const { hasAccess: auditLogsUnlocked } = useAuditLogAccess();

  const connectionDot =
    connections == null
      ? null
      : connections.some((c) => c.status === "active" || c.status === "connected")
        ? "bg-emerald-500"
        : connections.length > 0
          ? "bg-amber-500"
          : "bg-slate-300";

  const displayName = user?.full_name || user?.email || "User";

  const visibleNavGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => canAccessPage(user?.role, item.href)),
    }))
    .filter((group) => group.items.length > 0);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mobileOpen, closeMobile]);

  const railCollapsed = collapsed;

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs lg:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-72 shrink-0 flex-col border-r border-slate-100 bg-white transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:h-screen lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${railCollapsed ? "lg:w-16" : "lg:w-64"}`}
      >
      <button
        type="button"
        onClick={toggle}
        className="absolute -right-3 top-6 z-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-xs transition-colors hover:text-slate-700 lg:flex"
        aria-label={railCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {railCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <Link
        href="/dashboard"
        aria-label="Go to dashboard home"
        onClick={closeMobile}
        className={`flex items-center gap-3 border-b border-slate-100 px-4 py-4.5 transition-colors hover:bg-slate-50/50 ${
          railCollapsed ? "lg:justify-center lg:px-0" : ""
        }`}
      >
        <BrandMark
          logoUrl={org?.logo_url}
          label={org?.name ?? "Entivia"}
          collapsed={railCollapsed}
        />
        <div
          className={`min-w-0 overflow-hidden ${railCollapsed ? "max-lg:block lg:hidden" : ""}`}
        >
          <p className="truncate text-sm font-semibold text-slate-900">
            {org?.name ?? "Entivia"}
          </p>
          <p className="truncate text-[11px] font-medium text-slate-400 mt-0.5">
            {org?.name ? "Workspace" : "Intelligence Platform"}
          </p>
        </div>
      </Link>

      <nav
        data-tour="sidebar-nav"
        className="flex-1 overflow-y-auto py-4 [&::-webkit-scrollbar]:hidden"
      >
        <div className="space-y-5 px-3">
          {visibleNavGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <p
                className={`px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400/80 ${
                  railCollapsed ? "max-lg:block lg:hidden" : ""
                }`}
              >
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href, pathname);
                  const opensDocs = isDocsHref(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={closeMobile}
                        data-tour={
                          href === "/dashboard"
                            ? "nav-dashboard"
                            : href === "/dashboard/connections"
                              ? "nav-connections"
                              : undefined
                        }
                        title={railCollapsed ? label : undefined}
                        {...(opensDocs
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                          active
                            ? "bg-orange-50 text-orange-600 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                        } ${railCollapsed ? "lg:justify-center lg:px-0 lg:h-9" : ""}`}
                      >
                        <div className="relative shrink-0 flex items-center justify-center">
                          <Icon
                            size={18}
                            className={active ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600"}
                          />
                          {href === "/dashboard/connections" && connectionDot && (
                            <span
                              className={`absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-2 ring-white ${connectionDot}`}
                            />
                          )}
                        </div>
                        <span
                          className={`flex min-w-0 flex-1 items-center justify-between truncate ${
                            railCollapsed ? "max-lg:flex lg:hidden" : ""
                          }`}
                        >
                          {label}
                          {href === "/dashboard/audit-logs" && !auditLogsUnlocked && (
                            <Lock
                              size={12}
                              className="shrink-0 text-slate-400 ml-auto"
                              aria-hidden
                            />
                          )}
                        </span>
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
        className={`border-t border-slate-100 px-3 py-4 ${
          railCollapsed ? "lg:flex lg:justify-center" : ""
        }`}
      >
        <div
          className={`flex items-center gap-3 ${railCollapsed ? "max-lg:flex lg:hidden" : ""}`}
        >
          <Link href="/dashboard/settings" className="shrink-0" onClick={closeMobile}>
            <UserAvatar
              imageUrl={user?.profile_image_url}
              name={displayName}
            />
          </Link>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-xs font-semibold text-slate-800">
              {displayName}
            </p>
            <span className="mt-0.5 inline-block rounded-md bg-orange-50 px-1.5 py-0.5 text-[10px] font-bold capitalize text-orange-600 border border-orange-100/50">
              {user?.role || "member"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => logout()}
            disabled={isLoggingOut}
            className="shrink-0 text-slate-400 hover:text-slate-700 disabled:opacity-50 transition-colors p-1"
            aria-label="Log out"
          >
            {isLoggingOut ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <LogOut size={15} />
            )}
          </button>
        </div>
        {railCollapsed && (
          <Link
            href="/dashboard/settings"
            title={displayName}
            onClick={closeMobile}
            className="mx-auto hidden lg:block"
          >
            <UserAvatar
              imageUrl={user?.profile_image_url}
              name={displayName}
            />
          </Link>
        )}
      </div>
    </aside>
    </>
  );
}