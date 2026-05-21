/* Industry mockups — no fake window chrome. Just the UI. */
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Heart,
  MapPin,
  Package,
  Phone,
  Users,
} from "lucide-react";

const FRAME =
  "rounded-2xl border border-[var(--mk-border)] bg-[var(--mk-surface)] p-6";

/* ---------- Telecom ---------- */
export function TelecomMock() {
  return (
    <div className={FRAME}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--mk-text-faint)]">Subscriber</p>
          <p className="mt-0.5 font-mono text-sm text-[var(--mk-text)]">
            C-004821 · Amina B.
          </p>
        </div>
        <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
          Critical
        </span>
      </div>

      <div className="mt-6 flex items-end gap-6">
        <div className="relative h-28 w-28">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--mk-border)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--mk-accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(91 / 100) * 264} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-[var(--mk-text)]">91</span>
            <span className="text-[9px] uppercase tracking-widest text-[var(--mk-text-faint)]">
              risk
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <SignalRow icon={<Phone size={11} />} label="Usage trend" value="-62%" tone="bad" />
          <SignalRow icon={<Activity size={11} />} label="Last recharge" value="14d" tone="warn" />
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--mk-border)] pt-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--mk-text-faint)]">
          Recommended action
        </p>
        <p className="mt-1.5 text-sm text-[var(--mk-text)]">
          Offer 7-day bundle. 71% accept rate on similar profiles.
        </p>
      </div>
    </div>
  );
}

function SignalRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "bad" | "warn" | "ok";
}) {
  const color =
    tone === "bad"
      ? "text-rose-400"
      : tone === "warn"
        ? "text-amber-400"
        : "text-emerald-400";
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={color}>{icon}</span>
      <span className="flex-1 text-[var(--mk-text-muted)]">{label}</span>
      <span className={`font-mono font-semibold ${color}`}>{value}</span>
    </div>
  );
}

