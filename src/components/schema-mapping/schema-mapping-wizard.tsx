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
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20";

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
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <Loader2 size={32} className="animate-spin text-orange-500" />
        <p className="mt-4 text-sm font-medium text-slate-700">Reading schema from {connectionName}</p>
        <p className="mt-1 text-xs text-slate-500">This may take a few seconds on large databases</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 md:p-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-rose-900">Could not read schema</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-rose-800/90 leading-relaxed">
          {isFileSource
            ? "We couldn't read this file or workbook. Re-upload it from Connections and try again."
            : "Test the connection from Connections, then try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] items-start">
      {/* Sidebar — progress & context */}
      <aside className="space-y-4 lg:sticky lg:top-6 order-first">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Connection
          </p>
          <div className="mt-2 flex items-center gap-3">
            {connectorType ? (
              <ConnectorIcon connectorType={connectorType} size={36} className="shrink-0" />
            ) : (
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                <Database size={18} />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">{connectionName}</p>
              <p className="text-xs text-slate-500">
                {tables.length} table{tables.length === 1 ? "" : "s"} available
              </p>
            </div>
          </div>
          {entityTable && (
            <div className="mt-4 rounded-xl bg-orange-50/60 border border-orange-100/50 px-3 py-2.5">
              <p className="text-[10px] font-bold uppercase text-orange-700">Selected table</p>
              <p className="mt-0.5 truncate font-mono text-xs font-semibold text-orange-900">
                {entityTable}
              </p>
            </div>
          )}
        </div>

        {/* Steps display - dynamic orientation layout */}
        <nav className="flex gap-2 overflow-x-auto no-scrollbar rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:flex-col lg:overflow-x-visible" aria-label="Steps">
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
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left transition-all lg:w-full lg:shrink-1 ${
                  active
                    ? "bg-orange-600 text-white shadow-md shadow-orange-600/10"
                    : done
                      ? "text-slate-700 hover:bg-slate-50"
                      : reachable
                        ? "text-slate-600 hover:bg-slate-50"
                        : "cursor-not-allowed text-slate-300"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    active
                      ? "bg-white/20 text-white"
                      : done
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {done && !active ? <Check size={12} strokeWidth={2.5} /> : i + 1}
                </span>
                <span className="min-w-0 pr-2 lg:pr-0">
                  <span className="block text-xs sm:text-sm font-bold whitespace-nowrap lg:whitespace-normal">{s.label}</span>
                  <span
                    className={`hidden sm:block text-[10px] lg:text-[11px] ${active ? "text-orange-100" : "text-slate-400"}`}
                  >
                    {s.description}
                  </span>
                </span>
                {active && <ChevronRight size={16} className="hidden lg:block ml-auto shrink-0 opacity-80" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main panel */}
      <div className="min-w-0 space-y-5">
        <header className="px-1 lg:px-0">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
            Data mapping
          </p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Map your {entityLabelPlural}
          </h1>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
            Choose which table represents one {entityLabel} per row, then pick ID and signal
            columns. Entivia uses this on every pipeline run and in recommendations.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
            <h2 className="text-base font-bold text-slate-900">
              {STEPS[stepIndex]?.label}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-500">
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

          <div className="p-4 sm:p-6">
            {step === "table" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="w-full min-w-0">
                    <input
                      className={inputCls}
                      placeholder="Search tables…"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyInference}
                    disabled={tables.length === 0}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-bold text-orange-700 hover:bg-orange-100/80 active:scale-[0.98] transition-all disabled:opacity-50"
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
                          className={`group relative flex flex-col rounded-xl border p-4 text-left transition-all ${
                            selected
                              ? "border-orange-500 bg-orange-50/30 ring-2 ring-orange-500/20"
                              : "border-slate-200 bg-white hover:border-orange-200 hover:shadow-md"
                          }`}
                        >
                          {selected && (
                            <span className="absolute right-3 top-3 text-orange-600">
                              <Check size={18} strokeWidth={2.5} />
                            </span>
                          )}
                          <Table2
                            size={18}
                            className={selected ? "text-orange-600" : "text-slate-400"}
                          />
                          <p className="mt-3 font-mono text-xs font-bold text-slate-900 break-all leading-normal">
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
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-xs sm:text-sm text-amber-900">
                <p className="font-semibold">Pick a table first</p>
                <p className="mt-1 text-amber-800/90">
                  Use the step list on the left or go back to choose a table.
                </p>
              </div>
            )}

            {step === "identity" && selectedTable && (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
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
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Select metrics Entivia should weigh for risk. You can skip this and add signals
                  later.
                </p>
                <div className="flex flex-wrap gap-2 max-h-[260px] overflow-y-auto p-0.5 rounded-lg">
                  {numericColumns(selectedTable).map((col) => {
                    const on = isSignalSelected(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => toggleSignal(col.name)}
                        className={`max-w-full break-all rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                          on
                            ? "border-orange-400 bg-orange-50 text-orange-800 shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                        }`}
                      >
                        {col.name}
                      </button>
                    );
                  })}
                </div>
                {numericColumns(selectedTable).length === 0 && (
                  <p className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-xs sm:text-sm text-slate-500">
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

          <footer className="flex flex-col-reverse gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              {onBack && step === "table" ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 w-full sm:w-auto py-2 sm:py-0"
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
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 w-full sm:w-auto py-2 sm:py-0"
                >
                  <ArrowLeft size={16} />
                  Previous
                </button>
              ) : null}
            </div>
            <div className="w-full sm:w-auto">
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-700 active:scale-[0.99] transition-all disabled:opacity-50"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSave}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-orange-700 active:scale-[0.99] transition-all disabled:opacity-50"
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
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
        Column preview
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {show.map((c) => {
          const on = highlight.includes(c.name);
          return (
            <li
              key={c.name}
              className={`max-w-full break-all rounded-md border px-2 py-1 font-mono text-[11px] leading-normal transition-all ${
                on
                  ? "border-orange-300 bg-orange-50/60 text-orange-900 font-bold"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {c.name}
              <span className="ml-1 font-sans text-[10px] text-slate-400 font-normal">{c.data_type}</span>
            </li>
          );
        })}
        {more > 0 && (
          <li className="px-2 py-1 text-xs text-slate-400 font-medium">+{more} more</li>
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
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{title}</p>
      <dl className="mt-3 space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
            <dt className="text-slate-500 shrink-0">{row.label}</dt>
            <dd
              className={`min-w-0 break-all text-right font-semibold text-slate-900 sm:max-w-[70%] truncate ${
                row.mono ? "font-mono text-xs text-orange-800" : ""
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
    <div className="rounded-xl border border-slate-100 bg-slate-50/30 p-4 flex flex-col justify-between">
      <div>
        <label className="mb-2 flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
          <span className="text-slate-400 shrink-0">{icon}</span>
          <span className="truncate">{label}</span>
          {required && <span className="text-rose-500 font-bold">*</span>}
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
      </div>
      <p className="mt-2 text-[11px] text-slate-500 leading-normal">{hint}</p>
    </div>
  );
}