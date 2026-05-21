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
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 transition-all";

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
    ? `${inputCls} border-rose-300 focus:border-rose-500 focus:ring-rose-100`
    : inputCls;

  return (
  <>
    <button
      type="button"
      aria-label="Close panel"
      className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    />
    <aside className="fixed inset-x-0 bottom-0 top-16 z-50 flex w-full flex-col border-t border-slate-200 bg-white shadow-xl transition-transform duration-350 ease-out sm:bottom-0 sm:left-auto sm:right-0 sm:top-0 sm:max-w-md sm:border-l sm:border-t-0">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">Business context</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Help Entivia understand your business profile.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-5 py-5 space-y-5">
        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">Industry</label>
            <select name="industry" className={inputCls} defaultValue={org?.industry ?? ""}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-600">
              Business context <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="business_context"
              required
              className={`${contextInputCls} min-h-[120px] resize-y`}
              defaultValue={org?.business_context ?? ""}
              placeholder="We are a telecom operator managing enterprise accounts…"
              aria-invalid={Boolean(fieldErrors.business_context)}
            />
            <FieldError message={fieldErrors.business_context} />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Entity label</label>
              <input
                name="entity_label"
                className={inputCls}
                defaultValue={org?.entity_label ?? ""}
                placeholder="Customer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">Goal label</label>
              <input
                name="goal_label"
                className={inputCls}
                defaultValue={org?.goal_label ?? ""}
                placeholder="Reduce churn"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 text-center sm:text-left">
            You can also update these properties anytime under Settings → Organization.
          </p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {isPending && <Loader2 size={15} className="animate-spin" />}
              Save changes
            </button>
          </div>
        </div>
      </form>
    </aside>
  </>
  );
}