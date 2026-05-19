"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  useConnections,
  useConnectionCatalog,
  useTestConnection,
  useDeleteConnection,
} from "@/hooks/connections/use-connections";
import type { ConnectionResponse } from "@/types/connections";
import { ConnectorIcon } from "@/components/connectors/connector-icon";
import { DashboardDocsLink } from "@/components/dashboard/docs-link";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { useUsage } from "@/hooks/usage/use-usage";
import { useAuth } from "@/providers/auth-provider";
import { useSchemaMappings } from "@/hooks/schema-mappings/use-schema-mappings";
import { supportsEntityMapping } from "@/lib/connectors/pipeline-supported";
import { planDisplayName } from "@/lib/plan-utils";

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  active: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  connected: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  failed: { pill: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
  pending: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
};

function isHealthyStatus(status: string) {
  const s = status?.toLowerCase();
  return s === "active" || s === "connected";
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const styles = STATUS_STYLES[s] ?? {
    pill: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  };
  const Icon =
    s === "active" || s === "connected"
      ? CheckCircle2
      : s === "failed"
        ? XCircle
        : RefreshCw;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${styles.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      <Icon size={11} className="-ml-0.5" />
      {status}
    </span>
  );
}

function SummaryPill({
  label,
  value,
  sub,
  accent = "default",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "default" | "success" | "warning" | "danger";
}) {
  const accentCls = {
    default: "border-slate-200 bg-white",
    success: "border-emerald-200 bg-emerald-50/50",
    warning: "border-amber-200 bg-amber-50/50",
    danger: "border-rose-200 bg-rose-50/50",
  }[accent];
  const valueCls = {
    default: "text-slate-900",
    success: "text-emerald-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
  }[accent];

  return (
    <div
      className={`min-w-[120px] flex-1 rounded-xl border px-4 py-3 shadow-sm ${accentCls}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${valueCls}`}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-500">{sub}</p>}
    </div>
  );
}

