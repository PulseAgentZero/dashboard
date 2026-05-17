"use client";

import { useState } from "react";
import { Layers, Loader2, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api/client";

type SchemaMapping = {
  id: string;
  connection_id: string;
  table_name: string;
  entity_id_column: string;
  feature_columns: string[] | null;
  label_column: string | null;
  created_at: string;
};

function toList(raw: unknown): SchemaMapping[] {
  if (Array.isArray(raw)) return raw as SchemaMapping[];
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    for (const k of ["schema_mappings", "mappings", "data", "items"]) {
      if (Array.isArray(r[k])) return r[k] as SchemaMapping[];
    }
  }
  return [];
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400";

function AddMappingForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const { mutate: create, isPending } = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      api.post<SchemaMapping>("/schema-mappings", body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["schema-mappings"] });
      toast.success("Schema mapping created");
      onClose();
    },
    onError: () => toast.error("Failed to create schema mapping"),
  });

  const [f, setF] = useState({
    table_name: "",
    entity_id_column: "",
    label_column: "",
    feature_columns: "",
  });

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    create({
      table_name: f.table_name,
      entity_id_column: f.entity_id_column,
      label_column: f.label_column || null,
      feature_columns: f.feature_columns
        ? f.feature_columns.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/40 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">New schema mapping</p>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-700">Cancel</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Table name</label>
          <input className={inputCls} required value={f.table_name} onChange={(e) => setF((p) => ({ ...p, table_name: e.target.value }))} placeholder="customers" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Entity ID column</label>
          <input className={inputCls} required value={f.entity_id_column} onChange={(e) => setF((p) => ({ ...p, entity_id_column: e.target.value }))} placeholder="id" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Label column</label>
          <input className={inputCls} value={f.label_column} onChange={(e) => setF((p) => ({ ...p, label_column: e.target.value }))} placeholder="churn_label (optional)" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Feature columns</label>
          <input className={inputCls} value={f.feature_columns} onChange={(e) => setF((p) => ({ ...p, feature_columns: e.target.value }))} placeholder="age, tenure, spend (comma-separated)" />
        </div>
      </div>
      <div className="flex justify-end border-t border-slate-200 pt-3">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {isPending && <Loader2 size={13} className="animate-spin" />}
          {isPending ? "Creating…" : "Create mapping"}
        </button>
      </div>
    </form>
  );
}

export default function SchemaMappingsPage() {
  const qc = useQueryClient();
  const { data: raw, isLoading } = useQuery({
    queryKey: ["schema-mappings"],
    queryFn: () => api.get<unknown>("/schema-mappings"),
    staleTime: 30_000,
    retry: 1,
  });
  const { mutate: remove, isPending: removing, variables: removingId } = useMutation({
    mutationFn: (id: string) => api.delete<void>(`/schema-mappings/${id}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["schema-mappings"] });
      toast.success("Mapping removed");
    },
    onError: () => toast.error("Failed to remove mapping"),
  });

  const [showForm, setShowForm] = useState(false);
  const mappings = toList(raw);

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Schema mappings</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Define how your database tables map to Pulse entities and features.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-800">Mappings</p>
            {!isLoading && mappings.length > 0 && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
                {mappings.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowForm(true)}
            disabled={showForm}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus size={12} /> Add mapping
          </button>
        </div>

        <div className="space-y-3 p-5">
          {showForm && <AddMappingForm onClose={() => setShowForm(false)} />}

          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}

          {!isLoading && mappings.length === 0 && !showForm && (
            <div className="flex flex-col items-center py-10 text-center">
              <Layers size={28} className="text-slate-200" />
              <p className="mt-2 text-sm font-medium text-slate-500">No schema mappings</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Add a mapping to tell Pulse how to interpret your database tables.
              </p>
            </div>
          )}

          {mappings.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm font-semibold text-slate-900">{m.table_name}</p>
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                      id: {m.entity_id_column}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {m.label_column && (
                      <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                        label: {m.label_column}
                      </span>
                    )}
                    {(m.feature_columns ?? []).slice(0, 5).map((col) => (
                      <span key={col} className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                        {col}
                      </span>
                    ))}
                    {(m.feature_columns?.length ?? 0) > 5 && (
                      <span className="text-[10px] text-slate-400">
                        +{(m.feature_columns?.length ?? 0) - 5} more
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">
                    Created {new Date(m.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  disabled={removing && removingId === m.id}
                  onClick={() => { if (confirm(`Remove mapping for "${m.table_name}"?`)) remove(m.id); }}
                  className="flex shrink-0 items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                >
                  {removing && removingId === m.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
