"use client";

import { Shield, Sparkles, MessageSquare, Database, Cpu, Layers } from "lucide-react";

const BENTO_FEATURES = [
  {
    icon: Cpu,
    title: "Risk Scoring Engine",
    description: "Labels every customer, patient, or SKU as Critical, High, Medium, or Healthy automatically based on operational micro-signals in your active database nodes.",
    className: "md:col-span-2",
    badge: "Engine",
    preview: (
      <div className="mt-6 flex flex-col gap-2 font-mono text-[11px] border border-neutral-200 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <span className="text-neutral-500">ENTITY ID</span>
          <span className="text-neutral-500">RISK METRIC</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-neutral-800">SUB-9023 (Telecom)</span>
          <span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100 font-bold">CRITICAL (94%)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-neutral-800">SKU-4402 (FMCG)</span>
          <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded border border-amber-100 font-bold">HIGH RISK</span>
        </div>
      </div>
    )
  },
  {
    icon: Layers,
    title: "Recommendation Queue",
    description: "Surfaces ranked, real-time next steps—such as specific retention bundles, targeted reorders, or staff re-allocations—complete with instant draft outreach templates.",
    className: "md:col-span-1",
    badge: "Queue",
    preview: (
      <div className="mt-6 bg-neutral-900 text-white p-4 rounded-xl shadow-md font-mono text-[10px] space-y-1">
        <div className="text-orange-400 font-bold">⚡ REC_ACTION_01: RESUB_OFFER</div>
        <div className="text-neutral-400">Target: Critical Churn Groups</div>
        <div className="text-neutral-500 bg-neutral-800 p-1.5 rounded mt-2">&quot;Hello [Name], reactivate your data plan today for...&quot;</div>
      </div>
    )
  },
  {
    icon: MessageSquare,
    title: "Conversational Agent",
    description: "Plain-English chat interface driven by robust, multi-step structured tool calling. It converts queries to live read-only SQL commands with zero AI hallucination.",
    className: "md:col-span-1",
    badge: "AI Agent",
    preview: (
      <div className="mt-4 space-y-2">
        <div className="bg-neutral-100 p-2.5 rounded-xl rounded-tl-none text-xs text-neutral-700 max-w-[85%]">
          &quot;Which hospital wards are at risk of overflow right now?&quot;
        </div>
        <div className="bg-orange-50 text-(--mk-accent,#ea580c) border border-orange-100 p-2.5 rounded-xl rounded-tr-none text-xs max-w-[85%] ml-auto font-mono text-[11px]">
          🔍 Running: SELECT ward_id FROM live_admissions...
        </div>
      </div>
    )
  },
  {
    icon: Database,
    title: "Live Database Connectors",
    description: "Integrates with Postgres, MySQL, MSSQL, SQLite, or CSV uploads instantly using fully encrypted runtime credential frameworks.",
    className: "md:col-span-2",
    badge: "Integrations",
    preview: (
      <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-mono text-neutral-600">
        <div className="border border-neutral-200 bg-neutral-50/50 p-2 rounded-lg">PostgreSQL</div>
        <div className="border border-neutral-200 bg-neutral-50/50 p-2 rounded-lg">MySQL</div>
        <div className="border border-neutral-200 bg-neutral-50/50 p-2 rounded-lg">MSSQL</div>
      </div>
    )
  },
  {
    icon: Shield,
    title: "Role-Based Access Control",
    description: "Granular administrative layers supporting distinct Admin, Operations Manager, Analyst, and strict Read-Only permission models.",
    className: "md:col-span-1",
    badge: "RBAC"
  },
  {
    icon: Sparkles,
    title: "Automated Pipeline Scheduler",
    description: "Run diagnostic cycles on continuous cron schedules or trigger automated pipeline refreshes instantly on-demand using custom webhook endpoints.",
    className: "md:col-span-2",
    badge: "Automation"
  }
];

export default function Features() {
  return (
    <section
      id="features"
      data-navbar-theme="light"
      className="bg-neutral-50 text-neutral-900 py-24 sm:py-32 border-b border-neutral-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider mb-5">
            <Layers className="w-3.5 h-3.5" />
            Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-serif tracking-tight text-neutral-900 leading-[1.1]">
            Engineered for speed, privacy, and absolute accuracy.
          </h2>
          <p className="mt-6 text-neutral-500 text-lg sm:text-xl max-w-2xl leading-relaxed">
            Everything your operations team needs to reason, query, and take immediate steps directly from data tables.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {BENTO_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={[
                  "border border-neutral-200 bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300",
                  feat.className || ""
                ].join(" ")}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider bg-neutral-100 border border-neutral-200/60 text-neutral-500 px-2.5 py-0.5 rounded-full">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-neutral-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                {feat.preview ? (
                  <div className="w-full mt-4">
                    {feat.preview}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}