import { Activity, Database, ShieldCheck } from "lucide-react";

export function DashboardHeader() {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-sm">
      <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-8">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex h-7 items-center rounded-full bg-emerald-400 px-3 text-xs font-semibold text-slate-950">
              Cloud demo workspace
            </span>
            <span className="inline-flex h-7 items-center rounded-full bg-white/10 px-3 text-xs font-semibold text-slate-200">
              Nova Africa Operations
            </span>
          </div>

          <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Real-time behavioral intelligence, recommendations, and grounded
            agent answers.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Pulse connects to operational data, maps the organization&apos;s
            entity model, identifies risk patterns, and helps teams act through
            a live dashboard and conversational agent.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {[
            {
              label: "Connection",
              value: "Read-only PostgreSQL",
              icon: Database,
            },
            {
              label: "Query mode",
              value: "Live schema-aware SQL",
              icon: Activity,
            },
            {
              label: "Data policy",
              value: "Client data never stored",
              icon: ShieldCheck,
            },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-white/[0.07] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-emerald-300">
                  <Icon size={17} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
