"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { useAuth } from "@/providers/auth-provider";
import {
  useInitializeSelfHostedCheckout,
  useVerifySelfHostedPayment,
} from "@/hooks/billing/use-billing";
import { SELF_HOSTED_LICENSE_FEATURES } from "@/lib/plans";
import { isCloudDeployment } from "@/lib/deployment";
import { tokens } from "@/lib/auth-tokens";

const VERIFIED_PAYMENT_REF_KEY = "pulse_verified_license_ref";

export function PricingSelfHostedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState<string | null>(() =>
    typeof window === "undefined" ? null : sessionStorage.getItem("pulse_license_key"),
  );
  const [verifyMessage, setVerifyMessage] = useState<string | null>(() =>
    typeof window === "undefined" ? null : sessionStorage.getItem("pulse_license_message"),
  );

  const { mutate: startCheckout, isPending: checkoutPending } =
    useInitializeSelfHostedCheckout();
  const { mutate: verifyPayment, isPending: verifying } =
    useVerifySelfHostedPayment();

  const cloud = isCloudDeployment();

  useEffect(() => {
    if (!reference) return;
    if (typeof window === "undefined") return;
    if (!tokens.getAccess()) return;

    window.history.replaceState(null, "", "/pricing/self-hosted");

    if (sessionStorage.getItem(VERIFIED_PAYMENT_REF_KEY) === reference) {
      return;
    }
    sessionStorage.setItem(VERIFIED_PAYMENT_REF_KEY, reference);
    verifyPayment(reference, {
      onSuccess: (data) => {
        if (data.license_key) {
          sessionStorage.setItem("pulse_license_key", data.license_key);
        }
        if (data.message) {
          sessionStorage.setItem("pulse_license_message", data.message);
        }
        setLicenseKey(data.license_key);
        setVerifyMessage(data.message);
      },
    });
  }, [reference, verifyPayment]);

  function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    const purchaseEmail = email?.trim() || user?.email?.trim();
    if (!purchaseEmail) return;
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/pricing/self-hosted");
      return;
    }
    const callbackUrl = `${window.location.origin}/pricing/self-hosted`;
    startCheckout({ email: purchaseEmail, callback_url: callbackUrl });
  }

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Navbar />

      <main className="px-4 pt-24 pb-16 md:pt-28 md:pb-20">
        {cloud && (
          <div className="mx-auto mb-8 max-w-3xl">
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-3.5 text-xs sm:text-sm text-orange-200/90 backdrop-blur-sm">
              Looking for hosted Entivia Cloud?{" "}
              <Link href="/pricing" className="font-semibold text-orange-400 underline hover:text-orange-300 transition-colors">
                View cloud pricing
              </Link>
              .
            </div>
          </div>
        )}

        {verifying && (
          <div className="mx-auto mb-8 flex max-w-md items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4 text-xs sm:text-sm text-zinc-300 backdrop-blur-sm">
            <Loader2 size={16} className="animate-spin text-orange-500" />
            Verifying license payment…
          </div>
        )}

        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 sm:text-xs">
            Self-hosted
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
            Run Entivia on your infrastructure
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-zinc-400 leading-relaxed">
            One-time license purchase. Deploy behind your firewall with Pro-equivalent
            limits and your own LLM keys.
          </p>
        </div>

        <div className="mx-auto mt-10 sm:mt-14 max-w-lg rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-orange-950/5">
          <ul className="mb-8 space-y-3">
            {SELF_HOSTED_LICENSE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                <Check size={16} className="mt-0.5 shrink-0 text-orange-500" />
                <span className="leading-tight">{f}</span>
              </li>
            ))}
          </ul>

          {licenseKey ? (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-5">
              <p className="text-xs sm:text-sm font-semibold text-emerald-400">
                {verifyMessage ?? "License activated"}
              </p>
              <code className="mt-3 block break-all rounded-lg bg-black/60 p-3 font-mono text-[11px] sm:text-xs text-emerald-300 border border-emerald-500/10 select-all">
                {licenseKey}
              </code>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(licenseKey);
                  toast.success("License key copied");
                }}
                className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Copy size={12} />
                Copy key
              </button>
              <p className="mt-3.5 text-[11px] sm:text-xs text-zinc-500 leading-normal">
                A copy has also been emailed to you. Activate it in Settings → License
                on your self-hosted instance.
              </p>
            </div>
          ) : (
            <form onSubmit={handlePurchase} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-zinc-400">
                  Email for license delivery
                </label>
                <input
                  type="email"
                  required
                  value={email ?? user?.email ?? ""}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="admin@yourcompany.com"
                />
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 leading-normal">
                Price is shown at Paystack checkout (configured on your Entivia server).
              </p>
              <button
                type="submit"
                disabled={checkoutPending || authLoading || verifying}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-orange-600/10 hover:bg-orange-500 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                {checkoutPending && <Loader2 size={14} className="animate-spin" />}
                {isAuthenticated ? "Purchase license" : "Sign in to purchase"}
              </button>
            </form>
          )}
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs sm:text-sm text-zinc-500">
          Prefer managed hosting?{" "}
          <Link href="/pricing" className="text-zinc-400 underline hover:text-orange-400 transition-colors">
            Entivia Cloud from {process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY ?? "₦40,000/month"}
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}