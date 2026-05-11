import Image from "next/image";
import Link from "next/link";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { RiskPill } from "@/components/shared/risk-pill";
import { SectionHeading } from "@/components/shared/section-heading";
import { SummaryCard } from "@/components/shared/summary-card";
import { entities, entitySummary, segments } from "@/lib/demo-data";

export function EntitiesPage() {
  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <PageHero
        eyebrow="Entity explorer"
        title="Search, rank, and investigate every modeled entity."
        description="This page is the operational workbench for subscribers, patients, SKUs, routes, stores, or any primary entity an organization maps during onboarding."
        action="Export CSV"
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {entitySummary.map((item) => (
          <SummaryCard key={item.label} item={item} />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
            <Search size={16} className="shrink-0 text-slate-400" />
            <input
              className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Search by ID, name, signal, or segment"
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
              <Filter size={15} />
              Risk
            </button>
            <button className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
              <SlidersHorizontal size={15} />
              Columns
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                {["Entity", "Industry", "Risk", "Top signal", "Recommendation", "Completeness", "Owner"].map((heading) => (
                  <th key={heading} className="border-b border-slate-100 pb-3 font-semibold">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entities.map((entity) => (
                <tr key={entity.id} className="text-sm">
                  <td className="border-b border-slate-100 py-4">
                    <Link href={`/dashboard/entities/${entity.id}`} className="flex items-center gap-3">
                      <Image src={entity.image} alt="" width={44} height={44} className="h-11 w-11 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold text-slate-950">{entity.name}</p>
                        <p className="text-xs text-slate-500">{entity.id}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="border-b border-slate-100 py-4 text-slate-600">{entity.industry}</td>
                  <td className="border-b border-slate-100 py-4"><RiskPill risk={entity.risk} /></td>
                  <td className="border-b border-slate-100 py-4 text-slate-600">{entity.signal}</td>
                  <td className="border-b border-slate-100 py-4 font-medium text-slate-900">{entity.action}</td>
                  <td className="border-b border-slate-100 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${entity.completeness}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{entity.completeness}%</span>
                    </div>
                  </td>
                  <td className="border-b border-slate-100 py-4 text-slate-600">{entity.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading eyebrow="Segments" title="Explorer filters" />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {segments.map((segment) => (
            <button key={segment.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left hover:bg-white">
              <p className="font-semibold text-slate-950">{segment.name}</p>
              <p className="mt-1 text-sm text-slate-500">{segment.entities} entities · {segment.change}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
