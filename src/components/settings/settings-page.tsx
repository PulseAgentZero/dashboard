import { Bell, Database, KeyRound, ShieldCheck, SlidersHorizontal, Users } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

const settingsSections = [
  {
    title: "Organization context",
    description: "Business description, entity definition, primary goals, and agent instructions.",
    icon: SlidersHorizontal,
    status: "Configured",
  },
  {
    title: "Database connection",
    description: "Read-only PostgreSQL connection with encrypted credentials and last test status.",
    icon: Database,
    status: "Active",
  },
  {
    title: "Schema mapping",
    description: "Primary entity table, ID column, display column, behavior signals, and timestamp field.",
    icon: KeyRound,
    status: "Mapped",
  },
  {
    title: "Roles and permissions",
    description: "Admin, operations manager, analyst, and read-only viewer access rules.",
    icon: Users,
    status: "4 roles",
  },
  {
    title: "Alerts and notifications",
    description: "Critical thresholds, daily digest, email notifications, and webhook delivery.",
    icon: Bell,
    status: "Enabled",
  },
  {
    title: "Security posture",
    description: "Tenant scoping, audit logs, credential encryption, and self-hosting controls.",
    icon: ShieldCheck,
    status: "Healthy",
  },
];

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <PageHero
        eyebrow="Workspace settings"
        title="Configure the organization, data connection, schema mapping, and access controls."
        description="Settings is where Pulse becomes industry-agnostic: the organization defines its context, maps its data, controls users, and configures alerts without changing product code."
        action="Save changes"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settingsSections.map(({ title, description, icon: Icon, status }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <Icon size={18} />
              </div>
              <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{status}</span>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            <button className="mt-5 h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Manage</button>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <SectionHeading eyebrow="Schema mapping" title="Current entity configuration" />
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Entity table", "entities.primary_profiles"],
              ["Unique ID", "entity_id"],
              ["Display name", "display_name"],
              ["Timestamp", "last_activity_at"],
              ["Behavior signals", "usage_delta, capacity, stock_cover, delay_rate"],
              ["Primary goal", "Reduce operational risk and recommend next best action"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <SectionHeading eyebrow="Backend mapping" title="Settings endpoints" />
          <div className="space-y-2 text-sm text-slate-700">
            <p>/api/organization/context</p>
            <p>/api/connections/test</p>
            <p>/api/schema/introspect</p>
            <p>/api/schema/mapping</p>
            <p>/api/users/roles</p>
            <p>/api/alerts/preferences</p>
          </div>
        </aside>
      </section>
    </div>
  );
}
