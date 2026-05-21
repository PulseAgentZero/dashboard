"use client";

const PRESETS: { label: string; cron: string }[] = [
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Daily at 9am", cron: "0 9 * * *" },
  { label: "Every Sunday", cron: "0 9 * * 0" },
  { label: "Every Monday", cron: "0 9 * * 1" },
];

type Props = {
  value: string;
  enabled: boolean;
  onChange: (cron: string) => void;
  onEnabledChange: (enabled: boolean) => void;
  disabled?: boolean;
};

export function CronBuilder({ value, enabled, onChange, onEnabledChange, disabled }: Props) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          disabled={disabled}
          className="rounded border-slate-300"
        />
        Auto-refresh on schedule
      </label>
      {enabled && (
        <>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="0 9 * * *"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.cron}
                type="button"
                disabled={disabled}
                onClick={() => onChange(p.cron)}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-50"
              >
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

