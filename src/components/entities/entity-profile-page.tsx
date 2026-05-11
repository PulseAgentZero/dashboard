import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquareText, ShieldCheck } from "lucide-react";
import { RiskPill } from "@/components/shared/risk-pill";
import { SectionHeading } from "@/components/shared/section-heading";
import { entities, recommendations, trend } from "@/lib/demo-data";

export async function EntityProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entity = entities.find((item) => item.id === decodeURIComponent(id));

  if (!entity) notFound();

  const relatedRecommendations = recommendations.filter(
    (item) => item.entity === entity.id,
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      <Link
        href="/dashboard/entities"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
      >
        <ArrowLeft size={16} />
        Back to entities
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <Image
              src={entity.image}
              alt=""
              width={72}
              height={72}
              className="h-[72px] w-[72px] rounded-2xl object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <RiskPill risk={entity.risk} />
                <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                  Score {entity.score}
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                {entity.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {entity.id} · {entity.industry} · {entity.segment}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">
              <MessageSquareText size={15} />
              Ask agent
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white">
              Mark actioned
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Current risk", value: entity.risk, detail: entity.signal },
          {
            label: "Profile completeness",
            value: `${entity.completeness}%`,
            detail: "Mapped signal coverage",
          },
          { label: "Owner", value: entity.owner, detail: "Responsible team" },
          {
            label: "Last seen",
            value: entity.lastSeen,
            detail: "Most recent activity signal",
          },
        ].map((item) => (
          <section
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              {item.value}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              {item.detail}
            </p>
          </section>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeading eyebrow="Behavior" title="Signal trend" action="Export" />
          <div className="flex h-64 items-end gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 pb-4 pt-6">
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
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="Recommendation" title="Next best action" />
            <p className="text-lg font-semibold text-slate-950">
              {entity.action}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Pulse selected this action from the entity profile, recent signal
              movement, and configured organizational goals.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="Governance" title="Privacy posture" />
            <div className="flex gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <ShieldCheck size={18} />
              </div>
              <p className="text-sm leading-6 text-slate-600">
                Entity data is read from the connected database on demand. Pulse
                stores recommendation metadata and schema mapping, not raw
                client records.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeading eyebrow="Queue" title="Related recommendations" />
            {relatedRecommendations.length ? (
              <div className="space-y-3">
                {relatedRecommendations.map((item) => (
                  <div key={item.title} className="rounded-xl bg-slate-50 p-4">
                    <RiskPill risk={item.urgency} />
                    <p className="mt-2 font-semibold text-slate-950">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.confidence} confidence
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-500">
                No dedicated recommendation is open for this entity yet.
              </p>
            )}
          </section>
        </aside>
      </section>
    </div>
  );
}
