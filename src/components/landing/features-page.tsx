import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import BentoSection from "@/components/landing/bento-section";
import FinalCTA from "@/components/landing/final-CTA";
import {
  HOW_IT_WORKS_STEPS,
  INTEGRATION_HIGHLIGHTS,
  MARKETING_CAPABILITIES,
} from "@/lib/marketing/features";
import { isCloudDeployment, isSelfHostedDeployment } from "@/lib/deployment";

function CapabilityCard({
  title,
  description,
  highlights,
  icon: Icon,
}: {
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-white/[0.06] bg-[#131625] p-6 transition-colors hover:border-white/[0.1]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{description}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {highlights.map((h) => (
          <li key={h} className="flex gap-2 text-xs text-zinc-500">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-indigo-500" />
            {h}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function FeaturesPage() {
  const cloud = isCloudDeployment();
  const selfHosted = isSelfHostedDeployment();
  const showBothHosting = cloud && !selfHosted;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-zinc-900 px-6 py-20 md:px-16 md:py-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">
              Why Entivia
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
              Intelligence from the data you already have
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Entivia connects to your live systems, scores risk on every entity, and
              tells your team what to do next—without a warehouse project, a BI team,
              or months of setup.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="rounded-full bg-white px-8 py-3 text-sm font-bold text-black transition-colors hover:bg-zinc-200"
              >
                Start free
              </Link>
              <Link
                href="/docs/getting-started"
                className="rounded-full border border-zinc-700 px-8 py-3 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
              >
                See how setup works
              </Link>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-zinc-900 px-6 py-16 md:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              From connection to action in days, not quarters
            </h2>
            <p className="mt-2 max-w-xl text-sm text-zinc-500">
              No data engineering hire required to get your first recommendations.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_IT_WORKS_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-950/50 p-6"
                >
                  <span className="font-mono text-xs text-zinc-600">{s.step}</span>
                  <h3 className="mt-3 font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities — single benefit grid */}
        <section className="border-b border-zinc-900 px-6 py-16 md:px-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              What Entivia does for your team
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Outcomes operators care about—not another tool to learn screen by screen.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MARKETING_CAPABILITIES.map((c) => (
                <CapabilityCard key={c.id} {...c} />
              ))}
            </div>
          </div>
        </section>

        <BentoSection />

        {/* API strip */}
        <section className="border-b border-zinc-900 px-6 py-12 md:px-16">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 rounded-2xl border border-white/[0.06] bg-[#131625] p-8 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-bold text-white">Integrate with your stack</h3>
              <p className="mt-2 max-w-xl text-sm text-zinc-400">
                {INTEGRATION_HIGHLIGHTS[0].description} Push alerts to Slack, CRM, or
                internal tools via webhooks.
              </p>
            </div>
            <Link
              href={INTEGRATION_HIGHLIGHTS[0].href}
              className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
            >
              API documentation
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Hosting */}
        <section className="border-b border-zinc-900 px-6 py-16 md:px-16">
          <div
            className={`mx-auto grid max-w-6xl gap-6 ${showBothHosting ? "md:grid-cols-2" : "md:max-w-lg"}`}
          >
            {cloud && (
              <div className="rounded-2xl border border-white/[0.06] bg-[#131625] p-8">
                <h3 className="text-xl font-bold text-white">Entivia Cloud</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Sign up, connect your database, and go. We run the infrastructure;
                  you keep control of credentials and access.
                </p>
                <Link
                  href="/pricing"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  View pricing
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
            {(selfHosted || showBothHosting) && (
              <div className="rounded-2xl border border-white/[0.06] bg-[#131625] p-8">
                <h3 className="text-xl font-bold text-white">Self-hosted</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  Deploy in your VPC or on-prem. Full data sovereignty, your LLM keys,
                  and optional license for unlimited usage.
                </p>
                <Link
                  href={selfHosted ? "/pricing/self-hosted" : "/docs/hosting/self-hosted"}
                  className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  {selfHosted ? "View licensing" : "Deployment guide"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
