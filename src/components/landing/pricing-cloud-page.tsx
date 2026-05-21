"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
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
    <div className="min-h-screen bg-zinc-950 text-white antialiased">
      <Navbar />

      <main className="pt-32 pb-24">
        {selfHosted && (
          <div className="mx-auto mb-10 max-w-5xl px-6">
            <SelfHostedBanner />
          </div>
        )}

        {verifying && (
          <div className="mx-auto mb-10 flex max-w-md items-center justify-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-3.5 text-sm text-zinc-400">
            <Loader2 size={15} className="animate-spin text-orange-500" />
            Verifying payment connection…
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Entivia Cloud
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-zinc-100">
            Simple pricing for growing teams
          </h1>
          <p className="mx-auto max-w-xl text-sm text-zinc-400 leading-relaxed">
            Start free, scale with Growth, or unlock unlimited possibilities on Pro. Billed monthly via Paystack.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 md:grid-cols-3 items-stretch">
          <PricingTierCard
            name="Free"
            price="₦0"
            priceSub="Forever free"
            features={FREE_PLAN_FEATURES}
            isCurrent={effectivePlan === "free"}
            cta={
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-xl border border-zinc-800 py-3 text-center text-sm font-semibold text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Get started free
              </Link>
            }
          />

          <PricingTierCard
            name="Growth"
            price={GROWTH_PRICE_DISPLAY.replace("/month", "")}
            priceSub="Per month"
            features={GROWTH_PLAN_FEATURES}
            isCurrent={isGrowth}
            badge={!isGrowth && !isPro ? "Scale up" : undefined}
            cta={
              isGrowth ? (
                <CurrentPlanBadge subscription={subscription} />
              ) : (
                <UpgradeButton
                  label={isAuthenticated ? "Upgrade to Growth" : "Sign in to upgrade"}
                  disabled={checkoutDisabled}
                  loading={checkoutPending}
                  onClick={() => handleUpgrade("growth")}
                />
              )
            }
          />

          <PricingTierCard
            name="Pro"
            price={PRO_PRICE_DISPLAY.replace("/month", "")}
            priceSub="Per month"
            features={PRO_PLAN_FEATURES}
            isCurrent={isPro}
            badge="Popular"
            accent
            cta={
              isPro ? (
                <CurrentPlanBadge subscription={subscription} />
              ) : (
                <UpgradeButton
                  label={isAuthenticated ? "Upgrade to Pro" : "Sign in to upgrade"}
                  disabled={checkoutDisabled}
                  loading={checkoutPending}
                  primary
                  onClick={() => handleUpgrade("pro")}
                />
              )
            }
          />
        </div>

        <div className="mx-auto mt-20 max-w-5xl px-6">
          <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-900/20">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-xs font-bold uppercase tracking-wider text-zinc-500">
                  <th className="p-4 font-semibold">Platform limits</th>
                  <th className="p-4 font-semibold">Free</th>
                  <th className="p-4 font-semibold">Growth</th>
                  <th className="p-4 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {PLAN_COMPARISON.map((row) => (
                  <tr key={row.label} className="text-zinc-300 hover:bg-zinc-900/10 transition-colors">
                    <td className="p-4 text-zinc-400 font-medium">{row.label}</td>
                    <td className="p-4 text-zinc-500">{row.free}</td>
                    <td className="p-4 text-zinc-300">{row.growth}</td>
                    <td className="p-4 text-white font-medium">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mx-auto mt-12 max-w-2xl text-center text-xs text-zinc-500">
          Self-hosting on your own infrastructure?{" "}
          <Link href="/pricing/self-hosted" className="text-zinc-400 font-medium underline underline-offset-4 hover:text-orange-500 transition-colors">
            View license models
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}

function SelfHostedBanner() {
  return (
    <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-5 py-3.5 text-sm text-orange-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <span>You are currently managing a self-hosted instance. Cloud tiers apply to Entivia Cloud hosting environments only.</span>
      <Link href="/pricing/self-hosted" className="font-semibold text-orange-400 underline shrink-0 hover:text-orange-300 transition-colors">
        Purchase keys
      </Link>
    </div>
  );
}

function PricingTierCard({
  name,
  price,
  priceSub,
  features,
  isCurrent,
  cta,
  badge,
  accent,
}: {
  name: string;
  price: string;
  priceSub: string;
  features: string[];
  isCurrent: boolean;
  cta: React.ReactNode;
  badge?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border p-6 bg-zinc-900/40 transition-all ${
        accent
          ? "border-orange-500/40 shadow-xs"
          : "border-zinc-900"
      }`}
    >
      <div className="flex items-center justify-between min-h-[24px]">
        <p className={`text-xs font-bold uppercase tracking-wider ${accent ? "text-orange-500" : "text-zinc-500"}`}>
          {name}
        </p>
        {badge && (
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide border ${
            accent ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-zinc-800 text-zinc-400 border-zinc-700/50"
          }`}>
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold text-zinc-100">{price}</span>
        <span className="text-xs text-zinc-500">{priceSub}</span>
      </div>

      <ul className="mt-8 flex-1 space-y-3.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
            <Check
              size={15}
              className={`mt-0.5 shrink-0 ${accent ? "text-orange-500" : "text-zinc-500"}`}
            />
            <span className="leading-normal">{f}</span>
          </li>
        ))}
      </ul>

      {isCurrent && (
        <p className="mt-4 text-center text-xs font-bold uppercase tracking-wider text-orange-500">
          Active Environment
        </p>
      )}
      {cta}
    </div>
  );
}

function CurrentPlanBadge({
  subscription,
}: {
  subscription: { next_payment_date?: string | null; status?: string } | undefined;
}) {
  return (
    <div className="mt-8 rounded-xl bg-zinc-900 border border-zinc-800 py-3 text-center text-sm font-semibold text-zinc-400">
      Current tier
      {subscription?.next_payment_date && (
        <span className="mt-0.5 block text-xs font-medium text-zinc-500">
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
  primary,
  onClick,
}: {
  label: string;
  disabled: boolean;
  loading: boolean;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all disabled:opacity-40 ${
        primary
          ? "bg-orange-600 text-white hover:bg-orange-700 shadow-sm"
          : "border border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700"
      }`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {label}
    </button>
  );
}