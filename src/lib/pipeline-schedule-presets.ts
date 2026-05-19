export type SchedulePresetId =
  | "manual"
  | "every_6_hours"
  | "daily_2am"
  | "daily_6am"
  | "weekly_monday"
  | "custom";

export type SchedulePreset = {
  id: SchedulePresetId;
  label: string;
  description: string;
  enabled: boolean;
  cron: string | null;
};

export const SCHEDULE_PRESETS: SchedulePreset[] = [
  {
    id: "manual",
    label: "Manual only",
    description: "Run the pipeline when you click Run now.",
    enabled: false,
    cron: null,
  },
  {
    id: "every_6_hours",
    label: "Every 6 hours",
    description: "Keeps scores and recommendations fresh throughout the day.",
    enabled: true,
    cron: "0 */6 * * *",
  },
  {
    id: "daily_2am",
    label: "Daily at 2:00 AM",
    description: "Once per night in your organization timezone.",
    enabled: true,
    cron: "0 2 * * *",
  },
  {
    id: "daily_6am",
    label: "Daily at 6:00 AM",
    description: "Ready for your team at the start of the work day.",
    enabled: true,
    cron: "0 6 * * *",
  },
  {
    id: "weekly_monday",
    label: "Weekly on Monday",
    description: "Every Monday at 2:00 AM.",
    enabled: true,
    cron: "0 2 * * 1",
  },
];

export const CUSTOM_SCHEDULE_PRESET: SchedulePreset = {
  id: "custom",
  label: "Custom schedule",
  description: "For advanced users — enter a cron expression.",
  enabled: true,
  cron: null,
};

export function presetFromCron(
  cron: string | null | undefined,
  enabled: boolean,
): SchedulePresetId {
  if (!enabled) return "manual";
  const match = SCHEDULE_PRESETS.find((p) => p.cron === cron);
  return match?.id ?? "custom";
}

export function getScheduleDisplayLabel(
  presetId: SchedulePresetId,
  cron?: string | null,
): string {
  if (presetId === "custom") {
    return cron ? `Custom (${cron})` : "Custom schedule";
  }
  const preset = SCHEDULE_PRESETS.find((p) => p.id === presetId);
  return preset?.label ?? "Manual only";
}