/* ---------- Healthcare ---------- */
export function HealthcareMock() {
  const wards = [
    { id: "A", pct: 72, staff: 6, tone: "med" },
    { id: "B", pct: 94, staff: 4, tone: "hi" },
    { id: "C", pct: 41, staff: 8, tone: "lo" },
    { id: "D", pct: 88, staff: 5, tone: "hi" },
    { id: "E", pct: 56, staff: 7, tone: "lo" },
    { id: "F", pct: 33, staff: 9, tone: "lo" },
  ] as const;

  const styles = {
    hi: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    med: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    lo: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  } as const;

  return (
    <div className={FRAME}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-[var(--mk-text)]">Lagos General</p>
        <p className="text-xs text-[var(--mk-text-faint)]">Live · 6 wards</p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {wards.map((w) => {
          const s = styles[w.tone];
          return (
            <div key={w.id} className={`rounded-xl border p-3 ${s}`}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase text-[var(--mk-text-faint)]">
                  Ward {w.id}
                </span>
                <Heart size={10} />
              </div>
              <p className="mt-2 text-xl font-black">{w.pct}%</p>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-[var(--mk-text-faint)]">
                <Users size={9} />
                {w.staff}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[var(--mk-border)] pt-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--mk-text-faint)]">
          Recommended action
        </p>
        <p className="mt-1.5 text-sm text-[var(--mk-text)]">
          Reallocate 2 nurses from Ward C to Ward B.
        </p>
      </div>
    </div>
  );
}

/* ---------- Retail ---------- */
const STATUS_STYLES = {
  critical: { tile: "bg-rose-500/15", icon: "text-rose-400", text: "text-rose-400" },
  warning: { tile: "bg-amber-500/15", icon: "text-amber-400", text: "text-amber-400" },
  ok: { tile: "bg-emerald-500/10", icon: "text-emerald-400", text: "text-emerald-400" },
} as const;

export function RetailMock() {
  const stores: Array<{
    name: string;
    sku: string;
    days: number;
    status: keyof typeof STATUS_STYLES;
  }> = [
    { name: "Ikeja 12", sku: "SKU-8842", days: 3, status: "critical" },
    { name: "Lekki 04", sku: "SKU-2210", days: 7, status: "warning" },
    { name: "Surulere", sku: "SKU-1093", days: 12, status: "ok" },
    { name: "Yaba", sku: "SKU-5544", days: 18, status: "ok" },
  ];

  return (
    <div className={FRAME}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-[var(--mk-text)]">Inventory cover</p>
        <p className="text-xs text-rose-400">3 stockouts forecast</p>
      </div>

      <div className="mt-5 space-y-2">
        {stores.map((s) => {
          const c = STATUS_STYLES[s.status];
          return (
            <div
              key={s.name}
              className="flex items-center gap-3 rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg)] p-3"
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${c.tile}`}>
                <Package size={15} className={c.icon} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-[var(--mk-text)]">{s.name}</p>
                <p className="font-mono text-[10px] text-[var(--mk-text-faint)]">
                  {s.sku}
                </p>
              </div>
              <p className={`font-mono text-sm font-bold ${c.text}`}>
                {s.days}d
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[var(--mk-border)] pt-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--mk-text-faint)]">
          Recommended action
        </p>
        <p className="mt-1.5 text-sm text-[var(--mk-text)]">
          Reorder 240 units at Ikeja 12. Lead time 2 days.
        </p>
      </div>
    </div>
  );
}

/* ---------- Logistics ---------- */
export function LogisticsMock() {
  const stops = [
    { city: "Lagos", time: "06:00", delay: 0 },
    { city: "Ibadan", time: "08:45", delay: 12 },
    { city: "Akure", time: "11:30", delay: 28 },
    { city: "Abuja", time: "16:15", delay: 45 },
  ];
  return (
    <div className={FRAME}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-[var(--mk-text)]">LAG-ABJ-04</p>
        <p className="text-xs text-[var(--mk-text-faint)]">Driver · Musa K.</p>
      </div>

      <div className="relative mt-5 pl-6">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--mk-border)]" />
        {stops.map((s, i) => {
          const late = s.delay > 0;
          return (
            <div key={s.city} className="relative mb-3 last:mb-0">
              <span
                className={[
                  "absolute -left-6 top-2 h-3.5 w-3.5 rounded-full border-2 bg-[var(--mk-surface)]",
                  late ? "border-rose-500" : "border-emerald-500",
                ].join(" ")}
              />
              <div className="flex items-center justify-between rounded-lg border border-[var(--mk-border)] bg-[var(--mk-bg)] px-3 py-2">
                <div className="flex items-center gap-2">
                  <MapPin size={11} className="text-[var(--mk-text-faint)]" />
                  <span className="text-sm text-[var(--mk-text)]">{s.city}</span>
                  <span className="font-mono text-[10px] text-[var(--mk-text-faint)]">
                    {s.time}
                  </span>
                </div>
                {late ? (
                  <span className="font-mono text-[10px] font-bold text-rose-400">
                    +{s.delay}m
                  </span>
                ) : (
                  <span className="font-mono text-[10px] font-bold text-emerald-400">
                    on time
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[var(--mk-border)] pt-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--mk-text-faint)]">
          Recommended action
        </p>
        <p className="mt-1.5 text-sm text-[var(--mk-text)]">
          Reroute via alternate hub. Saves about 45 minutes.
        </p>
      </div>
    </div>
  );
}

/* ---------- Public sector ---------- */
export function PublicSectorMock() {
  const bars = [40, 55, 48, 70, 92, 88, 60, 45, 38, 50, 64, 78];
  const peak = 4;
  return (
    <div className={FRAME}>
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-[var(--mk-text)]">North Central · ID registration</p>
        <p className="text-xs text-[var(--mk-text-faint)]">Week 21</p>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_110px] items-end gap-4">
        <div className="flex h-28 items-end gap-1.5">
          {bars.map((h, i) => (
            <div key={i} className="relative flex-1">
              <div
                className={[
                  "w-full rounded-t-sm",
                  i === peak ? "bg-[var(--mk-accent)]" : "bg-[var(--mk-border)]",
                ].join(" ")}
                style={{ height: `${h}%` }}
              />
              {i === peak && (
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 rounded bg-[var(--mk-accent)] px-1 py-0.5 font-mono text-[8px] font-bold text-white">
                  PEAK
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <Stat label="Applications" value="+34%" up />
          <Stat label="Avg wait" value="42m" />
          <Stat label="Backlog" value="218" />
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--mk-border)] pt-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--mk-text-faint)]">
          Recommended action
        </p>
        <p className="mt-1.5 text-sm text-[var(--mk-text)]">
          Add weekend desk hours. Clears 40% of backlog in pilot regions.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, up }: { label: string; value: string; up?: boolean }) {
  return (
    <div className="rounded border border-[var(--mk-border)] bg-[var(--mk-bg)] px-2 py-1.5">
      <p className="text-[9px] uppercase tracking-wider text-[var(--mk-text-faint)]">
        {label}
      </p>
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-[var(--mk-text)]">{value}</span>
        {up && <ArrowUp size={10} className="text-rose-400" />}
        {value.startsWith("-") && <ArrowDown size={10} className="text-rose-400" />}
      </div>
    </div>
  );
}
