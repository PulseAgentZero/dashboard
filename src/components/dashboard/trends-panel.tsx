import { SectionHeading } from "@/components/shared/section-heading";
import { trend } from "@/lib/demo-data";

export function TrendsPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading eyebrow="Analytics" title="Risk movement" action="Export" />

      <div className="flex h-60 items-end gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 pb-4 pt-6">
        {trend.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className="flex h-full flex-1 flex-col justify-end gap-2"
          >
            <div
              className="rounded-t-lg bg-blue-600"
              style={{ height: `${value}%` }}
            />
            <span className="text-center text-[10px] font-semibold text-slate-400">
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-slate-500">Peak risk</p>
          <p className="mt-1 font-semibold text-slate-950">81%</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-slate-500">30-day change</p>
          <p className="mt-1 font-semibold text-emerald-700">-6.8%</p>
        </div>
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="text-slate-500">Anomalies</p>
          <p className="mt-1 font-semibold text-rose-700">7 open</p>
        </div>
      </div>
    </section>
  );
}
