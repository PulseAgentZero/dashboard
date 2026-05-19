"use client";

import { useEffect, useId } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

export type DeleteConfirmModalProps = {
  open: boolean;
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function DeleteConfirmModal({
  open,
  title = "Confirm deletion",
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  pending = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !pending) onCancel();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={() => !pending && onCancel()}
        disabled={pending}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
        >
          <X size={16} />
        </button>

        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 ring-1 ring-rose-100">
            <AlertTriangle size={22} className="text-rose-600" />
          </div>
          <div className="min-w-0 flex-1 pr-6">
            <h2 id={titleId} className="text-base font-semibold text-slate-900">
              {title}
            </h2>
            <p id={descId} className="mt-2 text-sm leading-relaxed text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {pending && <Loader2 size={15} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
