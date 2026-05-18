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
  PLAN_COMPARISON,
  PRO_PLAN_FEATURES,
  PRO_PRICE_DISPLAY,
} from "@/lib/plans";
import { isSelfHostedDeployment } from "@/lib/deployment";
import { tokens } from "@/lib/auth-tokens";

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
  const isPro =
    org?.plan?.toLowerCase() === "pro" ||
    subscription?.plan?.toLowerCase() === "pro";

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

  function handleUpgrade() {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/pricing");
      return;
    }
    const callbackUrl = `${window.location.origin}/pricing`;
    startCheckout(callbackUrl);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28 pb-20">
        {selfHosted && (
          <div className="mx-auto mb-8 max-w-4xl px-6">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
              You are running a self-hosted deployment. Cloud subscriptions apply
              to Pulse Cloud only.{" "}
              <Link
                href="/pricing/self-hosted"
                className="font-semibold underline hover:text-white"
              >
                Purchase a self-hosted license
              </Link>
              .
            </div>
          </div>
        )}

        {reference && verifying && (
          <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-4 text-sm text-zinc-300">
            <Loader2 size={16} className="animate-spin" />
            Verifying payment…
          </div>
        )}

        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Pulse Cloud
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Simple pricing for growing teams
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Start free, upgrade when you need unlimited scale. Billed monthly via
            Paystack.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 px-6 md:grid-cols-2">
          {/* Free */}
          <div className="flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950/80 p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Free
            </p>
            <p className="mt-4 text-4xl font-bold">₦0</p>
            <p className="mt-1 text-sm text-zinc-500">Forever</p>
            <ul className="mt-8 flex-1 space-y-3">
              {FREE_PLAN_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="mt-8 block rounded-full border border-zinc-700 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-900"
            >
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col rounded-2xl border border-indigo-500/50 bg-gradient-to-b from-indigo-950/40 to-zinc-950 p-8 shadow-lg shadow-indigo-500/10">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              Popular
            </span>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-300">
              Pro
            </p>
            <p className="mt-4 text-4xl font-bold">{PRO_PRICE_DISPLAY}</p>
            <p className="mt-1 text-sm text-zinc-400">Per organization</p>
            <ul className="mt-8 flex-1 space-y-3">
              {PRO_PLAN_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-200">
                  <Check size={16} className="mt-0.5 shrink-0 text-indigo-400" />
                  {f}
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="mt-8 rounded-full bg-emerald-500/20 py-3 text-center text-sm font-semibold text-emerald-300">
                Current plan
                {subscription?.next_payment_date && (
                  <span className="mt-1 block text-xs font-normal text-emerald-400/80">
                    Renews{" "}
                    {new Date(subscription.next_payment_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={
                  checkoutPending || authLoading || verifying || selfHosted
                }
                className="mt-8 flex items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-bold text-black hover:bg-zinc-200 disabled:opacity-50"
              >
                {checkoutPending && <Loader2 size={14} className="animate-spin" />}
                {isAuthenticated ? "Upgrade to Pro" : "Sign in to upgrade"}
              </button>
            )}
          </div>
        </div>

        {/* Comparison table */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 px-6">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500">
                <th className="py-4 pr-4 font-medium">Limit</th>
                <th className="py-4 pr-4 font-medium">Free</th>
                <th className="py-4 font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map((row) => (
                <tr key={row.label} className="border-b border-zinc-900 text-zinc-300">
                  <td className="py-3 pr-4">{row.label}</td>
                  <td className="py-3 pr-4 text-zinc-400">{row.free}</td>
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
