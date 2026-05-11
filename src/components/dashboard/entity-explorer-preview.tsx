import Image from "next/image";
import { entities } from "@/lib/demo-data";
import { RiskPill } from "@/components/shared/risk-pill";
import { SectionHeading } from "@/components/shared/section-heading";

export function EntityExplorerPreview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading
        eyebrow="Entity explorer"
        title="Profiles requiring attention"
        action="Open explorer"
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-separate border-spacing-0 text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400">
              <th className="border-b border-slate-100 pb-3 font-semibold">
                Entity
              </th>
              <th className="border-b border-slate-100 pb-3 font-semibold">
                Segment
              </th>
              <th className="border-b border-slate-100 pb-3 font-semibold">
                Risk
              </th>
              <th className="border-b border-slate-100 pb-3 font-semibold">
                Signal
              </th>
              <th className="border-b border-slate-100 pb-3 font-semibold">
                Next action
              </th>
              <th className="border-b border-slate-100 pb-3 font-semibold">
                Seen
              </th>
            </tr>
          </thead>
          <tbody>
            {entities.map((entity) => (
              <tr key={entity.id} className="text-sm">
                <td className="border-b border-slate-100 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={entity.image}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-950">
                        {entity.name}
                      </p>
                      <p className="text-xs text-slate-500">{entity.id}</p>
                    </div>
                  </div>
                </td>
                <td className="border-b border-slate-100 py-4 text-slate-600">
                  {entity.segment}
                </td>
                <td className="border-b border-slate-100 py-4">
                  <div className="flex items-center gap-3">
                    <RiskPill risk={entity.risk} />
                    <span className="text-xs font-semibold text-slate-500">
                      {entity.score}
                    </span>
                  </div>
                </td>
                <td className="border-b border-slate-100 py-4 text-slate-600">
                  {entity.signal}
                </td>
                <td className="border-b border-slate-100 py-4 font-medium text-slate-900">
                  {entity.action}
                </td>
                <td className="border-b border-slate-100 py-4 text-slate-500">
                  {entity.lastSeen}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
