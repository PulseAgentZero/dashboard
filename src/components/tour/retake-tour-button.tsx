"use client";

import { Compass, Loader2 } from "lucide-react";
import { requestProductTour } from "@/lib/tour/run-product-tour";
import { useTourGuideState } from "@/hooks/tour/use-tour-guide";

type RetakeTourButtonProps = {
  variant?: "button" | "link" | "icon";
  className?: string;
  /** Visible label; omit for icon-only controls (use aria-label via `label`). */
  label?: string;
};

export function RetakeTourButton({
  variant = "button",
  className,
  label = "Retake product tour",
}: RetakeTourButtonProps) {
  const { isLoading } = useTourGuideState();

  function handleClick() {
    requestProductTour();
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label={label}
        title={label}
        className={
          className ??
          "flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        }
      >
        {isLoading ? (
          <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />
        ) : (
          <Compass size={18} strokeWidth={1.75} />
        )}
      </button>
    );
  }

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={
          className ??
          "inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 disabled:opacity-50"
        }
      >
        {isLoading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Compass size={14} />
        )}
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      }
    >
      {isLoading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Compass size={14} className="text-orange-600" />
      )}
      {label}
    </button>
  );
}
