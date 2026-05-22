"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  KeyRound,
  Loader2,
  Lock,
  LucideIcon,
  Mail,
  Network,
  Server,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import {
  useInitializeSelfHostedCheckout,
  useVerifySelfHostedPayment,
} from "@/hooks/billing/use-billing";
import { isCloudDeployment, isSelfHostedDeployment } from "@/lib/deployment";
import { getMarketingUrl } from "@/lib/site-urls";

const FALLBACK_MARKETING_PURCHASE_URL = "https://entivia.online/pricing/self-hosted";

// The verify endpoint is anonymous and idempotent — we still de-dupe on the
// client so a curious refresh doesn't fire repeated requests.
const VERIFIED_REF_SESSION_KEY = "pulse_verified_license_ref";

type FeatureCategory = {
  title: string;
  icon: LucideIcon;
  items: { title: string; description: string }[];
};

const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    title: "Security & Compliance",
    icon: ShieldCheck,
    items: [
      {
        title: "SSO with OIDC and SAML",
        description: "Connect Okta, Azure AD, Google Workspace, or any standards-compliant IdP.",
      },
      {
        title: "LDAP / Active Directory sync",
        description: "Provision users automatically from your directory.",
      },
      {
        title: "Audit logs",
        description: "Every privileged action recorded with actor, target, and diff.",
      },
    ],
  },
  {
    title: "Operations",
    icon: TerminalSquare,
    items: [
      {
        title: "Log streaming",
        description: "Ship structured logs to HTTP, Syslog, or local files in real time.",
      },
      {
        title: "Bring your own LLM keys",
        description: "Use your own Anthropic, Groq, or self-hosted models — no proxying through us.",
      },
      {
        title: "Pro-equivalent limits",
        description: "Unlimited connections, API keys, webhooks, pipeline runs, and users.",
      },
    ],
  },
  {
    title: "Scale",
    icon: Zap,
    items: [
      {
        title: "Parallel pipelines",
        description: "Run multiple data pipelines concurrently across your worker fleet.",
      },
      {
        title: "Deploy anywhere",
        description: "Docker, Kubernetes, bare metal — your infrastructure, your rules.",
      },
      {
        title: "One-time license",
        description: "No recurring cloud fees. Pay once, run forever.",
      },
    ],
  },
];

const HOW_IT_WORKS = [
  {
    icon: CreditCard,
    title: "Pay securely",
    description: "Checkout via Paystack with your email — no Entivia account required.",
  },
  {
    icon: Mail,
    title: "Check your inbox",
    description: "Your signed license key is emailed to you within seconds of payment.",
  },
  {
    icon: KeyRound,
    title: "Activate",
    description: "Paste the key in Settings → License on your self-hosted Entivia instance.",
  },
];

