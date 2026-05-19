"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/org/use-organization";
import { usePatchMemberSettings } from "@/hooks/org/use-member-settings";
import { businessContextSchema, useFormValidation } from "@/lib/validation";
import { FieldError } from "@/components/ui/field-error";
import { ApiError } from "@/lib/api/client";

const INDUSTRIES = [
  "Telecom", "Healthcare", "Retail & FMCG", "Logistics & Supply Chain",
  "Financial Services", "Insurance", "Energy & Utilities", "Manufacturing",
  "Technology", "Education", "Other",
];

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400";

type BusinessContextSheetProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

export function BusinessContextSheet({ open, onClose, onSaved }: BusinessContextSheetProps) {
  const { data: org } = useOrganization();
  const { mutate: save, isPending } = usePatchMemberSettings();
  const { fieldErrors, clearErrors, validate, handleApiError } = useFormValidation();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearErrors();
    const d = new FormData(e.currentTarget);
    const payload = validate(businessContextSchema, {
      industry: (d.get("industry") as string) || undefined,
      business_context: d.get("business_context") as string,
      entity_label: (d.get("entity_label") as string) || undefined,
      goal_label: (d.get("goal_label") as string) || undefined,
    });
    if (!payload) return;
    save(
      {
        industry: payload.industry || undefined,
        business_context: payload.business_context,
        entity_label: payload.entity_label || undefined,
        goal_label: payload.goal_label || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Business context saved");
          onSaved?.();
          onClose();
        },
        onError: (err) => {
          if (handleApiError(err)) return;
          toast.error(
            err instanceof ApiError ? err.message : "Failed to save business context",
          );
        },
      },
    );
  }

  const contextInputCls = fieldErrors.business_context
    ? `${inputCls} border-rose-300 focus:border-rose-400 focus:ring-rose-400`
    : inputCls;

  return (
  <>
    <button
      type="button"
      aria-label="Close"
      className="fixed inset-0 z-40 bg-slate-900/30"
      onClick={onClose}
    />
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Business context</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Help Entivia understand your business and goals.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-5 py-5">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Industry</label>
            <select name="industry" className={inputCls} defaultValue={org?.industry ?? ""}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Business context <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="business_context"
              required
              className={`${contextInputCls} min-h-28 resize-y`}
              defaultValue={org?.business_context ?? ""}
              placeholder="We are a telecom operator managing enterprise accounts…"
              aria-invalid={Boolean(fieldErrors.business_context)}
            />
            <FieldError message={fieldErrors.business_context} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Entity label</label>
              <input
                name="entity_label"
                className={inputCls}
                defaultValue={org?.entity_label ?? ""}
                placeholder="Customer"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Goal label</label>
              <input
                name="goal_label"
                className={inputCls}
                defaultValue={org?.goal_label ?? ""}
                placeholder="Reduce churn"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            You can also edit these anytime under Settings → Organization.
          </p>
        </div>

        <div className="mt-auto flex justify-end gap-2 border-t border-slate-100 pt-4">
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
            Save
          </button>
        </div>
      </form>
    </aside>
  </>
  );
}
