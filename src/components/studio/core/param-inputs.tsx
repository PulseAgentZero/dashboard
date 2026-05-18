"use client";

import type { QueryParamDefinition } from "@/types/studio";

type Props = {
  params: QueryParamDefinition[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
  disabled?: boolean;
};

export function ParamInputs({ params, values, onChange, disabled }: Props) {
  if (params.length === 0) return null;

  function set(name: string, val: string) {
    onChange({ ...values, [name]: val });
  }

  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
      {params.map((p) => {
        const label = p.label ?? p.name;
        const val = values[p.name] ?? p.default_value ?? "";
        const inputType =
          p.type === "number"
            ? "number"
            : p.type === "date"
              ? "date"
              : p.type === "datetime"
                ? "datetime-local"
                : "text";
        return (
          <label key={p.name} className="flex flex-col gap-1 text-xs">
            <span className="font-medium text-slate-600">{label}</span>
            <input
              type={inputType}
              value={val}
              disabled={disabled}
              onChange={(e) => set(p.name, e.target.value)}
              className="min-w-[140px] rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-900"
            />
          </label>
        );
      })}
    </div>
  );
}