export function PricingSelfHostedPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [email, setEmail] = useState("");
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [deliveryEmail, setDeliveryEmail] = useState<string | null>(null);

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
      // Already verified in this browser tab — assume success state.
      setPurchaseCompleted(true);
      return;
    }
    sessionStorage.setItem(VERIFIED_REF_SESSION_KEY, reference);
    verifyPayment(reference, {
      onSuccess: (data) => {
        setPurchaseCompleted(true);
        // The backend echoes the delivery email back in the success message — we
        // intentionally do NOT render the license key itself; it's email-only.
        const match = data.message?.match(/delivered to ([^\s]+)/i);
        if (match?.[1]) {
          setDeliveryEmail(match[1].replace(/[.,;]+$/, ""));
        }
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

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-900/80 px-4 pt-28 pb-16 md:pt-32 md:pb-20">
        {/* Decorative background */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(249,115,22,0.18)_0%,rgba(249,115,22,0)_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"
          aria-hidden
        />

        {cloud && (
          <div className="mx-auto mb-8 max-w-3xl">
            <div className="flex items-center justify-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-xs text-orange-200/90 backdrop-blur-sm">
              <Sparkles size={12} className="text-orange-400" />
              Looking for hosted Entivia Cloud?{" "}
              <Link
                href="/pricing"
                className="font-semibold text-orange-300 underline-offset-2 hover:underline"
              >
                View cloud pricing
              </Link>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-300 sm:text-xs">
            <Server size={11} />
            Self-hosted
          </div>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Run Entivia on
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-amber-300 bg-clip-text text-transparent">
              your own infrastructure
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base md:text-lg">
            One-time license. Deploy behind your firewall with SSO, LDAP sync,
            log streaming, parallel pipelines, and your own LLM keys — no recurring
            cloud bill, no data leaving your network.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              No Entivia account required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Pay with Paystack
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Key delivered by email
            </span>
          </div>
        </div>
      </section>

      <main className="px-4 pb-20">
        {/* ── VERIFY BANNER (during redirect-back from Paystack) ──────────── */}
        {verifying && (
          <div className="mx-auto -mt-8 mb-10 flex max-w-md items-center justify-center gap-2.5 rounded-xl border border-orange-500/20 bg-orange-500/5 px-5 py-3 text-xs text-orange-200 backdrop-blur-sm sm:text-sm">
            <Loader2 size={15} className="animate-spin text-orange-400" />
            Verifying your payment with Paystack…
          </div>
        )}

        {/* ── TWO-COLUMN: FEATURES + CHECKOUT ─────────────────────────────── */}
        <section className="mx-auto mt-6 grid max-w-6xl gap-8 lg:grid-cols-[1fr_minmax(380px,440px)] lg:gap-10">
          {/* Features */}
          <div className="space-y-6">
            <header>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Everything Pro, on your terms
              </h2>
              <p className="mt-2 text-sm text-zinc-400 sm:text-base">
                A single Pro-equivalent license unlocks every advanced feature.
                No tiers to choose between, no per-seat math.
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {FEATURE_CATEGORIES.map((category) => (
                <FeatureCard key={category.title} category={category} />
              ))}
            </div>
          </div>

          {/* Checkout / success card */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {purchaseCompleted ? (
              <SuccessCard deliveryEmail={deliveryEmail} reference={reference} />
            ) : (
              <CheckoutCard
                email={email}
                setEmail={setEmail}
                onSubmit={handlePurchase}
                pending={checkoutPending || verifying}
              />
            )}
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
        <section className="mx-auto mt-20 max-w-6xl">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 sm:text-xs">
              How it works
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              From checkout to running in under a minute
            </h2>
          </header>

          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((step, idx) => (
              <li
                key={step.title}
                className="relative rounded-2xl border border-zinc-900 bg-gradient-to-b from-zinc-950/80 to-black p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
                    <step.icon size={16} />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Step {idx + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── TRUST STRIP ─────────────────────────────────────────────────── */}
        <section className="mx-auto mt-16 grid max-w-6xl gap-3 sm:grid-cols-3">
          <TrustCard
            icon={Lock}
            title="Your data, your network"
            description="Entivia runs entirely behind your firewall. No telemetry, no phone-home of customer data."
          />
          <TrustCard
            icon={Network}
            title="Lost your key?"
            description={
              <>
                Use the{" "}
                <Link
                  href="/pricing/self-hosted/portal"
                  className="font-semibold text-orange-400 underline-offset-2 hover:underline"
                >
                  customer portal
                </Link>{" "}
                to re-email any key tied to your address.
              </>
            }
          />
          <TrustCard
            icon={Mail}
            title="Real human support"
            description={
              <>
                Reach us at{" "}
                <a
                  href="mailto:support@entivia.online"
                  className="font-semibold text-orange-400 underline-offset-2 hover:underline"
                >
                  support@entivia.online
                </a>
                . Pro customers get priority response.
              </>
            }
          />
        </section>

        {/* ── BOTTOM CTA ──────────────────────────────────────────────────── */}
        <p className="mx-auto mt-16 max-w-2xl text-center text-xs text-zinc-500 sm:text-sm">
          Prefer managed hosting?{" "}
          <Link
            href="/pricing"
            className="font-semibold text-zinc-300 underline-offset-2 hover:text-orange-400 hover:underline"
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

// ────────────────────────────────────────────────────────────────────────────
// Components
// ────────────────────────────────────────────────────────────────────────────

function FeatureCard({ category }: { category: FeatureCategory }) {
  const Icon = category.icon;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-gradient-to-b from-zinc-950/60 to-black/40 p-5 transition-colors hover:border-zinc-800">
      <div
        className="pointer-events-none absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20">
          <Icon size={14} />
        </span>
        <h3 className="text-sm font-bold text-white">{category.title}</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {category.items.map((item) => (
          <li key={item.title} className="text-xs leading-relaxed text-zinc-400 sm:text-[13px]">
            <span className="font-semibold text-zinc-200">{item.title}</span>
            <span className="text-zinc-500"> · {item.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckoutCard({
  email,
  setEmail,
  onSubmit,
  pending,
}: {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  pending: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-2xl shadow-orange-950/10 sm:p-7">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30">
          <KeyRound size={15} />
        </span>
        <div>
          <h3 className="text-base font-bold text-white">Buy your license</h3>
          <p className="text-xs text-zinc-500">One-time payment · key by email</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Delivery email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
              <Mail size={14} />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border border-zinc-800 bg-black/60 pl-9 pr-3.5 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="admin@yourcompany.com"
            />
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-500">
            We&apos;ll send your <code className="font-mono text-zinc-400">plc_…</code>{" "}
            license key here. You can re-request it any time via the customer portal.
          </p>
        </div>

        <button
          type="submit"
          disabled={pending || !email.trim()}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-orange-500 to-orange-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition-all hover:from-orange-400 hover:to-orange-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {pending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <>
              Continue to Paystack
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck size={11} className="text-zinc-600" />
          Secured by Paystack · 256-bit encrypted
        </div>
      </form>
    </div>
  );
}

function SuccessCard({
  deliveryEmail,
  reference,
}: {
  deliveryEmail: string | null;
  reference: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-black p-6 shadow-2xl shadow-emerald-950/20 sm:p-7">
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
          <CheckCircle2 size={18} strokeWidth={2.5} />
        </span>
        <div>
          <h3 className="text-base font-bold text-emerald-300">Payment confirmed</h3>
          <p className="text-xs text-emerald-400/70">License delivery in progress</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-emerald-500/20 bg-black/40 p-4">
        <div className="flex items-start gap-3">
          <Mail size={16} className="mt-0.5 shrink-0 text-emerald-400" />
          <div className="min-w-0 text-sm">
            <p className="font-semibold text-white">Check your inbox</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400 sm:text-[13px]">
              Your license key is being emailed to{" "}
              {deliveryEmail ? (
                <span className="font-semibold text-emerald-300 break-all">
                  {deliveryEmail}
                </span>
              ) : (
                <span className="text-emerald-300">the address you provided</span>
              )}
              . It usually arrives within a minute.
            </p>
          </div>
        </div>
      </div>

      <ol className="mt-5 space-y-3 text-xs sm:text-[13px]">
        <SuccessStep
          n={1}
          title="Open the email from Entivia"
          body="Subject: 'Your Entivia self-hosted license key'. Check spam if you don't see it."
        />
        <SuccessStep
          n={2}
          title="Copy your plc_… key"
          body="The full key is in the email body, ready to copy with one click."
        />
        <SuccessStep
          n={3}
          title="Activate in your Entivia instance"
          body="Sign in as admin, go to Settings → License, paste, and save."
        />
      </ol>

      <div className="mt-6 space-y-2 border-t border-emerald-500/10 pt-5 text-[11px] sm:text-xs">
        <p className="text-zinc-500">
          Didn&apos;t receive the email after 5 minutes?
        </p>
        <Link
          href="/pricing/self-hosted/portal"
          className="inline-flex items-center gap-1.5 font-semibold text-emerald-300 hover:text-emerald-200"
        >
          Open customer portal
          <ArrowRight size={11} />
        </Link>
        {reference && (
          <p className="pt-1 text-[10px] text-zinc-600">
            Reference:{" "}
            <code className="font-mono text-zinc-500">{reference}</code>
          </p>
        )}
      </div>
    </div>
  );
}

function SuccessStep({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold text-emerald-300">
        {n}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-zinc-200">{title}</p>
        <p className="text-zinc-500">{body}</p>
      </div>
    </li>
  );
}

function TrustCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-gradient-to-b from-zinc-950/60 to-black p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-900 text-orange-400 ring-1 ring-zinc-800">
          <Icon size={15} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 sm:text-[13px]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
