"use client";

import { useEffect, useState } from "react";
import { ParamInputs } from "@/components/studio/core/param-inputs";
import type { QueryParamDefinition } from "@/types/studio";

type Props = {
  params: QueryParamDefinition[];
  onApply: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
  loading?: boolean;
  autoApplyOnChange?: boolean;
};

export function DashboardFilterBar({
  params,
  onApply,
  initialValues,
  loading,
  autoApplyOnChange,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const p of params) {
      defaults[p.name] = initialValues?.[p.name] ?? p.default_value ?? "";
    }
    setValues(defaults);
  }, [params, initialValues]);

  if (params.length === 0) return null;

  const handleChange = (next: Record<string, string>) => {
    setValues(next);
    if (autoApplyOnChange) {
      onApply(next);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <span className="w-full text-xs font-semibold uppercase tracking-wide text-slate-500">
        Variables
      </span>
      <ParamInputs params={params} values={values} onChange={handleChange} disabled={loading} />
      {!autoApplyOnChange && (
        <button
          type="button"
          disabled={loading}
          onClick={() => onApply(values)}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Apply"}
        </button>
      )}
    </div>
  );
}
