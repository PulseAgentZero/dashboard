"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Info, Landmark, Loader2 } from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { useAuth } from "@/providers/auth-provider";
import {
  useInitializeCloudCheckout,
  useSubscription,
  useVerifyCloudPayment,
} from "@/hooks/billing/use-billing";
import {
  FREE_PLAN_FEATURES,
  GROWTH_PLAN_FEATURES,
  GROWTH_PRICE_DISPLAY,
  PLAN_COMPARISON,
  PRO_PLAN_FEATURES,
  PRO_PRICE_DISPLAY,
} from "@/lib/plans";
import { isSelfHostedDeployment } from "@/lib/deployment";
import { resolveEffectivePlan } from "@/lib/plan-utils";
import { tokens } from "@/lib/auth-tokens";
import type { CloudPlanTier } from "@/lib/api/billing-api";

const VERIFIED_PAYMENT_REF_KEY = "pulse_verified_payment_ref";

export function PricingCloudPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { org, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: subscription } = useSubscription();
  const { mutate: startCheckout, isPending: checkoutPending } =
    useInitializeCloudCheckout();
  const { mutate: verifyPayment, isPending: verifying } = useVerifyCloudPayment();

  const selfHosted = isSelfHostedDeployment();
  const effectivePlan = resolveEffectivePlan(undefined, org?.plan, subscription);
  const isGrowth = effectivePlan === "growth";
  const isPro = effectivePlan === "pro" || effectivePlan === "enterprise";

  useEffect(() => {
    if (!reference) return;
    if (typeof window === "undefined") return;
    if (!tokens.getAccess()) return;

    window.history.replaceState(null, "", "/pricing");

    if (sessionStorage.getItem(VERIFIED_PAYMENT_REF_KEY) === reference) {
      return;
    }
    sessionStorage.setItem(VERIFIED_PAYMENT_REF_KEY, reference);
    verifyPayment(reference);
  }, [reference, verifyPayment]);

  function handleUpgrade(tier: CloudPlanTier) {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/pricing");
      return;
    }
    startCheckout({
      callbackUrl: `${window.location.origin}/pricing`,
      plan: tier,
    });
  }

  const checkoutDisabled = checkoutPending || authLoading || verifying || selfHosted;

  return (
    <div className="min-h-screen bg-white text-neutral-900 antialiased">
      <Navbar />

      <main data-navbar-theme="light" className="pt-32 pb-24">
        {selfHosted && (
          <div className="mx-auto mb-10 max-w-5xl px-6">
            <SelfHostedBanner />
          </div>
        )}

        {verifying && (
          <div className="mx-auto mb-10 flex max-w-md items-center justify-center gap-2.5 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-3.5 text-sm text-neutral-500">
            <Loader2 size={15} className="animate-spin text-(--mk-accent,#ea580c)" />
            Verifying payment connection…
          </div>
        )}

        {/* Header */}
        <div className="mx-auto max-w-3xl px-6 text-center space-y-5 mb-16 sm:mb-20">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white font-mono text-xs uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5" />
            Entivia Cloud
          </div> */}
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight text-neutral-900 leading-[1.1]">
            Predictable packaging.
            <br />
            Scaled for enterprise growth.
          </h1>
          {/* <p className="mx-auto max-w-xl text-base text-neutral-500 leading-relaxed">
            Start free, scale with Growth, or unlock unlimited possibilities on Pro.
            Billed monthly via Paystack.
          </p> */}
        </div>

        {/* Pricing cards */}
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Free */}
          <PricingTierCard
            name="Free"
            price="₦0"
            priceSub="Forever free"
            description="Get started with no credit card. Full access to core features within free limits."
            features={FREE_PLAN_FEATURES}
            isCurrent={effectivePlan === "free"}
            featured={false}
            cta={
              <Link
                href="/auth/signup"
                className="w-full text-center font-mono font-bold tracking-wider text-xs uppercase py-3.5 rounded-full border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200 block mt-auto"
              >
                Get started free
              </Link>
            }
          />

          {/* Growth — featured */}
          <PricingTierCard
            name="Growth"
            price={GROWTH_PRICE_DISPLAY.split("/")[0].trim()}
            priceSub="/ month"
            description="For growing teams that need more connections, users, and higher execution quotas."
            features={GROWTH_PLAN_FEATURES}
            isCurrent={isGrowth}
            featured
            badge="Most Popular"
            cta={
              isGrowth ? (
                <CurrentPlanBadge subscription={subscription} featured />
              ) : (
                <UpgradeButton
                  label={isAuthenticated ? "Start Growth Free" : "Sign in to upgrade"}
                  disabled={checkoutDisabled}
                  loading={checkoutPending}
                  featured
                  onClick={() => handleUpgrade("growth")}
                />
              )
            }
          />

          {/* Pro */}
          <PricingTierCard
            name="Pro"
            price={PRO_PRICE_DISPLAY.split("/")[0].trim()}
            priceSub="/ month"
            description="Designed for mid-to-large enterprises requiring unlimited analytics and priority support."
            features={PRO_PLAN_FEATURES.slice(0, 5)}
            isCurrent={isPro}
            featured={false}
            cta={
              isPro ? (
                <CurrentPlanBadge subscription={subscription} featured={false} />
              ) : (
                <UpgradeButton
                  label={isAuthenticated ? "Get Pro Access" : "Sign in to upgrade"}
                  disabled={checkoutDisabled}
                  loading={checkoutPending}
                  featured={false}
                  onClick={() => handleUpgrade("pro")}
                />
              )
            }
          />
        </div>

        {/* Comparison table */}
        <div className="mx-auto mt-20 max-w-5xl px-4 sm:px-6">
  <h2 className="text-center font-sans text-xl font-bold tracking-tight text-neutral-900 mb-6">
    Full plan comparison
  </h2>
  
  <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
    <table className="w-full text-left text-xs border-collapse">
      <thead>
        <tr className="border-b border-neutral-200 bg-neutral-50/70">
          <th className="p-3.5 font-medium text-neutral-500">
            Platform Features
          </th>
          <th className="p-3.5 font-medium text-neutral-500">
            Free
          </th>
          <th className="p-3.5 font-medium text-neutral-500">
            Growth
          </th>
          <th className="p-3.5 font-medium text-neutral-900 font-semibold">
            Pro
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-100">
        {PLAN_COMPARISON.map((row) => (
          <tr key={row.label} className="hover:bg-neutral-50/50 transition-colors">
            <td className="p-3.5 font-medium text-neutral-800">{row.label}</td>
            <td className="p-3.5 text-black font-mono">{row.free}</td>
            <td className="p-3.5 text-black font-mono">{row.growth}</td>
            <td className="p-3.5 text-neutral-900 font-mono font-semibold">{row.pro}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        {/* Security notice */}
        {/* <div className="max-w-xl mx-auto mt-12 text-center text-neutral-400 font-mono text-[11px] flex items-center justify-center gap-2 bg-white border border-neutral-200/60 py-3 px-4 rounded-2xl shadow-sm">
          <Info className="w-3.5 h-3.5 text-(--mk-accent,#ea580c) shrink-0" />
          <span>All cloud credential paths are encrypted locally using AES-256 protocols.</span>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-neutral-400">
          Prefer to self-host?{" "}
          <Link
            href="/pricing/self-hosted"
            className="font-medium underline underline-offset-4 hover:text-(--mk-accent,#ea580c) transition-colors"
          >
            View license models →
          </Link>
        </p> */}
      </main>

      <Footer />
    </div>
  );
}

function SelfHostedBanner() {
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3.5 text-sm text-orange-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <span>
        You are currently managing a self-hosted instance. Cloud tiers apply to Entivia Cloud
        hosting environments only.
      </span>
      <Link
        href="/pricing/self-hosted"
        className="font-semibold text-orange-600 underline shrink-0 hover:text-orange-500 transition-colors"
      >
        Purchase keys
      </Link>
    </div>
  );
}

