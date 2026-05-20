"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Crown,
  Loader2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useUsage } from "@/hooks/usage/use-usage";
import {
  useInitializeCloudCheckout,
  useInitializeSelfHostedCheckout,
  useSubscription,
  useOpenManagePaymentLink,
  useVerifyCloudPayment,
} from "@/hooks/billing/use-billing";
import {
  FREE_PLAN_FEATURES,
  GROWTH_PLAN_FEATURES,
  GROWTH_PRICE_DISPLAY,
  PLAN_COMPARISON,
  PRO_PLAN_FEATURES,
  PRO_PRICE_DISPLAY,
  SELF_HOSTED_LICENSE_FEATURES,
} from "@/lib/plans";
import { isCloudDeployment, isSelfHostedDeployment } from "@/lib/deployment";
import {
  isPaidPlan,
  isProPlan,
  planDisplayName,
  resolveEffectivePlan,
} from "@/lib/plan-utils";
import type { CloudPlanTier } from "@/lib/api/billing-api";
import { tokens } from "@/lib/auth-tokens";

export function PlanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { user, org } = useAuth();
  const { data: usage } = useUsage();
  const { data: subscription } = useSubscription();
  const { mutate: startCloudCheckout, isPending: cloudCheckout } =
    useInitializeCloudCheckout();
  const { mutate: startLicenseCheckout, isPending: licenseCheckout } =
    useInitializeSelfHostedCheckout();
  const { mutate: verifyPayment, isPending: verifying } = useVerifyCloudPayment();
  const { mutate: openManageLink, isPending: openingManageLink } =
    useOpenManagePaymentLink();
  const verifiedRef = useRef<string | null>(null);
  const [licenseEmail, setLicenseEmail] = useState("");

  const cloud = isCloudDeployment();
  const selfHosted = isSelfHostedDeployment();
  const effectivePlan = resolveEffectivePlan(
    usage?.plan,
    org?.plan,
    subscription ?? undefined,
  );
  const isGrowth = effectivePlan === "growth";
  const isPro = isProPlan(effectivePlan);

  useEffect(() => {
    if (user?.email) setLicenseEmail(user.email);
  }, [user?.email]);

  useEffect(() => {
    if (!reference || verifiedRef.current === reference) return;
    if (!tokens.getAccess() || !cloud) return;
    verifiedRef.current = reference;
    verifyPayment(reference, {
      onSuccess: () => router.replace("/dashboard/plan"),
    });
  }, [reference, verifyPayment, router, cloud]);

  function handleUpgrade(tier: CloudPlanTier) {
    startCloudCheckout({
      callbackUrl: `${window.location.origin}/dashboard/plan`,
      plan: tier,
    });
  }

  function handleLicensePurchase(e: React.FormEvent) {
    e.preventDefault();
    if (!licenseEmail.trim()) return;
    startLicenseCheckout({
      email: licenseEmail.trim(),
      callback_url: `${window.location.origin}/pricing/self-hosted`,
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8 px-4 py-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-600 text-white">
              <CreditCard size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Workspace
            </p>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Plan & billing
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Compare tiers, manage your subscription, and upgrade securely through Paystack.
          </p>
        </div>
        <Link
          href="/dashboard/usage"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:shrink-0"
        >
          <Zap size={16} className="text-orange-600" />
          View usage meters
          <ArrowRight size={14} className="text-slate-400" />
        </Link>
      </div>

      {/* Verification State */}
      {reference && verifying && (
        <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <Loader2 size={16} className="animate-spin text-orange-600 shrink-0" />
          <p className="text-sm font-medium text-slate-600">Confirming your payment details…</p>
        </div>
      )}

      {/* Attention Required Banner */}
      {subscription?.payment_attention && (
        <div className="flex flex-col gap-4 rounded-xl border border-rose-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-2.5">
            <div className="h-2 w-2 mt-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900">Payment needs attention</p>
              <p className="mt-0.5 text-sm text-slate-500">
                Your last renewal failed. Update your card before{" "}
                {subscription.grace_ends_at
                  ? new Date(subscription.grace_ends_at).toLocaleDateString()
                  : "the grace period ends"}{" "}
                to keep {planDisplayName(effectivePlan)} access.
              </p>
            </div>
          </div>
          {subscription.manage_link_available && (
            <button
              type="button"
              disabled={openingManageLink}
              onClick={() => openManageLink()}
              className="rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-50 md:shrink-0 shadow-sm transition-colors"
            >
              {openingManageLink ? "Opening…" : "Update payment method"}
            </button>
          )}
        </div>
      )}

      {/* Cloud Plans Matrix */}
      {cloud && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <TierCard
            name="Free"
            tagline="Get started with core features"
            price="₦0"
            priceSub="forever"
            features={FREE_PLAN_FEATURES}
            isCurrent={effectivePlan === "free"}
            variant="free"
          />

          <TierCard
            name="Growth"
            tagline="Higher limits for growing teams"
            price={GROWTH_PRICE_DISPLAY.replace("/month", "")}
            priceSub="per month"
            features={GROWTH_PLAN_FEATURES}
            isCurrent={isGrowth}
            variant="growth"
            badge={isGrowth ? "Active Plan" : undefined}
            footer={
              isGrowth ? (
                <PaidActiveFooter planLabel="Growth" subscription={subscription} />
              ) : (
                <PaidUpgradeFooter
                  label="Upgrade to Growth"
                  onUpgrade={() => handleUpgrade("growth")}
                  loading={cloudCheckout || verifying}
                />
              )
            }
          />

          <TierCard
            name="Pro"
            tagline="Unlimited scale + audit logs"
            price={PRO_PRICE_DISPLAY.replace("/month", "")}
            priceSub="per month"
            features={PRO_PLAN_FEATURES}
            isCurrent={isPro}
            variant="pro"
            badge={isPro ? "Active Plan" : "Recommended"}
            footer={
              isPro ? (
                <PaidActiveFooter planLabel="Pro" subscription={subscription} />
              ) : (
                <PaidUpgradeFooter
                  label="Upgrade to Pro"
                  onUpgrade={() => handleUpgrade("pro")}
                  loading={cloudCheckout || verifying}
                />
              )
            }
          />
        </div>
      )}

      {/* Self-hosted license */}
      {selfHosted && !cloud && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">Self-hosted license</h2>
            <p className="text-sm text-slate-500">
              One-time purchase for Pro-equivalent limits on your infrastructure.
            </p>
          </div>
          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_minmax(280px,360px)]">
            <ul className="grid gap-2 grid-cols-1 sm:grid-cols-2">
              {SELF_HOSTED_LICENSE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={14} className="mt-0.5 shrink-0 text-orange-600" />
                  {f}
                </li>
              ))}
            </ul>
            <form onSubmit={handleLicensePurchase} className="space-y-3">
              <input
                type="email"
                required
                value={licenseEmail}
                onChange={(e) => setLicenseEmail(e.target.value)}
                placeholder="License delivery email"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
              />
              <button
                type="submit"
                disabled={licenseCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
              >
                {licenseCheckout && <Loader2 size={16} className="animate-spin" />}
                Purchase license
              </button>
            </form>
          </div>
          {isPro && (
            <div className="flex items-center gap-2 border-t border-emerald-100 bg-emerald-50/40 px-5 py-3 text-sm text-emerald-800">
              <BadgeCheck size={16} className="shrink-0" />
              License active — Pro-equivalent limits apply.
            </div>
          )}
        </section>
      )}

      {/* Limits breakdown dashboard comparison */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Limits at a glance</h2>
          <p className="text-sm text-slate-500">
            How Free, Growth, and Pro compare across workspace resources
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3.5 font-semibold">Resource</th>
                <th className="px-5 py-3.5 font-semibold">Free</th>
                <th className="px-5 py-3.5 font-semibold">Growth</th>
                <th className="bg-orange-50/40 px-5 py-3.5 font-semibold text-orange-700">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}
                >
                  <td className="px-5 py-3.5 font-medium text-slate-800">{row.label}</td>
                  <td className="px-5 py-3.5 text-slate-500">{row.free}</td>
                  <td className="px-5 py-3.5 text-slate-600">{row.growth}</td>
                  <td className="bg-orange-50/20 px-5 py-3.5 font-semibold text-orange-700">
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selfHosted && cloud && (
        <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Cloud billing applies to hosted Entivia. For on-prem licenses, see{" "}
          <Link
            href="/pricing/self-hosted"
            className="font-semibold text-orange-600 hover:underline ms-1"
          >
            self-hosted pricing
          </Link>
          .
        </p>
      )}

      <p className="text-center text-xs text-slate-400">
        Marketing details and FAQs on{" "}
        <Link href="/pricing" className="font-medium text-orange-600 hover:underline">
          Entivia pricing
        </Link>
        .
      </p>
    </div>
  );
}

