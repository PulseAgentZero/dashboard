"use client";

import { useState } from "react";
import { Loader2, ScrollText, Search } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { FeatureLockPanel } from "@/components/shared/feature-lock-panel";
import { useAuditLogs } from "@/hooks/audit/use-audit";
import { useAuditLogAccess } from "@/hooks/use-audit-log-access";
import { AUDIT_LOGS_PAGE_SIZE } from "@/lib/pagination";
import type { AuditLog } from "@/lib/api/audit-api";

function actionColor(action: string) {
  if (action.startsWith("delete") || action.includes("remove") || action.includes("revoke"))
    return "bg-rose-50 text-rose-700 border border-rose-100/50";
  if (action.startsWith("create") || action.startsWith("invite") || action.startsWith("add"))
    return "bg-emerald-50 text-emerald-700 border border-emerald-100/50";
  if (action.startsWith("update") || action.startsWith("edit") || action.startsWith("change"))
    return "bg-orange-50 text-orange-700 border border-orange-100/40";
  return "bg-slate-100 text-slate-600 border border-slate-200/60";
}

export default function AuditLogsPage() {
  const {
    hasAccess,
    loading: accessLoading,
    selfHosted,
    upgradeHref,
    upgradeLabel,
  } = useAuditLogAccess();

  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAuditLogs(
    {
      page,
      limit: AUDIT_LOGS_PAGE_SIZE,
      action: actionFilter.trim() || undefined,
    },
    hasAccess,
  );

  const logs: AuditLog[] = data?.logs ?? [];
  const total = data?.total ?? 0;

  if (accessLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={28} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-2 sm:px-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Audit logs</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
            Immutable record of actions in your organization.
          </p>
        </div>
        <FeatureLockPanel
          title="Audit logs are locked"
          description={
            selfHosted
              ? "Activate a valid license key on this instance to record and view audit events. Open Settings → License, or purchase a self-hosted license if you do not have one yet."
              : "Audit logs are included on the Pro plan. Upgrade to see who changed connections, API keys, team members, and other workspace settings."
          }
          upgradeHref={upgradeHref}
          upgradeLabel={upgradeLabel}
          secondaryHref={selfHosted ? "/pricing/self-hosted" : "/pricing"}
          secondaryLabel={selfHosted ? "Purchase license" : "View pricing"}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-4 py-2 sm:px-6">
      {/* Search Filter and Title Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Audit logs</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-slate-500 leading-relaxed">
            Full history of actions taken in your organization.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400 transition-colors"
            placeholder="Filter by action (exact)…"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-3.5 sm:px-5">
          <p className="text-sm font-semibold text-slate-800">Events</p>
          {!isLoading && (
            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
              {total.toLocaleString()}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 size={22} className="animate-spin text-orange-600" />
          </div>
        )}

        {!isLoading && logs.length === 0 && (
          <div className="flex flex-col items-center py-12 px-4 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
              <ScrollText size={22} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-800">
              {actionFilter ? "No matching events" : "No audit events yet"}
            </p>
            <p className="mt-1 max-w-xs text-xs text-slate-400 leading-relaxed">
              Actions taken by team members will appear here.
            </p>
          </div>
        )}

        {logs.length > 0 && (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <div key={log.id} className="flex flex-col gap-2 px-4 py-3 sm:px-5 sm:flex-row sm:items-start sm:gap-4">
                <div className="shrink-0 w-fit">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] sm:text-[11px] font-bold tracking-wide font-mono uppercase ${actionColor(log.action)}`}
                  >
                    {log.action}
                  </span>
                </div>
                
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs font-semibold text-slate-800 break-all">
                      {log.user_email ?? "System"}
                    </span>
                    {log.resource_type && (
                      <span className="text-xs text-slate-400">
                        on{" "}
                        <span className="font-mono bg-slate-50 border border-slate-100 rounded px-1 py-0.5 text-[11px] text-slate-700">
                          {log.resource_type}
                          {log.resource_id ? ` #${log.resource_id.slice(0, 8)}` : ""}
                        </span>
                      </span>
                    )}
                  </div>
                  {log.ip_address && (
                    <p className="text-[10px] font-medium text-slate-400">IP: {log.ip_address}</p>
                  )}
                </div>

                <div className="shrink-0 text-[10px] font-medium text-slate-400 sm:mt-0.5">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="px-4 py-3 border-t border-slate-100">
          <Pagination
            page={page}
            pageSize={AUDIT_LOGS_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}