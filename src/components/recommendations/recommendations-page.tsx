import { AlertTriangle, CheckCircle2, Clock, Filter } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { RiskPill } from "@/components/shared/risk-pill";
import { SectionHeading } from "@/components/shared/section-heading";
import { SummaryCard } from "@/components/shared/summary-card";
import { recommendationSummary, recommendations } from "@/lib/demo-data";

export function RecommendationsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHero
        eyebrow="Recommendations"
        title="Prioritized next-best actions for operational teams."
        description="Recommendations are generated from live risk patterns and stored as action metadata, so operators can assign, escalate, dismiss, and track outcomes."
        action="Generate refresh"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {recommendationSummary.map((item) => (
          <SummaryCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeading eyebrow="Queue" title="Recommendations requiring action" />
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
              <Filter size={15} />
              Filter queue
            </button>
          </div>

          <div className="space-y-4">
            {recommendations.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <RiskPill risk={item.urgency} />
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                        {item.status}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-semibold text-slate-950">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      {item.entity} · {item.owner} · {item.impact}
                    </p>
                    <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                      {item.reason}
                    </p>
                  </div>
                  <div className="min-w-40 rounded-xl bg-white p-4 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Confidence
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-slate-950">
                      {item.confidence}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-200 pt-4">
                  <button className="h-9 rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white">
                    Mark actioned
                  </button>
                  <button className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                    Escalate
                  </button>
                  <button className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                    Dismiss
                  </button>
                  <button className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                    Draft action
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="SLA" title="Today's operating state" />
            <div className="space-y-4">
              {[
                { label: "Critical actions", value: "47 pending", icon: AlertTriangle, tone: "text-rose-600 bg-rose-50" },
                { label: "Due in 4 hours", value: "83 recommendations", icon: Clock, tone: "text-amber-600 bg-amber-50" },
                { label: "Actioned today", value: "128 closed", icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
              ].map(({ label, value, icon: Icon, tone }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{label}</p>
                    <p className="text-sm text-slate-500">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <SectionHeading eyebrow="API mapping" title="Future endpoint shape" />
            <div className="space-y-2 text-sm text-slate-700">
              <p>/api/recommendations?status=open</p>
              <p>/api/recommendations/:id/action</p>
              <p>/api/recommendations/:id/escalate</p>
              <p>/api/recommendations/:id/outcome</p>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