function ConnectionCard({
  conn,
  displayName,
  onTest,
  onDelete,
  testing,
  needsMapping,
}: {
  conn: ConnectionResponse;
  displayName: string;
  onTest: () => void;
  onDelete: () => void;
  testing: boolean;
  needsMapping?: boolean;
}) {
  const meta = [displayName, conn.host, conn.database_name].filter(Boolean);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white shadow-sm ring-1 ring-slate-100">
              <ConnectorIcon connectorType={conn.connector_type} size={26} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-900">{conn.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                {meta.join(" · ")}
              </p>
            </div>
          </div>
          <StatusBadge status={conn.status} />
        </div>

        {conn.last_test_error && (
          <p className="mt-3 rounded-lg border border-rose-100 bg-rose-50/80 px-3 py-2 text-xs leading-relaxed text-rose-700">
            {conn.last_test_error}
          </p>
        )}

        {needsMapping && (
          <Link
            href={`/dashboard/connections/${conn.id}/map`}
            className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/90 px-3 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-100"
          >
            <Layers size={14} className="shrink-0 text-amber-700" />
            Map your user table to enable the pipeline
            <ArrowRight size={12} className="ml-auto shrink-0" />
          </Link>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
          <div className="rounded-lg bg-slate-50 px-2.5 py-2">
            <dt className="font-medium text-slate-400">Last test</dt>
            <dd className="mt-0.5 font-medium text-slate-700">
              {conn.last_tested_at
                ? new Date(conn.last_tested_at).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : "Never"}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 px-2.5 py-2">
            <dt className="font-medium text-slate-400">Added</dt>
            <dd className="mt-0.5 font-medium text-slate-700">
              {new Date(conn.created_at).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
        {needsMapping && (
          <Link
            href={`/dashboard/connections/${conn.id}/map`}
            className="mr-auto inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Layers size={12} />
            Configure mapping
          </Link>
        )}
        <button
          type="button"
          disabled={testing}
          onClick={onTest}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          {testing ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <RefreshCw size={12} />
          )}
          Test connection
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 shadow-sm hover:bg-rose-50"
        >
          <Trash2 size={12} />
          Remove
        </button>
      </div>
    </article>
  );
}

export function ConnectionsPage() {
  const { org } = useAuth();
  const { data: connections, isLoading } = useConnections();
  const { data: mappings } = useSchemaMappings();
  const { data: catalog } = useConnectionCatalog();
  const { data: usage } = useUsage();
  const { mutate: testConn, isPending: testing, variables: testingId } =
    useTestConnection();
  const { mutate: deleteConn } = useDeleteConnection();
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();

  const plan = usage?.plan ?? org?.plan ?? "free";
  const isUnlimited = plan.toLowerCase() === "pro" || plan.toLowerCase() === "enterprise";
  const list = connections ?? [];

  const stats = useMemo(() => {
    let healthy = 0;
    let failed = 0;
    for (const c of list) {
      if (isHealthyStatus(c.status)) healthy += 1;
      else if (c.status?.toLowerCase() === "failed") failed += 1;
    }
    return { total: list.length, healthy, failed };
  }, [list]);

  const connectionSlot = usage?.limits?.connections;
  const atLimit =
    !isUnlimited &&
    connectionSlot?.limit != null &&
    connectionSlot.used >= connectionSlot.limit;

  function getDisplayName(connectorType: string): string {
    return (
      catalog?.find((c) => c.connector_type === connectorType)?.display_name ??
      connectorType
    );
  }

  const popularConnectors = catalog?.slice(0, 4) ?? [];

  function connectionNeedsMapping(conn: ConnectionResponse): boolean {
    if (!supportsEntityMapping(conn.connector_type)) return false;
    const mapping = mappings?.find((m) => m.connection_id === conn.id);
    return !mapping?.entity_table || !mapping?.entity_id_col;
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
              <Database size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Data sources
            </p>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Data connections
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Connect read-only sources for entity profiling. Credentials are encrypted; queries
            never leave your network on self-hosted deployments.
          </p>
        </div>
        <Link
          href="/dashboard/connections/new"
          data-tour="connect-data"
          className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors ${
            atLimit
              ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
          aria-disabled={atLimit}
          onClick={(e) => atLimit && e.preventDefault()}
        >
          <Plus size={16} />
          Add connection
        </Link>
      </div>

      {!isLoading && list.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryPill label="Total" value={stats.total} sub="Active data sources" />
          <SummaryPill
            label="Healthy"
            value={stats.healthy}
            sub="Passed last connection test"
            accent={stats.healthy === stats.total ? "success" : "default"}
          />
          <SummaryPill
            label="Needs attention"
            value={stats.failed}
            sub="Failed or unreachable"
            accent={stats.failed > 0 ? "danger" : "success"}
          />
          <SummaryPill
            label="Plan allowance"
            value={
              isUnlimited || connectionSlot?.limit == null
                ? "∞"
                : `${connectionSlot.used} / ${connectionSlot.limit}`
            }
            sub={
              isUnlimited
                ? "Pro — unlimited connections"
                : `${planDisplayName(plan)} plan connection slots`
            }
            accent={atLimit ? "warning" : isUnlimited ? "success" : "default"}
          />
        </div>
      )}

      {atLimit && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50/80 to-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100">
              <AlertTriangle size={18} className="text-amber-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">Connection limit reached</p>
              <p className="mt-0.5 text-xs text-amber-800/90">
                Your {planDisplayName(plan)} plan allows {connectionSlot?.limit} connections.
                Upgrade to Pro for unlimited sources.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/plan"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white hover:bg-amber-800"
          >
            Upgrade plan
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Connections panel */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-800">Your connections</p>
            <p className="text-[11px] text-slate-500">
              {isLoading
                ? "Loading…"
                : list.length === 0
                  ? "No sources connected yet"
                  : `${list.length} source${list.length === 1 ? "" : "s"} configured`}
            </p>
          </div>
          {!isLoading && list.length > 0 && (
            <Link
              href="/dashboard/connections/new"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Plus size={13} />
              Add another
            </Link>
          )}
        </div>

        <div className="p-5">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                />
              ))}
            </div>
          )}

          {!isLoading && list.length === 0 && (
            <div className="flex flex-col items-center px-4 py-16 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
                <Database size={32} className="text-indigo-400" />
              </div>
              <p className="mt-5 text-base font-semibold text-slate-800">No connections yet</p>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                Add PostgreSQL, Snowflake, BigQuery, or another supported source to start
                profiling entities and generating recommendations.
              </p>
              <Link
                href="/dashboard/connections/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
              >
                <Plus size={16} />
                Add your first connection
              </Link>

              {popularConnectors.length > 0 && (
                <div className="mt-10 w-full max-w-lg">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Popular sources
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {popularConnectors.map((item) => (
                      <Link
                        key={item.connector_type}
                        href={`/dashboard/connections/new/${item.connector_type}`}
                        className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                      >
                        <ConnectorIcon connectorType={item.connector_type} size={22} />
                        <span className="text-xs font-semibold text-slate-700">
                          {item.display_name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && list.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {list.map((conn) => (
                <ConnectionCard
                  key={conn.id}
                  conn={conn}
                  displayName={getDisplayName(conn.connector_type)}
                  needsMapping={connectionNeedsMapping(conn)}
                  testing={testing && testingId === conn.id}
                  onTest={() => testConn(conn.id)}
                  onDelete={() =>
                    requestDeleteConfirm({
                      title: "Remove connection",
                      description: `Remove "${conn.name}"? Pulse will stop profiling data from this source. This cannot be undone.`,
                      confirmLabel: "Remove",
                      onConfirm: () => deleteConn(conn.id),
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 text-sm text-slate-600">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
            <Lock size={16} className="text-emerald-600" />
          </div>
          <p className="max-w-2xl leading-relaxed">
            Credentials are encrypted at rest. Use SELECT-only database users. Self-hosted
            deployments keep query traffic inside your network.
          </p>
        </div>
        <DashboardDocsLink
          href="/docs/data-sources"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Data sources docs
          <ArrowRight size={12} />
        </DashboardDocsLink>
      </div>

      {deleteConfirmModal}
    </div>
  );
}
