import { BellRing, Mail, Siren, Webhook } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

const alerts = [
  { title: "High-risk entity detected", channel: "In-app", count: "47", icon: Siren },
  { title: "Critical threshold breach", channel: "Email", count: "12", icon: Mail },
  { title: "Daily intelligence digest", channel: "Email", count: "1/day", icon: BellRing },
  { title: "Webhook delivery", channel: "Slack / Teams", count: "3", icon: Webhook },
];

export function AlertsPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHero eyebrow="Alerts and notifications" title="Surface urgent operational changes before teams miss them." description="The PRD requires in-app alerts, configurable email notifications, daily intelligence digests, and webhooks for self-hosted deployments." action="Create alert" />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {alerts.map(({ title, channel, count, icon: Icon }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-rose-50 text-rose-700"><Icon size={18} /></div>
            <h2 className="mt-5 font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{channel}</p>
            <p className="mt-4 text-2xl font-semibold text-slate-950">{count}</p>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading eyebrow="Rules" title="Configured thresholds" />
        <div className="space-y-3">
          {["Risk score exceeds 80", "Stock cover falls below 4 days", "Capacity exceeds 90%", "Delay rate increases by 15%"].map((rule) => (
            <div key={rule} className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">{rule}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
