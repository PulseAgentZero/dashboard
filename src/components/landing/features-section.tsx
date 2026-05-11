import Image from "next/image";
import { ArrowRight, Copy, Zap, BarChart3, Brain } from "lucide-react";
import { BladeFan } from "../../../public/icon/bladeFan";

function CTALink({
  label,
  color = "text-blue-600",
  border = "border-blue-600",
}: {
  label: string;
  color?: string;
  border?: string;
}) {
  return (
    <a
      href="#"
      className={`mt-10 flex items-center gap-2.5 text-[15px] font-semibold ${color} group`}
    >
      {label}
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${border} transition-all group-hover:opacity-60`}
      >
        <ArrowRight size={13} />
      </span>
    </a>
  );
}

/* ── Section 1: DATA CONNECTION (blue rounded card) ─────────────────── */
function DataConnectionCard() {
  const fields = [
    "Entity Name",
    "Primary Key",
    "Signal Column",
    "Timestamp",
    "Risk Score",
  ];
  const sources = [
    { label: "PG", color: "bg-blue-600" },
    { label: "MY", color: "bg-orange-500" },
    { label: "BQ", color: "bg-indigo-600" },
  ];

  return (
    <div className="mx-4 overflow-hidden rounded-3xl border border-blue-200 bg-[#d9e3f7] md:mx-10 lg:mx-28">
      <div className="grid min-h-160 md:grid-cols-2">
        {/* Left text */}
        <div className="flex flex-col justify-center px-10 py-20 md:px-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
            Data Connection
          </span>
          <h3 className="mt-4 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
            Connect any database in minutes
          </h3>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-600">
            Point Pulse at your PostgreSQL, MySQL, or data warehouse. Schema
            detection and entity mapping happen automatically — no engineers
            required.
          </p>
          <CTALink label="Get connected" />
        </div>

        {/* Right mockup */}
        <div className="flex items-end justify-center px-10 pt-12 md:justify-end md:px-14">
          <div className="w-full max-w-sm overflow-hidden rounded-t-2xl bg-white shadow-2xl shadow-blue-200/60">
            {/* Source badges */}
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              {sources.map((s) => (
                <span
                  key={s.label}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black text-white ${s.color}`}
                >
                  {s.label}
                </span>
              ))}
            </div>
            {/* Schema fields */}
            {fields.map((f) => (
              <div
                key={f}
                className="flex items-center justify-between border-b border-slate-50 px-5 py-3.5"
              >
                <span className="text-[13px] text-slate-500">{f}</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-20 rounded-full bg-slate-100" />
                  <Copy size={12} className="text-blue-400" />
                </div>
              </div>
            ))}
            {/* Bottom pills */}
            <div className="flex gap-2 bg-slate-50 px-5 py-4">
              {["⚡ Live Sync", "📊 Schema", "📋 Mapping"].map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section 2: ENTITY PROFILES (purple split, equal width) ─────────── */
function EntityProfilesCard() {
  return (
    <div className="mx-4 overflow-hidden rounded-3xl border border-purple-200 bg-[#e8d8f7] md:mx-10 lg:mx-28">
      <div className="flex min-h-160 overflow-hidden">
        {/* Right panel */}
        <div className="relative flex w-full flex-col justify-center bg-[#e8d8f7] px-10 py-20 md:w-[55%] md:px-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-purple-700">
            Entity Profiles
          </span>
          <h3 className="mt-4 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
            Understand every entity automatically
          </h3>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-700">
            Pulse builds live behavioral profiles for every customer, patient,
            product, or unit in your data. Risk scores, signals, and trends —
            updated in real time.
          </p>
          <CTALink
            label="Explore profiles"
            color="text-purple-700"
            border="border-purple-700"
          />
        </div>
        {/* Left photo */}
        <div className="relative hidden w-[45%] overflow-hidden md:block">
          <Image
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&auto=format&fit=crop&q=80"
            alt="Entity profile"
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Section 3: ACTION QUEUE (green rounded card) ───────────────────── */
function ActionQueueCard() {
  const recommendations = [
    {
      urgency: "Critical",
      name: "Amina Bello",
      action: "Offer 7-day data bundle",
      color: "bg-rose-100 text-rose-700",
    },
    {
      urgency: "High",
      name: "Lagos Ward B",
      action: "Reallocate 3 night nurses",
      color: "bg-amber-100 text-amber-700",
    },
    {
      urgency: "Medium",
      name: "Route EKY-18",
      action: "Move delivery window 45 min",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <div className="mx-4 overflow-hidden rounded-3xl border border-green-200 bg-[#dff0d9] md:mx-10 lg:mx-28">
      <div className="grid min-h-160 md:grid-cols-2">
        {/* Left text */}
        <div className="flex flex-col justify-center px-10 py-20 md:px-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-green-700">
            Action Queue
          </span>
          <h3 className="mt-4 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
            Know exactly what to do next
          </h3>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-700">
            A prioritized queue of what needs to happen, ranked by urgency,
            impact, and confidence. Assign, dismiss, or escalate with one tap.
          </p>
          <CTALink
            label="View queue"
            color="text-green-700"
            border="border-green-700"
          />
        </div>

        {/* Right mockup */}
        <div className="relative flex items-end justify-center px-10 pt-12 md:justify-end md:px-14">
          {/* Phone frame */}
          <div className="relative w-72 h-120 flex flex-col overflow-hidden rounded-t-[3rem] border-x-[7px] border-t-[7px] border-slate-950 bg-white shadow-2xl">
            {/* Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-950 rounded-full z-30"></div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-7 pt-4 pb-2">
              <span className="text-[10px] font-bold text-slate-900">9:41</span>
              <div className="flex gap-1.5 items-center">
                <div className="w-3.5 h-2 border border-slate-900/30 rounded-[2px] relative">
                  <div className="absolute -right-1 top-0.5 w-0.5 h-1 bg-slate-900/30 rounded-r-full"></div>
                </div>
              </div>
            </div>

            {/* App Header */}
            <div className="px-5 py-4">
              <h2 className="text-[17px] font-black text-slate-900 tracking-tight">
                Priority
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Queue
              </p>
            </div>

            {/* Content Area - Grows to fill height */}
            <div className="flex-1 px-3 space-y-2.5 overflow-hidden">
              {recommendations.map((r) => (
                <div
                  key={r.name}
                  className="group px-4 py-4 rounded-[1.25rem] bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${r.color}`}
                    >
                      {r.urgency}
                    </span>
                    <span className="text-[11px] font-bold text-slate-800">
                      {r.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {r.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section 4: AI AGENT (beige split, equal width) ─────────────────── */
function AgentCard() {
  return (
    <div className="mx-4 overflow-hidden rounded-3xl border border-amber-200 bg-[#f5e8d5] md:mx-10 lg:mx-28">
      <div className="flex min-h-160 overflow-hidden">
        {/* Left photo */}
        <div className="relative hidden w-[45%] gap-3.5 overflow-hidden md:block">
          <Image
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80"
            alt="AI Agent user"
            fill
            className="object-cover object-center"
          />

          {/* Notification card */}
          <div className="absolute bottom-4 left-4 flex max-w-sm items-center gap-4 rounded-2xl bg-white/80 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md border border-slate-100 hidden md:flex">
            <div>
              <div className="animate-spin" style={{ animationDuration: "2s" }}>
              <BladeFan />
            </div>
            </div>

            {/* Content Area */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] font-bold text-slate-900">
                  Analysis complete
                </p>
                <span className="shrink-0 text-[10px] font-medium text-slate-400">
                  Just now
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-500 truncate">
                Profile for{" "}
                <span className="text-slate-700 font-semibold">
                  Amina Bello
                </span>{" "}
                (SUB-00445) updated
              </p>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex w-full flex-col justify-center bg-[#f5e8d5] px-10 py-20 md:w-[50%] md:px-16">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
            AI Agent
          </span>
          <h3 className="mt-4 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl">
            Ask your data anything, in plain English.
          </h3>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-slate-700">
            Foreign or local data? The Pulse agent answers operational questions
            grounded in live queries. No SQL. No waiting for a report.
          </p>
          <CTALink
            label="Try the agent"
            color="text-amber-700"
            border="border-amber-700"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────────────── */
export default function FeaturesSection() {
  return (
    <section className="space-y-6 bg-white py-10">
      <DataConnectionCard />
      <EntityProfilesCard />
      <ActionQueueCard />
      <AgentCard />
    </section>
  );
}
