"use client";

import { RequireRole } from "@/components/auth/require-role";
import Link from "next/link";
import { AlertTriangle, Layers, Loader2, Pencil, Plus } from "lucide-react";
import { useConnections } from "@/hooks/connections/use-connections";
import {
  useDeleteSchemaMapping,
  useSchemaMappings,
} from "@/hooks/schema-mappings/use-schema-mappings";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { DashboardPageShell } from "@/components/layout/dashboard-page-shell";
import { supportsEntityMapping } from "@/lib/connectors/pipeline-supported";

export default function Page() {
  return (
    <RequireRole minRole="manager">
      <SchemaMappingsPage />
    </RequireRole>
  );
}

function SchemaMappingsPage() {
  const { data: connections, isLoading: loadingConn } = useConnections();
  const { data: mappings, isLoading: loadingMap } = useSchemaMappings();
  const { mutate: remove, isPending: removing, variables: removingId } =
    useDeleteSchemaMapping();
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();

  const isLoading = loadingConn || loadingMap;
  const list = mappings ?? [];

  const mappableConnections =
    connections?.filter((c) => supportsEntityMapping(c.connector_type)) ?? [];

  const unmappedConnections = mappableConnections.filter(
    (c) =>
      !list.some(
        (m) =>
          m.connection_id === c.id &&
          m.entity_table &&
          m.entity_id_col,
      ),
  );

  return (
    <DashboardPageShell className="space-y-6 py-2">
      {/* Header Panel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-600 text-white shadow-xs">
              <Layers size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Configuration
            </p>
          </div>
          <h1 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Data mapping
          </h1>
          <p className="mt-1 max-w-2xl text-xs sm:text-sm text-slate-500 leading-relaxed">
            Tell Entivia which table holds your users or customers and which columns to use
            for identity and risk signals. The pipeline uses this on every run.
          </p>
        </div>
      </div>

      {/* Non-AI Simple Alert Banner */}
      {unmappedConnections.length > 0 && (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-200 text-slate-600 mt-0.5 sm:mt-0">
              <AlertTriangle size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Schema mapping required</p>
              <p className="mt-0.5 max-w-xl text-xs text-slate-500 leading-relaxed">
                These sources are connected but not mapped yet. Complete mapping before running
                the pipeline.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {unmappedConnections.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/connections/${c.id}/map`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors"
                    >
                      <Plus size={12} />
                      Map {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5 sm:px-5">
          <p className="text-sm font-semibold text-slate-800">Active mappings</p>
          <p className="text-[11px] text-slate-500">
            {isLoading ? "Loading…" : `${list.length} mapping${list.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-3">
          {isLoading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
            ))}

          {!isLoading && list.length === 0 && (
            <div className="flex flex-col items-center py-12 px-4 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
                <Layers size={22} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">No mappings yet</p>
              <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
                Connect a database, then use the guided wizard to choose your main user table.
              </p>
              <Link
                href="/dashboard/connections/new"
                className="mt-4 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Add a connection
              </Link>
            </div>
          )}

          {list.map((m) => {
            const conn = connections?.find((c) => c.id === m.connection_id);
            return (
              <article
                key={m.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <p className="text-sm font-semibold text-slate-900">
                      {conn?.name ?? "Connection"}
                    </p>
                    <p className="font-mono text-xs sm:text-sm text-slate-700 truncate bg-slate-50 border border-slate-100 rounded-md px-2 py-1 w-fit max-w-full">
                      {m.entity_table}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                        id: {m.entity_id_col}
                      </span>
                      {m.entity_name_col && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600">
                          name: {m.entity_name_col}
                        </span>
                      )}
                      {m.signal_columns &&
                        Object.keys(m.signal_columns).length > 0 && (
                          <span className="rounded-md bg-orange-50 px-2 py-0.5 font-medium text-[10px] text-orange-700 border border-orange-100/60">
                            {Object.keys(m.signal_columns).length} signals
                          </span>
                        )}
                    </div>
                  </div>
                  
                  {/* Actions Row */}
                  <div className="flex items-center gap-2 border-t border-slate-100/80 pt-3 sm:border-t-0 sm:pt-0 sm:shrink-0">
                    {conn && supportsEntityMapping(conn.connector_type) && (
                      <Link
                        href={`/dashboard/connections/${conn.id}/map`}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                      >
                        <Pencil size={11} />
                        Edit
                      </Link>
                    )}
                    <button
                      type="button"
                      disabled={removing && removingId === m.id}
                      onClick={() =>
                        requestDeleteConfirm({
                          title: "Remove data mapping",
                          description: `Remove the mapping for "${m.entity_table}"? The pipeline will need a new mapping before it can run.`,
                          confirmLabel: "Remove",
                          onConfirm: () => remove(m.id),
                        })
                      }
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 shadow-xs hover:bg-rose-50 transition-colors disabled:opacity-50"
                    >
                      {removing && removingId === m.id ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {deleteConfirmModal}
    </DashboardPageShell>
  );
}