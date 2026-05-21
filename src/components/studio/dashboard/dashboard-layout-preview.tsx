"use client";

import type { DashboardLayoutItem } from "@/types/studio";

const COLS = 12;
const PREVIEW_ROWS = 6;

const PANEL_COLORS = [
  "bg-indigo-200/80",
  "bg-violet-200/80",
  "bg-sky-200/80",
  "bg-emerald-200/80",
  "bg-amber-200/80",
  "bg-rose-200/80",
];

type Props = {
  layout: DashboardLayoutItem[];
  className?: string;
};

/** Read-only mini grid from dashboard layout — no query execution. */
export function DashboardLayoutPreview({ layout, className = "" }: Props) {
  if (!layout.length) {
    return (
      <div
        className={`flex aspect-[16/10] items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400 ${className}`}
      >
        Empty layout
      </div>
    );
  }

  const maxY = Math.max(...layout.map((s) => s.y + s.h), 1);
  const scale = PREVIEW_ROWS / maxY;

  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-100 ring-1 ring-slate-200/80 ${className}`}
      aria-hidden
    >
      {layout.map((slot, i) => {
        const left = (slot.x / COLS) * 100;
        const width = (slot.w / COLS) * 100;
        const top = (slot.y * scale * (100 / PREVIEW_ROWS));
        const height = Math.max(slot.h * scale * (100 / PREVIEW_ROWS), 8);
        const color = PANEL_COLORS[i % PANEL_COLORS.length];

        return (
          <div
            key={slot.item_id}
            className={`absolute rounded-sm ${color}`}
            style={{
              left: `${left}%`,
              width: `${width}%`,
              top: `${top}%`,
              height: `${height}%`,
            }}
          />
        );
      })}
    </div>
  );
}
