import { Database, FileSpreadsheet, Server, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";

const connectors = [
  { name: "PostgreSQL", status: "Active", icon: Database },
  { name: "MySQL", status: "Available", icon: Server },
  { name: "SQLite", status: "Available", icon: Database },
  { name: "CSV / Excel", status: "Upload-ready", icon: FileSpreadsheet },
];

export function ConnectionsPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHero eyebrow="Data connections" title="Connect read-only data sources without moving client records." description="Pulse stores schema metadata and encrypted credentials. Operational data stays in the organization&apos;s database and is queried on demand." action="Add connection" />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {connectors.map(({ name, status, icon: Icon }) => (
          <article key={name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon size={18} /></div>
            <h2 className="mt-5 font-semibold text-slate-950">{name}</h2>
            <p className="mt-2 text-sm text-slate-500">{status}</p>
          </article>
        ))}
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading eyebrow="Security" title="Connection security model" />
        <div className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-slate-700">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
          Credentials are encrypted at rest, query users should be SELECT-only, and self-hosted deployments keep database traffic inside the organization&apos;s network.
        </div>
      </section>
    </div>
  );
}
