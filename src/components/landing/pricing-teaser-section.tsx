import Link from "next/link";
import { Check } from "lucide-react";
import {
  FREE_PLAN_FEATURES,
  GROWTH_PLAN_FEATURES,
  PRO_PLAN_FEATURES,
  GROWTH_PRICE_DISPLAY,
  PRO_PRICE_DISPLAY,
} from "@/lib/plans";

const TIERS = [
  {
    name: "Free",
    price: "₦0",
    sub: "forever",
    description: "Get started with no credit card.",
    features: FREE_PLAN_FEATURES,
    cta: { label: "Get started free", href: "/auth/signup", primary: false },
    highlighted: false,
  },
  {
    name: "Growth",
    price: GROWTH_PRICE_DISPLAY,
    sub: "per month",
    description: "For teams that need more connections and headroom.",
    features: GROWTH_PLAN_FEATURES,
    cta: { label: "Start Growth", href: "/auth/signup?plan=growth", primary: true },
    highlighted: true,
  },
  {
    name: "Pro",
    price: PRO_PRICE_DISPLAY,
    sub: "per month",
    description: "Unlimited everything. Full audit logs. Priority support.",
    features: PRO_PLAN_FEATURES.slice(0, 5),
    cta: { label: "Start Pro", href: "/auth/signup?plan=pro", primary: false },
    highlighted: false,
  },
] as const;

export default function PricingTeaserSection() {
  return (
    <section
      data-navbar-theme="dark"
      className="bg-[var(--mk-bg)] px-4 py-24 md:px-10 lg:px-28"
    >
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--mk-accent)]">
          Pricing
        </span>
        <h2 className="mt-3 text-4xl font-black leading-tight tracking-tight text-[var(--mk-text)] md:text-5xl">
          Simple plans.
          <br />
          No surprises.
        </h2>
        <p className="mt-4 text-base text-[var(--mk-text-muted)] leading-relaxed">
          Start free, upgrade when you need more. Self-host forever on MIT — no license required.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={[
              "relative flex flex-col rounded-2xl border p-6",
              tier.highlighted
                ? "border-[var(--mk-accent)] bg-[var(--mk-surface)] ring-1 ring-[var(--mk-accent)]/30"
                : "border-[var(--mk-border)] bg-[var(--mk-surface-2)]",
            ].join(" ")}
          >
            {tier.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--mk-accent)] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Most popular
              </div>
            )}

            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
                {tier.name}
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-black text-[var(--mk-text)]">
                  {tier.price.split("/")[0]}
                </span>
                <span className="text-sm text-[var(--mk-text-faint)]">/{tier.sub}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--mk-text-muted)]">
                {tier.description}
              </p>
            </div>

            <ul className="flex-1 space-y-2.5 mb-8">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-[var(--mk-text-muted)]">
                  <Check size={11} className="mt-0.5 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={tier.cta.href}
              className={[
                "block w-full rounded-full py-3 text-center text-sm font-bold tracking-wide transition-all",
                tier.cta.primary
                  ? "bg-[var(--mk-accent)] text-white hover:bg-[var(--mk-accent-hover)]"
                  : "border border-[var(--mk-border)] text-[var(--mk-text-muted)] hover:border-[var(--mk-text-faint)] hover:text-[var(--mk-text)]",
              ].join(" ")}
            >
              {tier.cta.label}
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-[var(--mk-text-faint)]">
        Prefer to self-host?{" "}
        <Link
          href="/pricing/self-hosted"
          className="text-[var(--mk-text-muted)] underline underline-offset-2 hover:text-[var(--mk-text)]"
        >
          See self-hosted licensing →
        </Link>
      </p>
    </section>
  );
}
