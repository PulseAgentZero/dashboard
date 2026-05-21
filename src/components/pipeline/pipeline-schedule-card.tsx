"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronDown, Loader2 } from "lucide-react";
import { useOrganization } from "@/hooks/org/use-organization";
import { usePipelineSchedule, useUpdateSchedule } from "@/hooks/pipeline/use-pipeline";
import {
  CUSTOM_SCHEDULE_PRESET,
  getScheduleDisplayLabel,
  presetFromCron,
  SCHEDULE_PRESETS,
  type SchedulePresetId,
} from "@/lib/pipeline-schedule-presets";

export function PipelineScheduleCard() {
  const { data: org } = useOrganization();
  const { data: schedule, isLoading } = usePipelineSchedule();
  const { mutate: update, isPending } = useUpdateSchedule();

  const [open, setOpen] = useState(false);
  const [presetId, setPresetId] = useState<SchedulePresetId>("every_6_hours");
  const [customCron, setCustomCron] = useState("0 2 * * *");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!schedule) return;
    const id = presetFromCron(schedule.cron, schedule.enabled);
    setPresetId(id);
    if (schedule.cron) setCustomCron(schedule.cron);
  }, [schedule]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function applyPreset(id: SchedulePresetId) {
    setPresetId(id);
    if (id === "custom") return;

    const preset = SCHEDULE_PRESETS.find((p) => p.id === id);
    if (!preset) return;

    update(
      {
        enabled: preset.enabled,
        cron: preset.cron ?? "0 */6 * * *",
        timezone: org?.timezone ?? "UTC",
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  function saveCustomCron() {
    update(
      {
        enabled: true,
        cron: customCron.trim() || "0 2 * * *",
        timezone: org?.timezone ?? "UTC",
      },
      { onSuccess: () => setOpen(false) },
    );
  }

  if (isLoading) {
    return (
      <div className="h-9 w-44 animate-pulse rounded-lg bg-slate-100" />
    );
  }

  const displayLabel = getScheduleDisplayLabel(presetId, schedule?.cron);
  const activePreset = SCHEDULE_PRESETS.find((p) => p.id === presetId);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 sm:max-w-[min(100vw-12rem,20rem)] sm:w-auto"
      >
        <Calendar size={15} className="shrink-0 text-slate-400" />
        <span className="min-w-0 flex-1 truncate">
          <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Automatic runs
          </span>
          <span className="block truncate font-medium text-slate-800">{displayLabel}</span>
        </span>
        {isPending ? (
          <Loader2 size={14} className="shrink-0 animate-spin text-slate-400" />
        ) : (
          <ChevronDown
            size={14}
            className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
  <div
    role="listbox"
    className="absolute top-full right-0 max-sm:left-1/2 max-sm:-translate-x-1/2 z-50 mt-2 w-[calc(100vw-2rem)] sm:w-88 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-slate-900/5"
  >
    <div className="border-b border-slate-100 px-4 py-3">
      <p className="text-sm font-semibold text-slate-900">Automatic runs</p>
      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
        Choose how often Entivia should refresh user models and recommendations.
      </p>
    </div>

    <ul className="max-h-[min(24rem,50vh)] overflow-y-auto py-1">
      {SCHEDULE_PRESETS.map((preset) => {
        const selected = presetId === preset.id;
        return (
          <li key={preset.id}>
            <button
              type="button"
              role="option"
              aria-selected={selected}
              disabled={isPending}
              onClick={() => applyPreset(preset.id)}
              className={`flex w-full gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50/80 disabled:opacity-50 ${
                selected ? "bg-orange-50/60" : ""
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  selected
                    ? "border-orange-600 bg-orange-600"
                    : "border-slate-300 bg-white"
                }`}
                aria-hidden
              >
                {selected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-900">
                  {preset.label}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                  {preset.description}
                </span>
              </span>
            </button>
          </li>
        );
      })}

      <li className="border-t border-slate-100">
        <button
          type="button"
          role="option"
          aria-selected={presetId === "custom"}
          disabled={isPending}
          onClick={() => setPresetId("custom")}
          className={`flex w-full gap-3 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 disabled:opacity-50 ${
            presetId === "custom" ? "bg-orange-50/60" : ""
          }`}
        >
          <span
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
              presetId === "custom"
                ? "border-orange-600 bg-orange-600"
                : "border-slate-300 bg-white"
            }`}
            aria-hidden
          >
            {presetId === "custom" && (
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            )}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-medium text-slate-900">
              {CUSTOM_SCHEDULE_PRESET.label}
            </span>
            <span className="mt-0.5 block text-xs leading-snug text-slate-500">
              {CUSTOM_SCHEDULE_PRESET.description}
            </span>
          </span>
        </button>
      </li>
    </ul>

    {presetId === "custom" && (
      <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-3">
        <label className="mb-1 block text-xs font-semibold text-slate-600">
          Cron expression
        </label>
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            value={customCron}
            onChange={(e) => setCustomCron(e.target.value)}
            placeholder="0 2 * * *"
          />
          <button
            type="button"
            disabled={isPending}
            onClick={saveCustomCron}
            className="shrink-0 rounded-lg bg-orange-600 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    )}

    <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-[11px] text-slate-500">
      {schedule?.enabled && activePreset && presetId !== "custom" ? (
        <span>Active: {activePreset.label}</span>
      ) : schedule?.enabled && presetId === "custom" ? (
        <span>
          Active: custom (
          <span className="font-mono">{schedule.cron}</span>)
        </span>
      ) : (
        <span>Automatic runs are off — use Run now when you need fresh results.</span>
      )}
      {schedule?.next_run_at && schedule.enabled && (
        <span className="mt-1 block leading-normal">
          Next run: {new Date(schedule.next_run_at).toLocaleString()}
          {org?.timezone ? ` (${org.timezone})` : ""}
        </span>
      )}
    </div>
  </div>
)}
    </div>
  );
}
