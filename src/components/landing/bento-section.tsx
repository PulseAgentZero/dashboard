import { Brain } from "lucide-react";

const cards = [
  {
    num: "01",
    title: "Zero data engineering required",
    visual: (
      <div className="flex h-40 items-center justify-center">
        <span className="select-none bg-linear-to-r from-blue-400 to-indigo-500 bg-clip-text text-6xl font-black text-transparent">
          zero
        </span>
      </div>
    ),
  },
  {
    num: "02",
    title: "Live entity risk scoring",
    visual: (
      <div className="flex h-40 items-end justify-center gap-3 pb-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-700 text-2xl font-black text-rose-400">
          91
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-lg font-black text-amber-400">
          73
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-base font-black text-emerald-400">
          42
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "Instant action recommendations",
    visual: (
      <div className="flex h-40 flex-col justify-center gap-2 px-1">
        <div className="rounded-xl border border-white/[0.06] bg-slate-700/60 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-white">Action ready</p>
            <span className="text-[9px] text-slate-500">Just now</span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Amina Bello · Offer 7-day bundle
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.04] bg-slate-700/30 px-4 py-2.5">
          <p className="text-[10px] text-slate-500">Lagos Ward B · Reallocate nurses</p>
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
          { label: "PG", color: "bg-blue-600" },
          { label: "MY", color: "bg-orange-500" },
          { label: "BQ", color: "bg-indigo-600" },
          { label: "MS", color: "bg-cyan-600" },
          { label: "RD", color: "bg-red-500" },
        ].map((db) => (
          <span
            key={db.label}
            className={`rounded-lg ${db.color} px-3 py-1.5 text-[11px] font-black text-white`}
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
          { initial: "C", color: "bg-blue-500", label: "Customer" },
          { initial: "P", color: "bg-purple-500", label: "Patient" },
          { initial: "R", color: "bg-emerald-500", label: "Route" },
          { initial: "S", color: "bg-amber-500", label: "Store" },
          { initial: "U", color: "bg-rose-500", label: "Unit" },
        ].map((e, i) => (
          <div
            key={e.initial}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-[#131625] ${e.color}`}
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
        <div className="flex w-full items-center gap-2.5 rounded-full border border-white/[0.06] bg-slate-700/60 px-4 py-3">
          <Brain size={13} className="shrink-0 text-blue-400" />
          <span className="truncate text-[11px] text-slate-400">
            Who are my highest-risk customers?
          </span>
        </div>
      </div>
    ),
  },
];

export default function BentoSection() {
  return (
    <section className="bg-[#0d0f1a] px-4 py-24 md:px-10 lg:px-28">
      {/* Heading */}
      <div className="mb-12 max-w-xl">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
          Why Pulse
        </span>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white md:text-5xl">
          Built for operators,
          <br />
          not analysts.
        </h2>
      </div>

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.num}
            className="rounded-2xl border border-white/[0.06] bg-[#131625] p-6"
          >
            {card.visual}
            <p className="mt-3 text-[11px] font-semibold text-slate-500">
              {card.num} —
            </p>
            <h3 className="mt-1.5 text-xl font-black text-white">{card.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
