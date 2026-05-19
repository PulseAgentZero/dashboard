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
  useVerifyCloudPayment,
} from "@/hooks/billing/use-billing";
import {
  FREE_PLAN_FEATURES,
  PLAN_COMPARISON,
  PRO_PLAN_FEATURES,
  PRO_PRICE_DISPLAY,
  SELF_HOSTED_LICENSE_FEATURES,
} from "@/lib/plans";
import { isCloudDeployment, isSelfHostedDeployment } from "@/lib/deployment";
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
  const verifiedRef = useRef<string | null>(null);
  const [licenseEmail, setLicenseEmail] = useState("");

  const cloud = isCloudDeployment();
  const selfHosted = isSelfHostedDeployment();
  const plan = usage?.plan ?? org?.plan ?? subscription?.plan ?? "free";
  const isPro = plan.toLowerCase() === "pro";

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

  function handleUpgradePro() {
    const callbackUrl = `${window.location.origin}/dashboard/plan`;
    startCloudCheckout(callbackUrl);
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
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 text-white">
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
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <Zap size={16} className="text-indigo-600" />
          View usage meters
          <ArrowRight size={14} className="text-slate-400" />
        </Link>
      </div>

      {reference && verifying && (
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm text-indigo-800">
          <Loader2 size={18} className="animate-spin shrink-0" />
          Confirming your payment…
        </div>
      )}

      {/* Plan tier cards */}
      {cloud && (
        <div className="grid gap-5 lg:grid-cols-2">
          <TierCard
            name="Free"
            tagline="Get started with core Pulse features"
            price="₦0"
            priceSub="forever"
            features={FREE_PLAN_FEATURES}
            isCurrent={!isPro}
            variant="free"
          />

          <TierCard
            name="Pro"
            tagline="Unlimited scale for growing teams"
            price={PRO_PRICE_DISPLAY.replace("/month", "")}
            priceSub="per month"
            features={PRO_PLAN_FEATURES}
            isCurrent={isPro}
            variant="pro"
            highlighted={!isPro}
            badge={!isPro ? "Recommended" : "Current plan"}
            footer={
              isPro ? (
                <ProActiveFooter subscription={subscription} />
              ) : (
                <ProUpgradeFooter
                  onUpgrade={handleUpgradePro}
                  loading={cloudCheckout || verifying}
                />
              )
            }
          />
        </div>
      )}

      {/* Self-hosted license (on-prem only) */}
      {selfHosted && !cloud && (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
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
                  <Check size={14} className="mt-0.5 shrink-0 text-emerald-600" />
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
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button
                type="submit"
                disabled={licenseCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {licenseCheckout && <Loader2 size={16} className="animate-spin" />}
                Purchase license
              </button>
            </form>
          </div>
          {isPro && (
            <div className="border-t border-emerald-100 bg-emerald-50/60 px-6 py-3 text-sm text-emerald-800">
              <BadgeCheck size={16} className="mr-1.5 inline -mt-0.5" />
              License active — Pro-equivalent limits apply.
            </div>
          )}
        </section>
      )}

      {/* Limits comparison */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-base font-semibold text-slate-900">Limits at a glance</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            How Free and Pro compare across workspace resources
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3.5 font-semibold">Resource</th>
                <th className="px-6 py-3.5 font-semibold">Free</th>
                <th className="bg-indigo-50/80 px-6 py-3.5 font-semibold text-indigo-700">
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
                  <td className="bg-indigo-50/30 px-6 py-3.5 font-semibold text-indigo-700">
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
          Cloud billing applies to hosted Pulse. For on-prem licenses, see{" "}
          <Link
            href="/pricing/self-hosted"
            className="font-semibold text-indigo-600 hover:underline"
          >
            self-hosted pricing
          </Link>
          .
        </p>
      )}

      <p className="text-center text-xs text-slate-400">
        Marketing details and FAQs on{" "}
        <Link href="/pricing" className="font-medium text-indigo-600 hover:underline">
          pulse pricing
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
  highlighted,
  badge,
  footer,
}: {
  name: string;
  tagline: string;
  price: string;
  priceSub: string;
  features: string[];
  isCurrent: boolean;
  variant: "free" | "pro";
  highlighted?: boolean;
  badge?: string;
  footer?: React.ReactNode;
}) {
  const isPro = variant === "pro";

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-shadow ${
        isPro && isCurrent
          ? "border-indigo-300 bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white shadow-indigo-600/20"
          : isPro && highlighted
            ? "border-indigo-200 bg-white ring-2 ring-indigo-500/20"
            : isCurrent
              ? "border-slate-300 bg-white ring-2 ring-slate-300/50"
              : "border-slate-200 bg-white"
      }`}
    >
      {isPro && isCurrent && (
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
      )}

      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`grid h-11 w-11 place-items-center rounded-xl ${
                isPro && isCurrent
                  ? "bg-white/20"
                  : isPro
                    ? "bg-indigo-100"
                    : "bg-slate-100"
              }`}
            >
              {isPro ? (
                <Crown
                  size={20}
                  className={isCurrent ? "text-amber-300" : "text-indigo-600"}
                />
              ) : (
                <Shield size={20} className="text-slate-600" />
              )}
            </div>
            <div>
              <h2
                className={`text-lg font-bold ${
                  isPro && isCurrent ? "text-white" : "text-slate-900"
                }`}
              >
                {name}
              </h2>
              <p
                className={`text-xs ${
                  isPro && isCurrent ? "text-indigo-200" : "text-slate-500"
                }`}
              >
                {tagline}
              </p>
            </div>
          </div>
          {badge && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                isPro && isCurrent
                  ? "bg-white/20 text-white"
                  : isPro
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-200 text-slate-700"
              }`}
            >
              {badge}
            </span>
          )}
        </div>

        <div className="mt-5 flex items-baseline gap-1.5">
          <span
            className={`text-3xl font-bold tracking-tight ${
              isPro && isCurrent ? "text-white" : "text-slate-900"
            }`}
          >
            {price}
          </span>
          <span
            className={`text-sm ${isPro && isCurrent ? "text-indigo-200" : "text-slate-500"}`}
          >
            {priceSub}
          </span>
        </div>

        <ul className="mt-5 flex-1 space-y-2.5">
          {features.map((f) => (
            <li
              key={f}
              className={`flex items-start gap-2 text-sm ${
                isPro && isCurrent ? "text-indigo-50" : "text-slate-600"
              }`}
            >
              <Check
                size={14}
                className={`mt-0.5 shrink-0 ${
                  isPro && isCurrent
                    ? "text-emerald-300"
                    : isPro
                      ? "text-indigo-600"
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

function ProUpgradeFooter({
  onUpgrade,
  loading,
}: {
  onUpgrade: () => void;
  loading: boolean;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onUpgrade}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Sparkles size={16} />
        )}
        {loading ? "Redirecting to Paystack…" : "Upgrade to Pro"}
      </button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <CreditCard size={12} />
        Secure checkout · return here after payment
      </p>
    </>
  );
}

function ProActiveFooter({
  subscription,
}: {
  subscription: ReturnType<typeof useSubscription>["data"];
}) {
  return (
    <div
      className={`rounded-xl px-4 py-3 ${
        "border border-white/20 bg-white/10"
      }`}
    >
      <p className="text-sm font-medium text-white">You&apos;re on Pro</p>
      <p className="mt-0.5 text-xs text-indigo-100">
        Unlimited usage across all workspace meters.
      </p>
      {subscription && (
        <dl className="mt-3 space-y-1 text-xs text-indigo-100">
          <div className="flex justify-between gap-4">
            <dt>Status</dt>
            <dd className="font-semibold capitalize text-white">{subscription.status}</dd>
          </div>
          {subscription.next_payment_date && (
            <div className="flex justify-between gap-4">
              <dt>Next billing</dt>
              <dd className="font-semibold text-white">
                {new Date(subscription.next_payment_date).toLocaleDateString(undefined, {
                  dateStyle: "medium",
                })}
              </dd>
            </div>
          )}
        </dl>
      )}
      <Link
        href="/dashboard/usage"
        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white hover:underline"
      >
        View usage
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
