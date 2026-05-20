"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Database,
  Hash,
  Loader2,
  Sparkles,
  Table2,
  Type,
} from "lucide-react";
import { ConnectorIcon } from "@/components/connectors/connector-icon";
import { useOrganization } from "@/hooks/org/use-organization";
import {
  useConnectionTables,
  useCreateSchemaMapping,
  useUpdateSchemaMapping,
} from "@/hooks/schema-mappings/use-schema-mappings";
import type { SchemaMapping, SchemaTableInfo } from "@/types/schema-mapping";
import {
  buildRawSchema,
  inferMappingFromSchema,
} from "@/lib/schema-mapping-infer";
import { isFileEntityMappingConnector } from "@/lib/connectors/pipeline-supported";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

type Props = {
  connectionId: string;
  connectionName: string;
  connectorType?: string;
  existingMapping?: SchemaMapping | null;
  onComplete: (result?: SchemaMapping) => void;
  onBack?: () => void;
};

type Step = "table" | "identity" | "signals" | "review";

const STEPS: { id: Step; label: string; description: string }[] = [
  { id: "table", label: "Choose table", description: "Entity source" },
  { id: "identity", label: "Identity", description: "ID & name" },
  { id: "signals", label: "Signals", description: "Risk columns" },
  { id: "review", label: "Review", description: "Confirm & save" },
];

