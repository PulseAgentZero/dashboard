import { recommendations } from "@/lib/demo-data";
import { RiskPill } from "@/components/shared/risk-pill";
import { SectionHeading } from "@/components/shared/section-heading";

export function RecommendationsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading
        eyebrow="Recommendations"
        title="Action queue"
        action="Assign"
      />

      <div className="space-y-3">
        {recommendations.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {item.entity} · {item.owner}
                </p>
              </div>
              <RiskPill risk={item.urgency} />
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.reason}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-blue-700">
                {item.confidence} confidence
              </p>
              <div className="flex gap-2">
                <button className="h-8 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                  Dismiss
                </button>
                <button className="h-8 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white">
                  Action
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
