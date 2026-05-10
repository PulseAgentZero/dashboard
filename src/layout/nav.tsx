"use client";

import { usePathname } from "next/navigation";
import { Database, Shell } from "lucide-react";
import SearchInput from "@/components/ui/search-input";

const pageMeta: Record<string, { title: string; crumb: string }> = {
  "/dashboard": { title: "Dashboard", crumb: "Overview" },
  "/dashboard/entities": { title: "Entities", crumb: "Entities" },
  "/dashboard/recommendations": { title: "Recommendations", crumb: "Recommendations" },
  "/dashboard/analytics": { title: "Analytics", crumb: "Analytics" },
  "/dashboard/agent": { title: "Agent", crumb: "Agent" },
  "/dashboard/settings": { title: "Settings", crumb: "Settings" },
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

        {/* Notification bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
          <Shell color="black" strokeWidth={1.5} size={20} />
        </button>

        {/* Connect Data CTA */}
        <button className="flex h-10 items-center gap-1 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-800">
          <Database size={12} />
          <span className="hidden sm:inline text-[14px] mb-0.5">Connect Data</span>
        </button>
      </div>
    </header>
  );
}