function PricingTierCard({
  name,
  price,
  priceSub,
  description,
  features,
  isCurrent,
  featured,
  badge,
  cta,
}: {
  name: string;
  price: string;
  priceSub: string;
  description: string;
  features: string[];
  isCurrent: boolean;
  featured: boolean;
  badge?: string;
  cta: React.ReactNode;
}) {
  return (
    <div
      className={[
        "border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative bg-white",
        featured
          ? "border-neutral-900 shadow-xl md:-translate-y-2 ring-1 ring-neutral-950/5"
          : "border-neutral-200/80 shadow-sm hover:border-neutral-300",
      ].join(" ")}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-(--mk-accent,#ea580c) text-white text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full shadow-sm">
          {badge}
        </span>
      )}

      <div>
        <div className="font-mono text-xs text-neutral-400 uppercase tracking-wider mb-2 font-bold">
          {name}
        </div>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900">
            {price}
          </span>
          <span className="text-neutral-400 font-mono text-xs">{priceSub}</span>
        </div>
        <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed mb-6 border-b border-neutral-100 pb-6 min-h-19">
          {description}
        </p>

        <ul className="space-y-3.5 mb-8">
          {features.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600">
              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {isCurrent && (
        <p className="mb-2 text-center text-xs font-mono font-bold uppercase tracking-wider text-(--mk-accent,#ea580c)">
          Active Plan
        </p>
      )}
      {cta}
    </div>
  );
}

function CurrentPlanBadge({
  subscription,
  featured,
}: {
  subscription: { next_payment_date?: string | null; status?: string } | undefined;
  featured: boolean;
}) {
  return (
    <div
      className={[
        "w-full text-center font-mono font-bold tracking-wider text-xs uppercase py-3.5 rounded-full border transition-all duration-200 block mt-auto",
        featured
          ? "bg-neutral-100 border-neutral-200 text-neutral-500"
          : "bg-white border-neutral-200 text-neutral-400",
      ].join(" ")}
    >
      Current plan
      {subscription?.next_payment_date && (
        <span className="mt-0.5 block text-[10px] font-medium text-neutral-400 normal-case">
          Renews {new Date(subscription.next_payment_date).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

function UpgradeButton({
  label,
  disabled,
  loading,
  featured,
  onClick,
}: {
  label: string;
  disabled: boolean;
  loading: boolean;
  featured: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "w-full flex items-center justify-center gap-2 font-mono font-bold tracking-wider text-xs uppercase py-3.5 rounded-full border transition-all duration-200 mt-auto disabled:opacity-40",
        featured
          ? "bg-neutral-900 border-neutral-900 text-white hover:bg-neutral-800"
          : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300",
      ].join(" ")}
    >
      {loading && <Loader2 size={13} className="animate-spin" />}
      {label}
    </button>
  );
}
