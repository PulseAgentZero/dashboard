"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Database,
  FileSpreadsheet,
  Loader2,
  Plus,
  RefreshCw,
  Server,
  Trash2,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  useConnections,
  useConnectionCatalog,
  useCreateConnection,
  useTestConnection,
  useDeleteConnection,
} from "@/hooks/connections/use-connections";
import type { CatalogField, ConnectionResponse } from "@/types/connections";

const ICON_MAP: Record<string, React.ElementType> = {
  postgresql: Database,
  mysql: Server,
  mssql: Server,
  sqlite: Database,
  csv: FileSpreadsheet,
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  connected: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
  pending: "bg-amber-50 text-amber-700",
};

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const Icon =
    s === "active" || s === "connected"
      ? CheckCircle2
      : s === "failed"
        ? XCircle
        : RefreshCw;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[s] ?? "bg-slate-100 text-slate-600"}`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

function ConnectionCard({
  conn,
  onTest,
  onDelete,
  testing,
}: {
  conn: ConnectionResponse;
  onTest: () => void;
  onDelete: () => void;
  testing: boolean;
}) {
  const Icon = ICON_MAP[conn.connector_type] ?? Database;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50">
            <Icon size={18} className="text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">{conn.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {conn.connector_type}
              {conn.host ? ` · ${conn.host}` : ""}
              {conn.database_name ? ` · ${conn.database_name}` : ""}
            </p>
          </div>
        </div>
        <StatusBadge status={conn.status} />
      </div>

      {conn.last_test_error && (
        <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {conn.last_test_error}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-400">
          {conn.last_tested_at
            ? `Tested ${new Date(conn.last_tested_at).toLocaleString()}`
            : "Never tested"}
        </p>
        <div className="flex gap-2">
          <button
            disabled={testing}
            onClick={onTest}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {testing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
            Test
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={11} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: CatalogField;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  const isPassword = field.type === "password";
  const isTextarea = field.type === "textarea";
  const isSelect = field.type === "select";

  const base =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400";

  if (isSelect && field.options) {
    return (
      <select className={base} value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    );
  }

  if (isTextarea) {
    return (
      <textarea
        className={`${base} min-h-20 resize-y font-mono text-xs`}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <div className="relative">
      <input
        type={isPassword && !show ? "password" : "text"}
        className={`${base} ${isPassword ? "pr-9" : ""}`}
        placeholder={field.placeholder || String(field.default ?? "")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isPassword && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
}

function AddConnectionForm({ onClose }: { onClose: () => void }) {
  const { data: catalog, isLoading: loadingCatalog } = useConnectionCatalog();
  const { mutate: create, isPending } = useCreateConnection();

  const [step, setStep] = useState<"pick" | "form">("pick");
  const [selectedType, setSelectedType] = useState<string>("");
  const [fields, setFields] = useState<Record<string, string>>({});

  const selectedConnector = catalog?.find((c) => c.connector_type === selectedType);

  function handleSelectType(type: string) {
    setSelectedType(type);
    const conn = catalog?.find((c) => c.connector_type === type);
    const defaults: Record<string, string> = {};
    conn?.fields.forEach((f) => {
      if (f.default !== undefined) defaults[f.key] = String(f.default);
    });
    setFields(defaults);
    setStep("form");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body: Record<string, unknown> = {
      connector_type: selectedType,
      name: fields.name || selectedConnector?.display_name,
    };
    selectedConnector?.fields.forEach((f) => {
      const v = fields[f.key];
      if (v !== undefined && v !== "") {
        body[f.key] = f.type === "integer" ? Number(v) : v;
      }
    });
    create(body, { onSuccess: onClose });
  }

  const primaryConnectors = ["postgresql", "mysql", "mssql", "sqlite", "csv"];
  const cloudConnectors = ["snowflake", "bigquery", "databricks", "redshift", "clickhouse"];
  const otherConnectors = ["mongodb", "airtable", "google_sheets", "s3", "gcs"];

  const groups = [
    { label: "SQL databases", types: primaryConnectors },
    { label: "Cloud warehouses", types: cloudConnectors },
    { label: "Other sources", types: otherConnectors },
  ];

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          {step === "form" && (
            <button
              onClick={() => setStep("pick")}
              className="text-slate-400 hover:text-slate-700"
            >
              ←
            </button>
          )}
          {step === "pick" ? "Choose a connector" : `Configure ${selectedConnector?.display_name}`}
        </div>
        <button
          onClick={onClose}
          className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>

      {step === "pick" && (
        <div className="space-y-4">
          {loadingCatalog ? (
            <div className="grid gap-2 sm:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-200" />
              ))}
            </div>
          ) : (
            groups.map(({ label, types }) => {
              const items = catalog?.filter((c) => types.includes(c.connector_type)) ?? [];
              if (items.length === 0) return null;
              return (
                <div key={label}>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {items.map((conn) => {
                      const Icon = ICON_MAP[conn.connector_type] ?? Database;
                      return (
                        <button
                          key={conn.connector_type}
                          onClick={() => handleSelectType(conn.connector_type)}
                          className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                          <Icon size={16} className="shrink-0 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{conn.display_name}</span>
                          <ChevronRight size={13} className="ml-auto text-slate-300" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {step === "form" && selectedConnector && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Connection name
            </label>
            <FieldInput
              field={{ key: "name", label: "Connection name", type: "string", required: false, placeholder: selectedConnector.display_name }}
              value={fields.name ?? ""}
              onChange={(v) => setFields((f) => ({ ...f, name: v }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {selectedConnector.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
                  {field.label}
                  {field.required && <span className="ml-0.5 text-rose-500">*</span>}
                </label>
                <FieldInput
                  field={field}
                  value={fields[field.key] ?? ""}
                  onChange={(v) => setFields((f) => ({ ...f, [field.key]: v }))}
                />
              </div>
            ))}
          </div>

          {selectedConnector.notes && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {selectedConnector.notes}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? "Testing & saving…" : "Test & save connection"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export function ConnectionsPage() {
  const { data: connections, isLoading } = useConnections();
  const { mutate: testConn, isPending: testing, variables: testingId } = useTestConnection();
  const { mutate: deleteConn } = useDeleteConnection();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="mx-auto max-w-8xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Data connections</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Connect read-only data sources. Credentials are encrypted; data stays in your database.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={showForm}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus size={15} />
          Add connection
        </button>
      </div>

      {showForm && (
        <AddConnectionForm onClose={() => setShowForm(false)} />
      )}

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white" />
          ))}

        {!isLoading && connections?.length === 0 && !showForm && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Database className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No connections yet</p>
            <p className="mt-1 text-xs text-slate-400">
              Add a data source to start profiling entities.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 flex items-center gap-2 mx-auto rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={14} />
              Add your first connection
            </button>
          </div>
        )}

        {connections?.map((conn) => (
          <ConnectionCard
            key={conn.id}
            conn={conn}
            testing={testing && testingId === conn.id}
            onTest={() => testConn(conn.id)}
            onDelete={() => {
              if (confirm(`Remove "${conn.name}"?`)) deleteConn(conn.id);
            }}
          />
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>
            Credentials are encrypted at rest. Query users should have SELECT-only access.
            Self-hosted deployments keep database traffic inside your network.
          </span>
        </div>
      </div>
    </div>
  );
}
