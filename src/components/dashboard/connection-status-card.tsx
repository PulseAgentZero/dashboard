"use client";

import {
  CheckCircle2,
  Clock,
  Database,
  LockKeyhole,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "@/components/shared/section-heading";
import { connectionsApi } from "@/lib/api/dashboard";
import { useDashboardOverview } from "@/hooks/dashboard/use-dashboard-overview";

function useConnections() {
  return useQuery({
    queryKey: ["connections"],
    queryFn: connectionsApi.list,
    staleTime: 60_000,
    retry: 1,
  });
}

function StatusIcon({ status }: { status: string }) {
  if (status === "connected" || status === "active")
    return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
  if (status === "error" || status === "failed")
    return <XCircle className="h-4 w-4 text-rose-500" />;
  return <Clock className="h-4 w-4 text-amber-500" />;
}

export function ConnectionStatusCard() {
  const { data: connections, isLoading: connLoading } = useConnections();
  const { data: overview } = useDashboardOverview();
  const conn = connections?.[0];
  const run = overview?.last_pipeline_run;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading eyebrow="Setup" title="Connection status" />

      <div className="grid gap-3">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <Database size={17} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Database
            </p>
            {connLoading ? (
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-slate-200" />
            ) : conn ? (
              <p className="mt-1 truncate text-sm font-semibold text-slate-950">
                {conn.db_type} · {conn.database_name ?? conn.host ?? "connected"}
              </p>
            ) : (
              <p className="mt-1 text-sm font-semibold text-slate-400">
                No connection configured
              </p>
            )}
          </div>
          {conn && <StatusIcon status={conn.status} />}
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
            <LockKeyhole size={17} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Credential storage
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              Encrypted at rest
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        {[
          {
            title: "Business context",
            done: true,
            description: "Goals, industry, key entities, and operational language.",
          },
          {
            title: "Data connection",
            done: !!conn,
            description: conn
              ? `${conn.db_type} connection verified.`
              : "Connect a database to start profiling.",
          },
          {
            title: "Pipeline run",
            done: !!run && run.status === "succeeded",
            description: run
              ? `Last run ${run.status} · ${(run.entities_scored ?? 0).toLocaleString()} entities scored.`
              : "No pipeline runs yet.",
          },
        ].map((step) => (
          <div key={step.title} className="flex gap-3">
            {step.done ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
            )}
            <div>
              <p className="text-sm font-semibold text-slate-950">{step.title}</p>
              <p className="mt-0.5 text-sm leading-5 text-slate-500">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