function TierCard({
  name,
  tagline,
  price,
  priceSub,
  features,
  isCurrent,
  variant,
  badge,
  footer,
}: {
  name: string;
  tagline: string;
  price: string;
  priceSub: string;
  features: string[];
  isCurrent: boolean;
  variant: "free" | "growth" | "pro";
  badge?: string;
  footer?: React.ReactNode;
}) {
  const isPaid = variant === "pro" || variant === "growth";

  return (
    <article
      className={`relative flex flex-col rounded-2xl border bg-white shadow-sm transition-all ${
        isCurrent
          ? "border-orange-600 ring-2 ring-orange-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl ${
                isCurrent 
                  ? "bg-orange-100 text-orange-600" 
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isPaid ? <Crown size={20} /> : <Shield size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500 leading-tight">{tagline}</p>
            </div>
          </div>
          {badge && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                isCurrent
                  ? "bg-orange-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-baseline gap-1.5">
          <span className="text-3xl font-bold tracking-tight text-slate-900">
            {price}
          </span>
          <span className="text-sm text-slate-500">
            {priceSub}
          </span>
        </div>

        <ul className="mt-6 flex-1 space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
              <Check size={14} className="mt-0.5 shrink-0 text-orange-600" />
              <span className="leading-tight">{f}</span>
            </li>
          ))}
        </ul>

        {footer && <div className="mt-6 pt-4 border-t border-slate-100">{footer}</div>}
      </div>
    </article>
  );
}

function PaidUpgradeFooter({
  label,
  onUpgrade,
  loading,
}: {
  label: string;
  onUpgrade: () => void;
  loading: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onUpgrade}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-bold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {loading ? "Redirecting to Paystack…" : label}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <CreditCard size={12} />
        Secure checkout via Paystack
      </p>
    </>
  );
}

function PaidActiveFooter({
  planLabel,
  subscription,
}: {
  planLabel: string;
  subscription: ReturnType<typeof useSubscription>["data"];
}) {
  const isPro = planLabel === "Pro";
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        This plan is currently active
      </div>
      
      <p className="text-xs text-slate-500 leading-normal">
        {isPro
          ? "Unlimited workspace caps are active across all core modules."
          : "Standard growth limits apply. Upgrade to Pro for fully unlimited workspace scale."}
      </p>
      
      {subscription && (
        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Status</span>
            <span className="font-semibold capitalize text-slate-700">{subscription.status}</span>
          </div>
          {subscription.next_payment_date && (
            <div className="flex justify-between">
              <span className="text-slate-400">Next renewal</span>
              <span className="font-semibold text-slate-700">
                {new Date(subscription.next_payment_date).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}