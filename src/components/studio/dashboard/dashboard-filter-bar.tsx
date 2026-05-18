"use client";

import { useEffect, useState } from "react";
import { ParamInputs } from "@/components/studio/core/param-inputs";
import type { QueryParamDefinition } from "@/types/studio";

type Props = {
  params: QueryParamDefinition[];
  onApply: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
  loading?: boolean;
};

export function DashboardFilterBar({ params, onApply, initialValues, loading }: Props) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const defaults: Record<string, string> = {};
    for (const p of params) {
      defaults[p.name] = initialValues?.[p.name] ?? p.default_value ?? "";
    }
    setValues(defaults);
  }, [params, initialValues]);

  if (params.length === 0) return null;

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <ParamInputs params={params} values={values} onChange={setValues} disabled={loading} />
      <button
        type="button"
        disabled={loading}
        onClick={() => onApply(values)}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? "Loading…" : "Apply filters"}
      </button>
    </div>
  );
}
