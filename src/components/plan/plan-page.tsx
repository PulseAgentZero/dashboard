"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  useCancelSubscription,
  useInitializeCloudCheckout,
  useSubscription,
  useOpenManagePaymentLink,
  useVerifyCloudPayment,
} from "@/hooks/billing/use-billing";
import { DeleteConfirmModal } from "@/components/shared/delete-confirm-modal";
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
import { getMarketingUrl, marketingHref } from "@/lib/site-urls";
import {
  isPaidPlan,
  isProPlan,
  planDisplayName,
  resolveEffectivePlan,
} from "@/lib/plan-utils";
import type { CloudPlanTier } from "@/lib/api/billing-api";
import { tokens } from "@/lib/auth-tokens";

const VERIFIED_PAYMENT_REF_KEY = "pulse_verified_payment_ref";

export function PlanPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { org } = useAuth();
  const { data: usage } = useUsage();
  const { data: subscription } = useSubscription();
  const { mutate: startCloudCheckout, isPending: cloudCheckout } =
    useInitializeCloudCheckout();
  const { mutate: verifyPayment, isPending: verifying } = useVerifyCloudPayment();
  const { mutate: openManageLink, isPending: openingManageLink } =
    useOpenManagePaymentLink();
  const { mutate: cancelSubscription, isPending: cancelling } =
    useCancelSubscription();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const cloud = isCloudDeployment();
  const selfHosted = isSelfHostedDeployment();
  const effectivePlan = resolveEffectivePlan(
    usage?.plan,
    org?.plan,
    subscription ?? undefined,
  );
  const isGrowth = effectivePlan === "growth";
  const isPro = isProPlan(effectivePlan);
  const nonRenewing = subscription?.status === "non-renewing";
  const canCancel = cloud && isPaidPlan(effectivePlan) && !nonRenewing;

  useEffect(() => {
    if (!reference) return;
    if (typeof window === "undefined") return;
    if (!tokens.getAccess() || !cloud) return;

    window.history.replaceState(null, "", "/dashboard/plan");

    if (sessionStorage.getItem(VERIFIED_PAYMENT_REF_KEY) === reference) {
      return;
    }
    sessionStorage.setItem(VERIFIED_PAYMENT_REF_KEY, reference);
    verifyPayment(reference);
  }, [reference, verifyPayment, cloud]);

  function handleUpgrade(tier: CloudPlanTier) {
    startCloudCheckout({
      callbackUrl: `${window.location.origin}/dashboard/plan`,
      plan: tier,
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
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
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <Zap size={16} className="text-orange-600" />
          View usage meters
          <ArrowRight size={14} className="text-slate-400" />
        </Link>
      </div>

      {verifying && (
        <div className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-5 py-4 text-sm text-orange-800">
          <Loader2 size={18} className="animate-spin shrink-0" />
          Confirming your payment…
        </div>
      )}

      {subscription?.payment_attention && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <p className="font-semibold">Payment needs attention</p>
          <p className="mt-1 text-amber-800">
            Your last renewal failed. Update your card before{" "}
            {subscription.grace_ends_at
              ? new Date(subscription.grace_ends_at).toLocaleDateString()
              : "the grace period ends"}{" "}
            to keep {planDisplayName(effectivePlan)} access.
          </p>
          {subscription.manage_link_available && (
            <button
              type="button"
              disabled={openingManageLink}
              onClick={() => openManageLink()}
              className="mt-3 rounded-lg bg-amber-800 px-4 py-2 text-xs font-bold text-white hover:bg-amber-900 disabled:opacity-50"
            >
              {openingManageLink ? "Opening…" : "Update payment method"}
            </button>
          )}
        </div>
      )}

      {cloud && (
        <div className="grid gap-5 lg:grid-cols-3">
          <TierCard
            name="Free"
            tagline="Get started with core Entivia features"
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
            badge={isGrowth ? "Current plan" : undefined}
            footer={
              isGrowth ? (
                <PaidActiveFooter
                  planLabel="Growth"
                  subscription={subscription}
                  canCancel={canCancel}
                  cancelling={cancelling}
                  onCancel={() => setConfirmCancel(true)}
                />
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
            badge={isPro ? "Current plan" : "Recommended"}
            footer={
              isPro ? (
                <PaidActiveFooter
                  planLabel="Pro"
                  subscription={subscription}
                  canCancel={canCancel}
                  cancelling={cancelling}
                  onCancel={() => setConfirmCancel(true)}
                />
              ) : (
                <PaidUpgradeFooter
                  label="Upgrade to Pro"
                  onUpgrade={() => handleUpgrade("pro")}
                  loading={cloudCheckout || verifying}
                  primary
                />
              )
            }
          />
        </div>
      )}

      {/* Self-hosted license (on-prem only) */}
      {selfHosted && !cloud && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">Self-hosted license</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              One-time purchase for Pro-equivalent limits on your infrastructure.
            </p>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
            <ul className="grid gap-2 sm:grid-cols-2">
              {SELF_HOSTED_LICENSE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check size={14} className="mt-0.5 shrink-0 text-orange-600" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Licenses are issued by the Entivia license server. Purchase a key, then
                activate it under <span className="font-semibold">Settings → License</span>.
              </p>
              <a
                href={getMarketingUrl() ? marketingHref("/pricing/self-hosted") : "https://entivia.online/pricing/self-hosted"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Purchase license at entivia.online
                <ArrowRight size={14} />
              </a>
              <Link
                href="/dashboard/settings?tab=license"
                className="block text-center text-xs font-semibold text-orange-600 hover:text-orange-500"
              >
                I already have a key → Activate
              </Link>
            </div>
          </div>
          {isPro && (
            <div className="border-t border-orange-100 bg-orange-50/60 px-6 py-3 text-sm text-orange-800">
              <BadgeCheck size={16} className="mr-1.5 inline -mt-0.5" />
              License active — Pro-equivalent limits apply.
            </div>
          )}
        </section>
      )}

      {/* Limits comparison */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">Limits at a glance</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            How Free, Growth, and Pro compare across workspace resources
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3.5 font-semibold">Resource</th>
                <th className="px-6 py-3.5 font-semibold">Free</th>
                <th className="px-6 py-3.5 font-semibold">Growth</th>
                <th className="bg-orange-50/50 px-6 py-3.5 font-semibold text-orange-700">
                  Pro
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}
                >
                  <td className="px-6 py-3.5 font-medium text-slate-800">{row.label}</td>
                  <td className="px-6 py-3.5 text-slate-500">{row.free}</td>
                  <td className="px-6 py-3.5 text-slate-600">{row.growth}</td>
                  <td className="bg-orange-50/20 px-6 py-3.5 font-semibold text-orange-700">
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selfHosted && cloud && (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Cloud billing applies to hosted Entivia. For on-prem licenses, see{" "}
          <Link
            href="/pricing/self-hosted"
            className="font-semibold text-orange-600 hover:underline"
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

      <DeleteConfirmModal
        open={confirmCancel}
        title="Cancel subscription?"
        description={
          subscription?.next_payment_date
            ? `Auto-renewal will be disabled immediately. You'll keep ${planDisplayName(
                effectivePlan,
              )} access until ${new Date(
                subscription.next_payment_date,
              ).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}, then your workspace will be downgraded to Free.`
            : `Auto-renewal will be disabled. Your workspace will be downgraded to Free at the end of the current billing period.`
        }
        confirmLabel={cancelling ? "Cancelling…" : "Cancel subscription"}
        cancelLabel="Keep plan"
        pending={cancelling}
        onConfirm={() =>
          cancelSubscription(undefined, {
            onSuccess: () => setConfirmCancel(false),
          })
        }
        onCancel={() => setConfirmCancel(false)}
      />
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
  const isPro = variant === "pro";
  const isGrowth = variant === "growth";

  // Flat unique border styling colors mapping
  const borderClass = isCurrent
    ? isPro
      ? "border-orange-500 ring-1 ring-orange-500/30 bg-white"
      : isGrowth
        ? "border-amber-500 ring-1 ring-amber-500/30 bg-white"
        : "border-slate-400 ring-1 ring-slate-400/20 bg-white"
    : "border-slate-200 bg-white";

  return (
    <article className={`relative flex flex-col overflow-hidden rounded-2xl border p-6 transition-all ${borderClass}`}>
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl ${
                isPro
                  ? "bg-orange-50"
                  : isGrowth
                    ? "bg-amber-50"
                    : "bg-slate-50"
              }`}
            >
              {variant !== "free" ? (
                <Crown
                  size={20}
                  className={isPro ? "text-orange-600" : "text-amber-600"}
                />
              ) : (
                <Shield size={20} className="text-slate-500" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">{tagline}</p>
            </div>
          </div>
          {badge && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                isPro
                  ? "bg-orange-100 text-orange-800"
                  : isGrowth
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-700"
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
          <span className="text-sm text-slate-500">{priceSub}</span>
        </div>

        <ul className="mt-5 flex-1 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
              <Check
                size={14}
                className={`mt-0.5 shrink-0 ${
                  isPro
                    ? "text-orange-600"
                    : isGrowth
                      ? "text-amber-600"
                      : "text-slate-400"
                }`}
              />
              {f}
            </li>
          ))}
        </ul>

        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </article>
  );
}

function PaidUpgradeFooter({
  label,
  onUpgrade,
  loading,
  primary,
}: {
  label: string;
  onUpgrade: () => void;
  loading: boolean;
  primary?: boolean;
}) {
  const btnClass = primary
    ? "bg-orange-600 hover:bg-orange-700"
    : "bg-slate-900 hover:bg-slate-800";
  return (
    <>
      <button
        type="button"
        onClick={onUpgrade}
        disabled={loading}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-50 ${btnClass}`}
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
        Secure checkout · return here after payment
      </p>
    </>
  );
}

function PaidActiveFooter({
  planLabel,
  subscription,
  canCancel,
  cancelling,
  onCancel,
}: {
  planLabel: string;
  subscription: ReturnType<typeof useSubscription>["data"];
  canCancel: boolean;
  cancelling: boolean;
  onCancel: () => void;
}) {
  const isPro = planLabel === "Pro";
  const nonRenewing = subscription?.status === "non-renewing";
  const endsAt = subscription?.next_payment_date
    ? new Date(subscription.next_payment_date).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : null;
    
  return (
    <div className={`rounded-xl border px-4 py-3 ${isPro ? "border-orange-100 bg-orange-50/50" : "border-amber-100 bg-amber-50/50"}`}>
      <p className="text-sm font-semibold text-slate-900">You&apos;re on {planLabel}</p>
      <p className="mt-0.5 text-xs text-slate-600">
        {isPro
          ? "Unlimited usage across all workspace meters."
          : "Growth limits apply — upgrade to Pro for unlimited usage and audit logs."}
      </p>
      {subscription && (
        <dl className="mt-3 space-y-1 text-xs text-slate-600">
          <div className="flex justify-between gap-4">
            <dt>Status</dt>
            <dd className="font-semibold capitalize text-slate-900">{subscription.status}</dd>
          </div>
          {subscription.next_payment_date && (
            <div className="flex justify-between gap-4">
              <dt>{nonRenewing ? "Ends on" : "Next billing"}</dt>
              <dd className="font-semibold text-slate-900">{endsAt}</dd>
            </div>
          )}
        </dl>
      )}

      {nonRenewing && endsAt && (
        <p className="mt-3 rounded-lg bg-white border border-slate-200 px-3 py-2 text-[11px] leading-relaxed text-slate-600">
          Auto-renewal is off. {planLabel} access continues until {endsAt}, then
          this workspace will be downgraded to Free.
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <Link
          href="/dashboard/usage"
          className={`inline-flex items-center gap-1 text-xs font-semibold hover:underline ${isPro ? "text-orange-600" : "text-amber-700"}`}
        >
          View usage
          <ArrowRight size={12} />
        </Link>
        {canCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={cancelling}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelling && <Loader2 size={11} className="animate-spin" />}
            Cancel subscription
          </button>
        )}
      </div>
    </div>
  );
}