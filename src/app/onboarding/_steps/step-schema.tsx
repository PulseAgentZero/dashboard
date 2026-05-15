"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useConnectionSchema } from "@/hooks/onboarding/use-connection-schema";
import { useSaveSchemaMapping } from "@/hooks/onboarding/use-save-schema-mapping";
import { useSchemaMappingPrefill } from "@/hooks/onboarding/use-schema-mapping-prefill";
import type { TableInfo } from "@/types/onboarding";

interface Props {
  connectionId: string;
  onNext: () => void;
  onBack: () => void;
}

export default function StepSchema({ connectionId, onNext, onBack }: Props) {
  const { data: schema, isLoading: schemaLoading } = useConnectionSchema(true);
  const { data: prefill, isLoading: prefillLoading } = useSchemaMappingPrefill();
  const { mutate, isPending } = useSaveSchemaMapping();

  const [selectedTable, setSelectedTable] = useState("");
  const tables = schema?.tables ?? [];
  const columns = tables.find((t: TableInfo) => t.name === selectedTable)?.columns ?? [];

  useEffect(() => {
    if (prefill?.entity_table) {
      setSelectedTable((prev) => prev || prefill.entity_table!);
    }
  }, [prefill?.entity_table]);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    mutate(
      {
        connection_id: connectionId,
        entity_table: selectedTable,
        entity_id_col: d.get("entity_id_col") as string,
        entity_name_col: d.get("entity_name_col") as string || undefined,
        timestamp_col: d.get("timestamp_col") as string || undefined,
        target_column: d.get("target_column") as string || undefined,
        raw_schema: schema as unknown as Record<string, unknown>,
      },
      { onSuccess: onNext },
    );
  }

  if (schemaLoading || prefillLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex items-center justify-center gap-3 min-h-[300px]">
        <Loader2 size={18} className="animate-spin text-blue-600" />
        <span className="text-[13px] text-slate-600">Loading schema from your database…</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="mb-7">
        <h2 className="text-xl font-bold text-slate-900">Map your data structure</h2>
        <p className="text-[13px] text-slate-500 mt-1">
          Tell Pulse which table and columns represent your entities and signals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Entity table */}
        <div className="space-y-1.5">
          <label className="block text-[13px] font-medium text-slate-700">
            Entity table <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
          >
            <option value="">Select the table containing your entities</option>
            {tables.map((t: TableInfo) => (
              <option key={t.name} value={t.name}>{t.name}</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400">The primary table with one row per entity (e.g. customers)</p>
        </div>

        {selectedTable && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <ColSelect name="entity_id_col" label="ID column" required columns={columns} hint="Unique identifier per entity" defaultValue={prefill?.entity_id_col ?? ""} />
              <ColSelect name="entity_name_col" label="Name column" columns={columns} hint="Human-readable name (optional)" defaultValue={prefill?.entity_name_col ?? ""} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ColSelect name="target_column" label="Target column" columns={columns} hint="What you're predicting (e.g. churned)" defaultValue={prefill?.target_column ?? ""} />
              <ColSelect name="timestamp_col" label="Timestamp column" columns={columns} hint="Event or record date (optional)" defaultValue={prefill?.timestamp_col ?? ""} />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[12px] text-blue-700">
              Pulse will use these columns to build entity profiles and generate AI recommendations.
            </div>
          </>
        )}

        <div className="pt-2 flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-[13px] text-slate-500 hover:text-slate-700 transition">
            ← Back
          </button>
          <button
            type="submit"
            disabled={isPending || !selectedTable}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : "Save Mapping →"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ColSelect({
  name, label, required, columns, hint, defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  columns: { name: string; data_type: string }[];
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[13px] font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-700 focus:border-blue-400 focus:outline-none transition-colors"
      >
        <option value="">Select column</option>
        {columns.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name} ({c.data_type})
          </option>
        ))}
      </select>
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
