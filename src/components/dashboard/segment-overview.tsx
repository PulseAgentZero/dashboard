import { segments } from "@/lib/demo-data";
import { SectionHeading } from "@/components/shared/section-heading";

export function SegmentOverview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading eyebrow="Segments" title="Mapped industries" />

      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.name}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-slate-950">
                {segment.name}
              </span>
              <span className="text-slate-500">{segment.entities}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${segment.color}`}
                style={{ width: `${segment.risk}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
