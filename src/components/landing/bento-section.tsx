import { Brain } from "lucide-react";

const cards = [
  {
    num: "01",
    title: "No engineers. No setup project.",
    visual: (
      <div className="flex h-40 items-center justify-center">
        <span className="select-none bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-6xl font-black text-transparent">
          zero
        </span>
      </div>
    ),
  },
  {
    num: "02",
    title: "Live risk scores on every entity",
    visual: (
      <div className="flex h-40 items-end justify-center gap-3 pb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-700 text-2xl font-black text-rose-400">
          91
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-700 text-lg font-black text-amber-400">
          73
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-base font-black text-emerald-400">
          42
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "What to do next — ranked for your team",
    visual: (
      <div className="flex h-40 flex-col justify-center gap-2 px-1">
        <div className="rounded-xl border border-[var(--mk-border)] bg-zinc-700/60 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-white">Action ready</p>
            <span className="text-[9px] text-zinc-500">Just now</span>
          </div>
          <p className="mt-0.5 text-[10px] text-zinc-400">
            Amina Bello · Offer 7-day bundle
          </p>
        </div>
        <div className="rounded-xl border border-[var(--mk-border)] bg-zinc-700/30 px-4 py-2.5">
          <p className="text-[10px] text-zinc-500">Lagos Ward B · Reallocate nurses</p>
        </div>
      </div>
    ),
  },
  {
    num: "04",
    title: "Connect any data source",
    visual: (
      <div className="flex h-28 flex-wrap items-center gap-2">
        {[
          { label: "PG", active: true },
          { label: "MY", active: false },
          { label: "MS", active: false },
          { label: "SQL", active: false },
          { label: "CSV", active: false },
        ].map((db) => (
          <span
            key={db.label}
            className={[
              "rounded-lg px-3 py-1.5 text-[11px] font-black",
              db.active
                ? "bg-[var(--mk-accent)] text-white"
                : "border border-[var(--mk-border)] text-zinc-500",
            ].join(" ")}
          >
            {db.label}
          </span>
        ))}
      </div>
    ),
  },
  {
    num: "05",
    title: "Profile every entity type",
    visual: (
      <div className="flex h-28 items-center">
        {[
          { initial: "C", active: true },
          { initial: "P", active: false },
          { initial: "R", active: false },
          { initial: "S", active: false },
          { initial: "U", active: false },
        ].map((e, i) => (
          <div
            key={e.initial}
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-[var(--mk-surface)]",
              e.active ? "bg-[var(--mk-accent)]" : "bg-zinc-600",
            ].join(" ")}
            style={{ marginLeft: i > 0 ? "-10px" : 0 }}
          >
            {e.initial}
          </div>
        ))}
      </div>
    ),
  },
  {
    num: "06",
    title: "Ask your data in plain English",
    visual: (
      <div className="flex h-28 items-center">
        <div className="flex w-full items-center gap-2.5 rounded-full border border-[var(--mk-border)] bg-zinc-700/60 px-4 py-3">
          <Brain size={13} className="shrink-0 text-[var(--mk-accent)]" />
          <span className="truncate text-[11px] text-zinc-400">
            Who are my highest-risk customers?
          </span>
        </div>
      </div>
    ),
  },
];

export default function BentoSection() {
  return (
    <section
      data-navbar-theme="dark"
      className="bg-[var(--mk-surface)] px-4 py-24 md:px-10 lg:px-28"
    >
      <div className="mb-12 max-w-xl">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--mk-accent)]">
          Why Entivia
        </span>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-[var(--mk-text)] md:text-5xl">
          Built for operators,
          <br />
          not analysts.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.num}
            className="rounded-2xl border border-[var(--mk-border)] bg-[var(--mk-surface-2)] p-6"
          >
            {card.visual}
            <p className="mt-3 text-[11px] font-semibold text-[var(--mk-text-faint)]">
              {card.num} —
            </p>
            <h3 className="mt-1.5 text-xl font-black text-[var(--mk-text)]">
              {card.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
