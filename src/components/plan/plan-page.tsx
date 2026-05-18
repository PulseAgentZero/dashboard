"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  CreditCard,
  Crown,
  Loader2,
  Sparkles,
  Shield,
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
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <div className="flex items-center gap-2 text-slate-500">
          <CreditCard size={18} />
          <p className="text-xs font-semibold uppercase tracking-wide">Workspace</p>
        </div>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Plan & billing</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your subscription, compare tiers, and start checkout securely via Paystack.
        </p>
      </div>

      {reference && verifying && (
        <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-5 py-4 text-sm text-indigo-800">
          <Loader2 size={18} className="animate-spin" />
          Confirming your payment…
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current plan */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-6 shadow-sm ${
            isPro
              ? "border-indigo-200 bg-gradient-to-br from-indigo-600 to-violet-700 text-white"
              : "border-slate-200 bg-white"
          }`}
        >
          {isPro && (
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
          )}
          <div className="relative flex items-center gap-3">
            <div
              className={`grid h-12 w-12 place-items-center rounded-xl ${
                isPro ? "bg-white/20" : "bg-slate-100"
              }`}
            >
              {isPro ? (
                <Crown size={22} className="text-amber-300" />
              ) : (
                <Shield size={22} className="text-slate-600" />
              )}
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isPro ? "text-indigo-200" : "text-slate-500"}`}>
                Current plan
              </p>
              <p className={`text-2xl font-bold capitalize ${isPro ? "text-white" : "text-slate-900"}`}>
                {plan}
              </p>
            </div>
          </div>
          {cloud && subscription && isPro && (
            <div className={`relative mt-4 space-y-1 text-sm ${isPro ? "text-indigo-100" : "text-slate-600"}`}>
              <p>
                Status:{" "}
                <span className="font-semibold capitalize">{subscription.status}</span>
              </p>
              {subscription.next_payment_date && (
                <p>
                  Next billing:{" "}
                  {new Date(subscription.next_payment_date).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              )}
            </div>
          )}
          {selfHosted && isPro && (
            <p className={`relative mt-4 text-sm ${isPro ? "text-indigo-100" : "text-slate-600"}`}>
              Self-hosted license active — Pro-equivalent limits apply.
            </p>
          )}
          <Link
            href="/dashboard/usage"
            className={`relative mt-5 inline-block text-sm font-semibold hover:underline ${
              isPro ? "text-white" : "text-indigo-600"
            }`}
          >
            View usage →
          </Link>
        </div>

        {/* Checkout card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {cloud && !isPro && (
            <>
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                <h2 className="text-lg font-semibold text-slate-900">Upgrade to Pro</h2>
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-900">{PRO_PRICE_DISPLAY}</p>
              <p className="text-sm text-slate-500">Billed monthly · cancel anytime</p>
              <ul className="mt-5 space-y-2">
                {PRO_PLAN_FEATURES.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={14} className="mt-0.5 shrink-0 text-indigo-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleUpgradePro}
                disabled={cloudCheckout || verifying}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 disabled:opacity-50"
              >
                {cloudCheckout ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CreditCard size={16} />
                )}
                {cloudCheckout ? "Redirecting to Paystack…" : "Continue to checkout"}
              </button>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                Secure payment powered by Paystack. You&apos;ll return here after payment.
              </p>
            </>
          )}

          {cloud && isPro && (
            <div className="py-4 text-center">
              <Crown size={32} className="mx-auto text-amber-500" />
              <p className="mt-3 font-semibold text-slate-900">You&apos;re on Pro</p>
              <p className="mt-1 text-sm text-slate-500">
                Enjoy unlimited usage across all meters.
              </p>
            </div>
          )}

          {selfHosted && !cloud && (
            <>
              <h2 className="text-lg font-semibold text-slate-900">Self-hosted license</h2>
              <p className="mt-2 text-sm text-slate-500">
                One-time purchase for Pro-equivalent limits on your infrastructure.
              </p>
              <ul className="mt-4 space-y-2">
                {SELF_HOSTED_LICENSE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check size={14} className="mt-0.5 text-emerald-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <form onSubmit={handleLicensePurchase} className="mt-5 space-y-3">
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
            </>
          )}

          {selfHosted && cloud && (
            <p className="text-sm text-slate-600">
              Cloud billing applies to hosted Pulse. For on-prem licenses, see{" "}
              <Link href="/pricing/self-hosted" className="font-semibold text-indigo-600 hover:underline">
                self-hosted pricing
              </Link>
              .
            </p>
          )}
        </div>
      </div>

      {/* Plan comparison */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Compare plans</h2>
        <p className="mt-1 text-sm text-slate-500">Free vs Pro feature limits</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Resource</th>
                <th className="pb-3 pr-4 font-medium">Free</th>
                <th className="pb-3 font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-800">{row.label}</td>
                  <td className="py-3 pr-4 text-slate-500">{row.free}</td>
                  <td className="py-3 font-semibold text-indigo-600">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-900">Free includes</h3>
          <ul className="mt-3 space-y-2">
            {FREE_PLAN_FEATURES.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-slate-600">
                <Check size={14} className="mt-0.5 shrink-0 text-slate-400" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h3 className="font-semibold text-slate-900">Pro adds</h3>
          <ul className="mt-3 space-y-2">
            {PRO_PLAN_FEATURES.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-slate-700">
                <Check size={14} className="mt-0.5 shrink-0 text-indigo-600" />
                {f}
              </li>
            ))}
          </ul>
          {cloud && !isPro && (
            <button
              type="button"
              onClick={handleUpgradePro}
              disabled={cloudCheckout}
              className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Upgrade now
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Public marketing details also on{" "}
        <Link href="/pricing" className="text-indigo-600 hover:underline">
          pulse pricing
        </Link>
        .
      </p>
    </div>
  );
}
