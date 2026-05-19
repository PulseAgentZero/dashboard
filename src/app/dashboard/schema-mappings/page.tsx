"use client";

import Link from "next/link";
import { Layers, Loader2, Pencil, Plus } from "lucide-react";
import { useConnections } from "@/hooks/connections/use-connections";
import {
  useDeleteSchemaMapping,
  useSchemaMappings,
} from "@/hooks/schema-mappings/use-schema-mappings";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { DashboardPageShell } from "@/components/layout/dashboard-page-shell";
import { supportsEntityMapping } from "@/lib/connectors/pipeline-supported";

export default function SchemaMappingsPage() {
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
    <DashboardPageShell className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
              <Layers size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Configuration
            </p>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Data mapping
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Tell Entivia which table holds your users or customers and which columns to use
            for identity and risk signals. The pipeline uses this on every run.
          </p>
        </div>
      </div>

      {unmappedConnections.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-5 py-4">
          <p className="text-sm font-semibold text-amber-900">Connections need mapping</p>
          <p className="mt-0.5 text-xs text-amber-800/90">
            These sources are connected but not mapped yet. Complete mapping before running
            the pipeline.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {unmappedConnections.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/connections/${c.id}/map`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-900"
                >
                  <Plus size={12} />
                  Map {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">Active mappings</p>
          <p className="text-[11px] text-slate-500">
            {isLoading ? "Loading…" : `${list.length} mapping${list.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="p-5 space-y-3">
          {isLoading &&
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}

          {!isLoading && list.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center">
              <Layers size={28} className="text-slate-200" />
              <p className="mt-2 text-sm font-medium text-slate-600">No mappings yet</p>
              <p className="mt-1 max-w-md text-xs text-slate-500">
                Connect a database, then use the guided wizard to choose your main user
                table.
              </p>
              <Link
                href="/dashboard/connections/new"
                className="mt-4 text-sm font-semibold text-indigo-600 hover:underline"
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
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {conn?.name ?? "Connection"}
                    </p>
                    <p className="mt-1 font-mono text-sm text-slate-800">{m.entity_table}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-slate-600">
                        id: {m.entity_id_col}
                      </span>
                      {m.entity_name_col && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-slate-600">
                          name: {m.entity_name_col}
                        </span>
                      )}
                      {m.signal_columns &&
                        Object.keys(m.signal_columns).length > 0 && (
                          <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700">
                            {Object.keys(m.signal_columns).length} signals
                          </span>
                        )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {conn && supportsEntityMapping(conn.connector_type) && (
                      <Link
                        href={`/dashboard/connections/${conn.id}/map`}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
                      className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
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
