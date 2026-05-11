import { CheckCircle2, Database, LockKeyhole, Table2 } from "lucide-react";
import { onboardingSteps } from "@/lib/demo-data";
import { SectionHeading } from "@/components/shared/section-heading";

export function ConnectionStatusCard() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <SectionHeading eyebrow="Setup" title="Connection status" />

      <div className="grid gap-3">
        {[
          {
            label: "Database",
            value: "PostgreSQL · production replica",
            icon: Database,
          },
          {
            label: "Credential storage",
            value: "Encrypted at rest",
            icon: LockKeyhole,
          },
          {
            label: "Mapped table",
            value: "entities.primary_profiles",
            icon: Table2,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Icon size={17} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-950">
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
        {onboardingSteps.map((step) => (
          <div key={step.title} className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-slate-950">
                {step.title}
              </p>
              <p className="mt-0.5 text-sm leading-5 text-slate-500">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
