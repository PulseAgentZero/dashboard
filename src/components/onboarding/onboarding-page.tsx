import { PageHero } from "@/components/shared/page-hero";
import { SectionHeading } from "@/components/shared/section-heading";
import { onboardingSteps } from "@/lib/demo-data";

export function OnboardingPage() {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <PageHero eyebrow="Onboarding wizard" title="Configure Pulse for any industry in a guided flow." description="This mirrors the PRD setup path: organization context, data connection, schema introspection, mapping review, and first dashboard load." action="Resume setup" />
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <SectionHeading eyebrow="Setup steps" title="Cloud version demo path" />
        <div className="grid gap-4 md:grid-cols-2">
          {onboardingSteps.map((step, index) => (
            <article key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">{index + 1}</span>
              <h2 className="mt-4 font-semibold text-slate-950">{step.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