export function SchemaMappingWizard({
  connectionId,
  connectionName,
  connectorType,
  existingMapping,
  onComplete,
  onBack,
}: Props) {
  const { data: org } = useOrganization();
  const { data: introspect, isLoading, isError } = useConnectionTables(connectionId);
  const { mutate: create, isPending: creating } = useCreateSchemaMapping();
  const { mutate: update, isPending: updating } = useUpdateSchemaMapping();

  const entityLabel = org?.entity_label?.trim() || "customer";
  const entityLabelPlural = `${entityLabel}s`;

  const tables = introspect?.tables ?? [];
  const isFileSource = connectorType
    ? isFileEntityMappingConnector(connectorType)
    : false;

  const [step, setStep] = useState<Step>("table");
  const [tableSearch, setTableSearch] = useState("");
  const [entityTable, setEntityTable] = useState(existingMapping?.entity_table ?? "");
  const [entityIdCol, setEntityIdCol] = useState(existingMapping?.entity_id_col ?? "");
  const [entityNameCol, setEntityNameCol] = useState(existingMapping?.entity_name_col ?? "");
  const [timestampCol, setTimestampCol] = useState(existingMapping?.timestamp_col ?? "");
  const [signalCols, setSignalCols] = useState<Record<string, string>>(
    existingMapping?.signal_columns ?? {},
  );

  // For single-table sources (CSV uploads, single-sheet Google Sheets), the
  // "Choose table" step is meaningless — auto-select and advance the user to
  // the identity step where the real decisions are.
  useEffect(() => {
    if (step !== "table") return;
    if (tables.length !== 1) return;
    const only = tables[0];
    if (entityTable && entityTable !== only.name) return;
    if (!entityTable) setEntityTable(only.name);
    setStep("identity");
  }, [tables, step, entityTable]);

  const selectedTable = useMemo(
    () => tables.find((t) => t.name === entityTable),
    [tables, entityTable],
  );

  const filteredTables = useMemo(() => {
    const q = tableSearch.trim().toLowerCase();
    if (!q) return tables;
    return tables.filter((t) => t.name.toLowerCase().includes(q));
  }, [tables, tableSearch]);

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function clearColumnSelections() {
    setEntityIdCol("");
    setEntityNameCol("");
    setTimestampCol("");
    setSignalCols({});
  }

  function selectTable(tableName: string) {
    if (tableName !== entityTable) clearColumnSelections();
    setEntityTable(tableName);
    setStep("identity");
  }

  function applyInference() {
    const scope = entityTable
      ? tables.filter((t) => t.name === entityTable)
      : tables;
    const inferred = inferMappingFromSchema(scope, {
      entityLabel: org?.entity_label,
      goalLabel: org?.goal_label,
    });
    if (!inferred) return;
    setEntityTable(inferred.entity_table);
    setEntityIdCol(inferred.entity_id_col);
    setEntityNameCol(inferred.entity_name_col ?? "");
    setTimestampCol(inferred.timestamp_col ?? "");
    setSignalCols(inferred.signal_columns);
    setStep("identity");
  }

  function toggleSignal(columnName: string) {
    setSignalCols((prev) => {
      const next = { ...prev };
      const existing = Object.entries(next).find(([, v]) => v === columnName);
      if (existing) {
        delete next[existing[0]];
        return next;
      }
      const label = columnName.replace(/_/g, " ");
      next[label] = columnName;
      return next;
    });
  }

  function isSignalSelected(columnName: string) {
    return Object.values(signalCols).includes(columnName);
  }

  function numericColumns(table: SchemaTableInfo) {
    return table.columns.filter((c) => {
      const t = c.data_type.toLowerCase();
      return (
        t.includes("int") ||
        t.includes("numeric") ||
        t.includes("decimal") ||
        t.includes("float") ||
        t.includes("double") ||
        t.includes("bool") ||
        t.includes("number")
      );
    });
  }

  function handleSave() {
    const body = {
      connection_id: connectionId,
      entity_table: entityTable,
      entity_id_col: entityIdCol,
      entity_name_col: entityNameCol || null,
      signal_columns: Object.keys(signalCols).length ? signalCols : null,
      timestamp_col: timestampCol || null,
      raw_schema: buildRawSchema(tables),
    };

    if (existingMapping) {
      update({ id: existingMapping.id, body }, { onSuccess: () => onComplete() });
    } else {
      create(body, { onSuccess: (data) => onComplete(data) });
    }
  }

  const saving = creating || updating;

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
        <p className="mt-4 text-sm font-medium text-slate-700">Reading schema from {connectionName}</p>
        <p className="mt-1 text-xs text-slate-500">This may take a few seconds on large databases</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-rose-900">Could not read schema</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-rose-800/90">
          {isFileSource
            ? "We couldn't read this file or workbook. Re-upload it from Connections and try again."
            : "Test the connection from Connections, then try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(260px,300px)_1fr] md:items-start">
      {/* Sidebar — progress & context */}
      <aside className="space-y-4 lg:sticky lg:top-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Connection
          </p>
          <div className="mt-2 flex items-center gap-3">
            {connectorType ? (
              <ConnectorIcon connectorType={connectorType} size={40} className="shrink-0" />
            ) : (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <Database size={20} />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{connectionName}</p>
              <p className="text-xs text-slate-500">
                {tables.length} table{tables.length === 1 ? "" : "s"} available
              </p>
            </div>
          </div>
          {entityTable && (
            <div className="mt-4 rounded-lg bg-indigo-50/80 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase text-indigo-600">Selected table</p>
              <p className="mt-0.5 truncate font-mono text-sm font-medium text-indigo-900">
                {entityTable}
              </p>
            </div>
          )}
        </div>

        <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" aria-label="Steps">
          {STEPS.map((s, i) => {
            const done = i < stepIndex;
            const active = s.id === step;
            const reachable =
              i === 0 ||
              (i === 1 && entityTable) ||
              (i === 2 && entityTable && entityIdCol) ||
              (i === 3 && entityTable && entityIdCol);
            return (
              <button
                key={s.id}
                type="button"
                disabled={!reachable && !done && !active}
                onClick={() => reachable && setStep(s.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm"
                    : done
                      ? "text-slate-700 hover:bg-slate-50"
                      : reachable
                        ? "text-slate-600 hover:bg-slate-50"
                        : "cursor-not-allowed text-slate-300"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-white/20 text-white"
                      : done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {done && !active ? <Check size={14} /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{s.label}</span>
                  <span
                    className={`block text-[11px] ${active ? "text-indigo-100" : "text-slate-400"}`}
                  >
                    {s.description}
                  </span>
                </span>
                {active && <ChevronRight size={16} className="shrink-0 opacity-80" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main panel */}
      <div className="min-w-0 space-y-5">
        <header>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            Data mapping
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Map your {entityLabelPlural}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Choose which table represents one {entityLabel} per row, then pick ID and signal
            columns. Entivia uses this on every pipeline run and in recommendations.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-slate-900">
              {STEPS[stepIndex]?.label}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {step === "table" &&
                "Select the primary table that stores your entities."}
              {step === "identity" &&
                selectedTable &&
                `Columns from ${entityTable} — each row = one ${entityLabel}.`}
              {step === "signals" &&
                "Optional numeric fields for risk scoring."}
              {step === "review" && "Confirm before saving."}
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {step === "table" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="Search tables…"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={applyInference}
                    disabled={tables.length === 0}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
                  >
                    <Sparkles size={16} />
                    Auto-suggest
                  </button>
                </div>

                {filteredTables.length === 0 ? (
                  <p className="py-12 text-center text-sm text-slate-500">No tables match your search</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredTables.map((t) => {
                      const selected = entityTable === t.name;
                      return (
                        <button
                          key={t.name}
                          type="button"
                          onClick={() => selectTable(t.name)}
                          className={`group relative flex flex-col rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/20"
                              : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md"
                          }`}
                        >
                          {selected && (
                            <span className="absolute right-3 top-3 text-indigo-600">
                              <Check size={18} strokeWidth={2.5} />
                            </span>
                          )}
                          <Table2
                            size={20}
                            className={selected ? "text-indigo-600" : "text-slate-400"}
                          />
                          <p className="mt-3 font-mono text-sm font-semibold text-slate-900 break-all">
                            {t.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {t.columns.length} column{t.columns.length === 1 ? "" : "s"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {step === "identity" && !selectedTable && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-900">
                <p className="font-semibold">Pick a table first</p>
                <p className="mt-1 text-amber-800/90">
                  Use the step list on the left or go back to choose a table.
                </p>
              </div>
            )}

            {step === "identity" && selectedTable && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Unique ID column"
                    hint={`Required — stable identifier per ${entityLabel}`}
                    value={entityIdCol}
                    onChange={setEntityIdCol}
                    options={selectedTable.columns.map((c) => c.name)}
                    required
                    icon={<Hash size={14} />}
                  />
                  <Field
                    label="Display name"
                    hint="Shown in entity lists and dashboards"
                    value={entityNameCol}
                    onChange={setEntityNameCol}
                    options={selectedTable.columns.map((c) => c.name)}
                    icon={<Type size={14} />}
                  />
                  <Field
                    label="Last updated"
                    hint="Optional — enables time-based analysis"
                    value={timestampCol}
                    onChange={setTimestampCol}
                    options={selectedTable.columns.map((c) => c.name)}
                  />
                </div>
                <ColumnPreview table={selectedTable} highlight={[entityIdCol, entityNameCol, timestampCol]} />
              </div>
            )}

            {step === "signals" && selectedTable && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Select metrics Entivia should weigh for risk. You can skip this and add signals
                  later.
                </p>
                <div className="flex flex-wrap gap-2">
                  {numericColumns(selectedTable).map((col) => {
                    const on = isSignalSelected(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => toggleSignal(col.name)}
                        className={`rounded-lg border px-3 py-2 font-mono text-xs font-medium transition ${
                          on
                            ? "border-indigo-400 bg-indigo-50 text-indigo-800 shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        {col.name}
                      </button>
                    );
                  })}
                </div>
                {numericColumns(selectedTable).length === 0 && (
                  <p className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
                    No numeric columns on this table — you can continue without signals.
                  </p>
                )}
              </div>
            )}

            {step === "review" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <ReviewCard
                  title="Source"
                  rows={[
                    { label: "Connection", value: connectionName },
                    { label: "Table", value: entityTable, mono: true },
                  ]}
                />
                <ReviewCard
                  title="Columns"
                  rows={[
                    { label: "ID", value: entityIdCol, mono: true },
                    ...(entityNameCol
                      ? [{ label: "Name", value: entityNameCol, mono: true }]
                      : []),
                    ...(timestampCol
                      ? [{ label: "Updated", value: timestampCol, mono: true }]
                      : []),
                    {
                      label: "Signals",
                      value: Object.keys(signalCols).length
                        ? `${Object.keys(signalCols).length} selected`
                        : "None",
                    },
                  ]}
                />
              </div>
            )}
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6">
            <div>
              {onBack && step === "table" ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Connections
                </button>
              ) : step !== "table" ? (
                <button
                  type="button"
                  onClick={() =>
                    setStep(
                      step === "review" ? "signals" : step === "signals" ? "identity" : "table",
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
              ) : null}
            </div>
            <div className="flex gap-2">
              {step !== "review" ? (
                <button
                  type="button"
                  disabled={
                    (step === "table" && !entityTable) ||
                    (step === "identity" && !entityIdCol)
                  }
                  onClick={() =>
                    setStep(
                      step === "table" ? "identity" : step === "identity" ? "signals" : "review",
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {existingMapping ? "Save changes" : "Save mapping"}
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function ColumnPreview({
  table,
  highlight,
}: {
  table: SchemaTableInfo;
  highlight: string[];
}) {
  const show = table.columns.slice(0, 12);
  const more = table.columns.length - show.length;
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Column preview
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {show.map((c) => {
          const on = highlight.includes(c.name);
          return (
            <li
              key={c.name}
              className={`rounded-md border px-2 py-1 font-mono text-[11px] ${
                on
                  ? "border-indigo-300 bg-indigo-50 text-indigo-800"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {c.name}
              <span className="ml-1 font-sans text-slate-400">{c.data_type}</span>
            </li>
          );
        })}
        {more > 0 && (
          <li className="px-2 py-1 text-xs text-slate-400">+{more} more</li>
        )}
      </ul>
    </div>
  );
}

function ReviewCard({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string; mono?: boolean }[];
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-slate-500">{row.label}</dt>
            <dd
              className={`max-w-[60%] truncate text-right font-medium text-slate-900 ${
                row.mono ? "font-mono text-xs" : ""
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  options,
  required,
  icon,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4">
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
        {icon}
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        className={inputCls}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      >
        {required && <option value="">Select column…</option>}
        {!required && <option value="">— Optional —</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  );
}
