"use client";

import { CheckCircle2, Clock, Database, XCircle, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";
import { connectionsApi } from "@/lib/api/dashboard";

function useConnections() {
  const enabled = useAuthEnabled();

  return useQuery({
    queryKey: ["connections"],
    queryFn: connectionsApi.list,
    enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

function StatusDot({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === "connected" || s === "active" || s === "succeeded")
    return <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />;
  if (s === "error" || s === "failed")
    return <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />;
  return <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />;
}

function Item({
  icon: Icon,
  label,
  value,
  status,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  status?: string;
}) {
  return (
    /* 
      Optimized Item Layout: 
      - Adjusts padding slightly for tight viewports.
      - Uses flex-row layout throughout but relies on text truncation to handle text pressure gracefully.
    */
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 sm:px-4">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white border border-slate-200 text-slate-500">
        <Icon size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 truncate">
          {label}
        </p>
        <p className="mt-0.5 truncate text-xs sm:text-sm font-semibold text-slate-800" title={value}>
          {value}
        </p>
      </div>
      {status && <StatusDot status={status} />}
    </div>
  );
}

export function PipelineStatusCard() {
  const { data: connections, isLoading: connLoading } = useConnections();
  const { data: overview } = useDashboardOverview();

  const conn = connections?.[0];
  const run = overview?.last_pipeline_run;

  const steps = [
    {
      icon: Database,
      label: "Connection",
      value: connLoading
        ? "Loading…"
        : conn
          ? `${conn.db_type} · ${conn.database_name ?? conn.host ?? "connected"}`
          : "No connection configured",
      status: conn?.status ?? (connLoading ? "pending" : "none"),
    },
    {
      icon: CheckCircle2,
      label: "Credentials",
      value: "Encrypted at rest (Fernet)",
      status: "connected",
    },
    {
      icon: Zap,
      label: "Last pipeline run",
      value: run
        ? `${(run.entities_scored ?? 0).toLocaleString()} entities · ${run.status}`
        : "No runs yet",
      status: run?.status ?? "none",
    },
    {
      icon: Clock,
      label: "Completed",
      value: run?.completed_at
        ? new Date(run.completed_at).toLocaleString()
        : "—",
    },
  ];

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      {/* Header layout adjustment to keep the state badge alongside text */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            System
          </p>
          <h2 className="mt-0.5 text-base font-semibold text-slate-900 leading-tight sm:leading-normal">
            Pipeline & connection status
          </h2>
        </div>
        {run && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize shrink-0 ${
              run.status === "succeeded"
                ? "bg-emerald-50 text-emerald-700"
                : run.status === "failed"
                  ? "bg-rose-50 text-rose-700"
                  : "bg-amber-50 text-amber-700"
            }`}
          >
            {run.status}
          </span>
        )}
      </div>

      {/* 
        Responsive Grid Strategy:
        - grid-cols-1: Single column stack on narrow phones (stops squeezing content side-by-side prematurely).
        - xs:grid-cols-2: Transitions cleanly to 2 columns on typical smartphones and small tablets.
        - lg:grid-cols-4: Opens to full 4-column row layout on large laptop/desktop screens.
      */}
      <div className="grid grid-cols-1 gap-2.5 xs:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <Item key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}