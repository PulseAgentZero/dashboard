import { BarChart3, GitCompareArrows, LineChart, PieChart } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { SummaryCard } from "@/components/shared/summary-card";
import { segments, trend } from "@/lib/demo-data";

const analyticsSummary = [
  { label: "Tracked metrics", value: "24", detail: "Mapped from configured signal columns" },
  { label: "Cohorts", value: "8", detail: "Behavior groups detected this month" },
  { label: "Anomalies", value: "7", detail: "Statistical shifts since last login" },
  { label: "Export jobs", value: "16", detail: "CSV and PNG reports generated" },
];

const cohorts = [
  { name: "Declining engagement", entities: "1,284", change: "-18.4%", tone: "bg-rose-500" },
  { name: "Capacity constrained", entities: "412", change: "+11.2%", tone: "bg-amber-400" },
  { name: "Stable behavior", entities: "31,904", change: "+4.7%", tone: "bg-emerald-500" },
  { name: "Newly activated", entities: "3,118", change: "+22.1%", tone: "bg-blue-600" },
];

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHero
        eyebrow="Trend and analytics"
        title="Understand how risk, behavior, and segments move over time."
        description="The PRD calls for time-series charts, segment comparison, cohort analysis, and exports. This page gives operations teams a deeper view beyond the daily action queue."
        action="Export report"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsSummary.map((item) => (
          <SummaryCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeading eyebrow="Time series" title="Risk score movement" action="Metric: risk_score" />
          <div className="flex h-80 items-end gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 pb-4 pt-6">
            {trend.map((value, index) => (
              <div key={`${value}-${index}`} className="flex h-full flex-1 flex-col justify-end gap-2">
                <div className="rounded-t-lg bg-blue-600" style={{ height: `${value}%` }} />
                <span className="text-center text-[10px] font-semibold text-slate-400">W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="Comparison" title="Segment performance" />
            <div className="space-y-4">
              {segments.map((segment) => (
                <div key={segment.name}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-950">{segment.name}</span>
                    <span className="text-slate-500">{segment.change}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className={`h-2 rounded-full ${segment.color}`} style={{ width: `${segment.risk}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="Views" title="Analysis modes" />
            <div className="grid gap-3">
              {[
                { label: "Trend analysis", icon: LineChart },
                { label: "Segment comparison", icon: GitCompareArrows },
                { label: "Cohort evolution", icon: BarChart3 },
                { label: "Risk distribution", icon: PieChart },
              ].map(({ label, icon: Icon }) => (
                <button key={label} className="flex h-11 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 hover:bg-white">
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </section>
        </aside>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading eyebrow="Cohorts" title="Behavior groups detected from mapped signals" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cohorts.map((cohort) => (
            <article key={cohort.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className={`h-2 w-14 rounded-full ${cohort.tone}`} />
              <p className="mt-4 font-semibold text-slate-950">{cohort.name}</p>
              <p className="mt-1 text-sm text-slate-500">{cohort.entities} entities</p>
              <p className="mt-3 text-sm font-semibold text-slate-700">{cohort.change} over 30 days</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
