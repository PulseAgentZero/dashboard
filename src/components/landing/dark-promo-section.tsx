import Link from "next/link";

function PhoneMockup() {
  const actions = [
    { urgency: "Critical", name: "Amina Bello", action: "Offer 7-day data bundle", color: "text-rose-400", dot: "bg-rose-500" },
    { urgency: "High", name: "Lagos Ward B", action: "Reallocate 3 night nurses", color: "text-amber-400", dot: "bg-amber-500" },
    { urgency: "Medium", name: "Route EKY-18", action: "Shift delivery 45 min", color: "text-blue-400", dot: "bg-blue-500" },
  ];

  return (
    <div className="relative w-[255px] overflow-hidden rounded-[38px] border-[3px] border-slate-700 bg-slate-950 shadow-2xl shadow-black/70">
      {/* Notch */}
      <div className="flex justify-center bg-slate-950 pt-3 pb-1">
        <div className="h-5 w-20 rounded-full bg-black" />
      </div>

      {/* Status bar */}
      <div className="flex justify-between px-5 pb-2">
        <span className="text-[10px] font-semibold text-white">9:41</span>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-3.5 rounded-sm bg-white/50" />
          <div className="h-2 w-0.5 rounded-sm bg-white/30" />
        </div>
      </div>

      {/* Balance card */}
      <div className="mx-3 mb-3 rounded-2xl bg-blue-600 p-4">
        <p className="text-[9px] font-bold uppercase tracking-widest text-blue-200">Action Queue</p>
        <p className="mt-1 text-[26px] font-black leading-none text-white">14 items</p>
        <p className="mt-1 text-[10px] text-blue-200">3 critical · 6 high · 5 medium</p>
      </div>

      {/* Action rows */}
      <div className="space-y-2 px-3 pb-4">
        {actions.map((a) => (
          <div key={a.name} className="rounded-xl bg-slate-800/70 px-3 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
                <span className={`text-[9px] font-bold uppercase ${a.color}`}>{a.urgency}</span>
              </div>
              <span className="text-[9px] text-slate-500">now</span>
            </div>
            <p className="mt-0.5 text-[11px] font-semibold text-white">{a.name}</p>
            <p className="text-[9px] text-slate-400">{a.action}</p>
          </div>
        ))}
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-3">
        <div className="h-1 w-20 rounded-full bg-white/20" />
      </div>
    </div>
  );
}

export default function DarkPromoSection() {
  return (
    <section className="bg-[#0b0d14] py-28">
      <div className="container mx-auto grid items-center gap-16 px-6 md:grid-cols-12">
        {/* Left */}
        <div className="text-white md:col-span-7 lg:pr-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
            Operational Intelligence
          </span>
          <h2 className="mt-4 text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Intelligence that
            <br />
            <span className="text-blue-400">acts for you.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-slate-400">
            Pulse turns raw database records into a live action queue — so your
            team always knows exactly what to do next, without digging through
            dashboards or writing a single query.
          </p>
          <Link
            href="/auth/signup"
            className="mt-10 inline-flex items-center rounded-xl bg-blue-600 px-8 py-4 text-[15px] font-bold text-white shadow-lg shadow-blue-900/40 transition-all hover:-translate-y-0.5 hover:bg-blue-500"
          >
            Get started — it&apos;s free
          </Link>
        </div>

        {/* Right */}
        <div className="flex justify-center md:col-span-5 md:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
