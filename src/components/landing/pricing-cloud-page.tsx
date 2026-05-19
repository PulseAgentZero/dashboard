"use client";

import { useEffect, useRef } from "react";
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

export function PricingCloudPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { org, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: subscription } = useSubscription();
  const { mutate: startCheckout, isPending: checkoutPending } =
    useInitializeCloudCheckout();
  const { mutate: verifyPayment, isPending: verifying } = useVerifyCloudPayment();
  const verifiedRef = useRef<string | null>(null);

  const selfHosted = isSelfHostedDeployment();
  const effectivePlan = resolveEffectivePlan(undefined, org?.plan, subscription);
  const isGrowth = effectivePlan === "growth";
  const isPro = effectivePlan === "pro" || effectivePlan === "enterprise";

  useEffect(() => {
    if (!reference || verifiedRef.current === reference) return;
    if (!tokens.getAccess()) return;
    verifiedRef.current = reference;
    verifyPayment(reference, {
      onSuccess: () => {
        router.replace("/pricing");
      },
    });
  }, [reference, verifyPayment, router]);

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
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28 pb-20">
        {selfHosted && (
          <div className="mx-auto mb-8 max-w-5xl px-6">
            <SelfHostedBanner />
          </div>
        )}

        {reference && verifying && (
          <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-4 text-sm text-zinc-300">
            <Loader2 size={16} className="animate-spin" />
            Verifying payment…
          </div>
        )}

        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Entivia Cloud
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Simple pricing for growing teams
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Start free, scale with Growth, or go unlimited on Pro. Billed monthly via
            Paystack.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-6 px-6 lg:grid-cols-3">
          <PricingTierCard
            name="Free"
            price="₦0"
            priceSub="Forever"
            features={FREE_PLAN_FEATURES}
            isCurrent={effectivePlan === "free"}
            cta={
              <Link
                href="/auth/signup"
                className="mt-8 block rounded-full border border-zinc-700 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-900"
              >
                Get started free
              </Link>
            }
          />

          <PricingTierCard
            name="Growth"
            price={GROWTH_PRICE_DISPLAY.replace("/month", "")}
            priceSub="per month"
            features={GROWTH_PLAN_FEATURES}
            isCurrent={isGrowth}
            highlight={!isGrowth && !isPro}
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
            priceSub="per month"
            features={PRO_PLAN_FEATURES}
            isCurrent={isPro}
            highlight={!isPro}
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

        <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 px-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="py-4 pr-4 font-medium">Limit</th>
                <th className="py-4 pr-4 font-medium">Free</th>
                <th className="py-4 pr-4 font-medium">Growth</th>
                <th className="py-4 font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-zinc-900 text-zinc-300">
                  <td className="py-3 pr-4">{row.label}</td>
                  <td className="py-3 pr-4 text-zinc-400">{row.free}</td>
                  <td className="py-3 pr-4 text-zinc-300">{row.growth}</td>
                  <td className="py-3 text-white">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-zinc-500">
          Self-hosting on your own infrastructure?{" "}
          <Link href="/pricing/self-hosted" className="text-zinc-300 underline hover:text-white">
            View license pricing
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
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
      You are running a self-hosted deployment. Cloud subscriptions apply to Entivia Cloud
      only.{" "}
      <Link href="/pricing/self-hosted" className="font-semibold underline hover:text-white">
        Purchase a self-hosted license
      </Link>
      .
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
  highlight,
  badge,
  accent,
}: {
  name: string;
  price: string;
  priceSub: string;
  features: string[];
  isCurrent: boolean;
  cta: React.ReactNode;
  highlight?: boolean;
  badge?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        accent
          ? "border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 to-zinc-950 shadow-lg shadow-indigo-500/10"
          : highlight
            ? "border-zinc-600 bg-zinc-950/80"
            : "border-zinc-800 bg-zinc-950/80"
      }`}
    >
      {badge && (
        <span
          className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white ${
            accent ? "bg-indigo-500" : "bg-zinc-600"
          }`}
        >
          {badge}
        </span>
      )}
      <p
        className={`text-sm font-semibold uppercase tracking-wide ${
          accent ? "text-indigo-300" : "text-zinc-500"
        }`}
      >
        {name}
      </p>
      <p className="mt-4 text-4xl font-bold">{price}</p>
      <p className="mt-1 text-sm text-zinc-500">{priceSub}</p>
      <ul className="mt-8 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
            <Check
              size={16}
              className={`mt-0.5 shrink-0 ${accent ? "text-indigo-400" : "text-emerald-400"}`}
            />
            {f}
          </li>
        ))}
      </ul>
      {isCurrent && !accent && (
        <p className="mt-4 text-center text-xs font-semibold text-emerald-400">
          Current plan
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
    <div className="mt-8 rounded-full bg-emerald-500/20 py-3 text-center text-sm font-semibold text-emerald-300">
      Current plan
      {subscription?.next_payment_date && (
        <span className="mt-1 block text-xs font-normal text-emerald-400/80">
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
      className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold disabled:opacity-50 ${
        primary
          ? "bg-white text-black hover:bg-zinc-200"
          : "border border-zinc-600 text-white hover:bg-zinc-900"
      }`}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {label}
    </button>
  );
}
