"use client";

import Link from "next/link";
import { Check, Info, Landmark } from "lucide-react";

const TIERS = [
  {
    name: "Self-Hosted",
    price: "₦0",
    frequency: "Free Forever",
    description: "Full features, open-source engine deployed inside your local infrastructure under the MIT License.",
    features: [
      "Data never leaves your infra",
      "Unlimited local DB connections",
      "Full access to Scoring Engine",
      "Recommendation Queue & Agent",
      "MIT Licensed open-source",
    ],
    cta: "Download Source",
    href: "https://github.com",
    featured: false,
  },
  {
    name: "Growth",
    price: "₦15,000",
    frequency: "/ month",
    description: "Perfect for growing teams requiring fully managed, low-latency execution instances without server overhead.",
    features: [
      "Up to 10 team users",
      "5 concurrent live DB connections",
      "100 automated agent queries / mo",
      "Encrypted credential vault",
      "Standard webhook & Slack alerts",
    ],
    cta: "Start Growth Free",
    href: "/auth/signup",
    featured: true,
  },
  {
    name: "Pro",
    price: "₦40,000",
    frequency: "/ month",
    description: "Designed for mid-to-large enterprises requiring absolute high-volume analytics capabilities and priority support.",
    features: [
      "Unlimited team users",
      "Unlimited data connections",
      "Unlimited agent engine queries",
      "Full administrative audit logs",
      "24/7 dedicated engineering support",
    ],
    cta: "Get Pro Access",
    href: "/auth/signup",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      data-navbar-theme="light"
      className="bg-neutral-100 text-neutral-900 py-16 sm:py-24 lg:py-32 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-20 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-neutral-900 leading-[1.15] sm:leading-[1.1]">
            Predictable packaging. Scaled for enterprise growth.
          </h2>
          <p className="mt-4 sm:mt-6 text-neutral-500 text-sm sm:text-base lg:text-lg max-w-xl mx-auto leading-relaxed">
            Choose between localized cloud hosting instances or run the autonomous system entirely in-house for free.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 items-stretch max-w-sm md:max-w-none mx-auto">
          {TIERS.map((tier, idx) => (
            <div
              key={idx}
              className={[
                "border rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 relative bg-white",
                tier.featured
                  ? "border-neutral-900 shadow-xl md:-translate-y-2 ring-1 ring-neutral-950/5 z-10 my-4 md:my-0"
                  : "border-neutral-200/80 shadow-sm hover:border-neutral-300",
              ].join(" ")}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--mk-accent,#ea580c)] text-white text-[9px] sm:text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                  Most Popular
                </span>
              )}

              <div>
                <div className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wider mb-1.5 sm:mb-2 font-bold">
                  {tier.name}
                </div>
                
                <div className="flex items-baseline gap-1 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-neutral-900">
                    {tier.price}
                  </span>
                  <span className="text-neutral-400 font-mono text-[10px] sm:text-xs">
                    {tier.frequency}
                  </span>
                </div>
                
                <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 border-b border-neutral-100 pb-5 sm:pb-6 md:min-h-[84px] lg:min-h-[76px]">
                  {tier.description}
                </p>

                {/* Features Checklist */}
                <ul className="space-y-3 sm:space-y-3.5 mb-6 sm:mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call To Action Buttons */}
              <Link
                href={tier.href}
                className={[
                  "w-full text-center font-mono font-bold tracking-wider text-[10px] sm:text-xs uppercase py-3 sm:py-3.5 rounded-full border transition-all duration-200 block mt-auto",
                  tier.featured
                    ? "bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800"
                    : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300",
                ].join(" ")}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}