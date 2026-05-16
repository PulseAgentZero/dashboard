"use client";

import { useAuth } from "@/providers/auth-provider";

export function DashboardHeader() {
  const { user, org } = useAuth();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {greeting}{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Here&apos;s what&apos;s happening across your data today.
        </p>
      </div>
      {org && (
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            {org.name}
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 capitalize">
            {org.plan}
          </span>
        </div>
      )}
    </div>
  );
}
