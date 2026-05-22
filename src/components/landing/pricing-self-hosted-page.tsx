"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Copy, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import {
  useInitializeSelfHostedCheckout,
  useVerifySelfHostedPayment,
} from "@/hooks/billing/use-billing";
import { SELF_HOSTED_LICENSE_FEATURES } from "@/lib/plans";
import { isCloudDeployment, isSelfHostedDeployment } from "@/lib/deployment";
import { getMarketingUrl } from "@/lib/site-urls";

const FALLBACK_MARKETING_PURCHASE_URL = "https://entivia.online/pricing/self-hosted";

// The verify endpoint is anonymous and idempotent — we still de-dupe on the
// client so a curious refresh doesn't fire repeated requests.
const VERIFIED_REF_SESSION_KEY = "pulse_verified_license_ref";

export function PricingSelfHostedPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const { mutate: startCheckout, isPending: checkoutPending } =
    useInitializeSelfHostedCheckout();
  const { mutate: verifyPayment, isPending: verifying } =
    useVerifySelfHostedPayment();

  const cloud = isCloudDeployment();
  const selfHosted = isSelfHostedDeployment();
  const marketingBase = getMarketingUrl();
  const marketingPurchaseUrl = marketingBase
    ? `${marketingBase}/pricing/self-hosted`
    : FALLBACK_MARKETING_PURCHASE_URL;

  useEffect(() => {
    if (!selfHosted) return;
    if (typeof window === "undefined") return;
    window.location.replace(marketingPurchaseUrl);
  }, [selfHosted, marketingPurchaseUrl]);

  useEffect(() => {
    if (selfHosted) return;
    if (!reference) return;
    if (typeof window === "undefined") return;

    window.history.replaceState(null, "", "/pricing/self-hosted");

    if (sessionStorage.getItem(VERIFIED_REF_SESSION_KEY) === reference) {
      return;
    }
    sessionStorage.setItem(VERIFIED_REF_SESSION_KEY, reference);
    verifyPayment(reference, {
      onSuccess: (data) => {
        setLicenseKey(data.license_key ?? null);
        setVerifyMessage(data.message ?? null);
      },
    });
  }, [reference, verifyPayment, selfHosted]);

  if (selfHosted) {
    return (
      <div className="min-h-screen bg-black text-white antialiased">
        <main className="grid min-h-screen place-items-center px-4">
          <div className="max-w-md text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Self-hosted
            </p>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Redirecting to Entivia pricing…
            </h1>
            <p className="mt-3 text-sm text-zinc-400">
              Self-hosted licenses are issued by the Entivia license server. If you are
              not redirected automatically, continue at{" "}
              <a
                href={marketingPurchaseUrl}
                className="font-semibold text-orange-400 underline hover:text-orange-300"
              >
                {marketingPurchaseUrl.replace(/^https?:\/\//, "")}
              </a>
              .
            </p>
          </div>
        </main>
      </div>
    );
  }

  function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    const purchaseEmail = email.trim();
    if (!purchaseEmail) return;
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
              <Link
                href="/pricing"
                className="font-semibold text-orange-400 underline hover:text-orange-300 transition-colors"
              >
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
            One-time license purchase. Deploy behind your firewall with log streaming,
            SSO, LDAP sync, high-concurrency pipelines, and your own LLM keys.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-zinc-500">
            No Entivia account required — checkout is email-only and your license
            key is delivered straight to your inbox.
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
              <div className="mt-4 border-t border-emerald-500/10 pt-4 text-[11px] sm:text-xs text-zinc-400">
                Lost this key later? Open the{" "}
                <Link
                  href="/pricing/self-hosted/portal"
                  className="font-semibold text-emerald-300 underline hover:text-emerald-200 transition-colors"
                >
                  customer portal
                </Link>{" "}
                and we&apos;ll email you any keys you&apos;ve ever bought with this address.
              </div>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  placeholder="admin@yourcompany.com"
                />
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-500 leading-normal">
                Price is shown at Paystack checkout. No account needed — the key is
                emailed to you and accessible later from the customer portal.
              </p>
              <button
                type="submit"
                disabled={checkoutPending || verifying || !email.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-orange-600/10 hover:bg-orange-500 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
              >
                {checkoutPending && <Loader2 size={14} className="animate-spin" />}
                Purchase license
              </button>
            </form>
          )}
        </div>

        {/* Trust signals + portal pointer */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 text-xs sm:text-sm text-zinc-400">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-orange-500" />
            <div>
              <p className="font-semibold text-zinc-200">No cloud account required</p>
              <p className="mt-1 leading-snug">
                Pay with Paystack, get your key by email, bind it to your own
                self-hosted org on activation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 text-xs sm:text-sm text-zinc-400">
            <Mail size={18} className="mt-0.5 shrink-0 text-orange-500" />
            <div>
              <p className="font-semibold text-zinc-200">Lost your key?</p>
              <p className="mt-1 leading-snug">
                Use the{" "}
                <Link
                  href="/pricing/self-hosted/portal"
                  className="font-semibold text-orange-400 underline hover:text-orange-300 transition-colors"
                >
                  customer portal
                </Link>{" "}
                to email yourself a fresh copy any time.
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs sm:text-sm text-zinc-500">
          Prefer managed hosting?{" "}
          <Link
            href="/pricing"
            className="text-zinc-400 underline hover:text-orange-400 transition-colors"
          >
            Entivia Cloud from {process.env.NEXT_PUBLIC_PRO_PRICE_DISPLAY ?? "₦40,000/month"}
          </Link>
          .
        </p>
      </main>

      <Footer />
    </div>
  );
}
