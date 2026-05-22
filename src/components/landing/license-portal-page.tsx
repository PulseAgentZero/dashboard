"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  HelpCircle,
  KeyRound,
  LayoutGrid,
  LifeBuoy,
  Loader2,
  LogOut,
  Mail,
  RefreshCcw,
  Server,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import Navbar from "@/components/landing/navbar";
import {
  PORTAL_EMAIL_STORAGE_KEY,
  PORTAL_TOKEN_STORAGE_KEY,
  clearPortalSession,
  usePortalLicenses,
  useRequestPortalLink,
  useResendLicense,
} from "@/hooks/billing/use-billing";

type PortalLicense = {
  jti: string;
  plan: string;
  features: string[];
  seat_limit: number | null;
  expires_at: string | null;
  revoked_at: string | null;
  issued_at: string;
  payment_reference: string;
  license_key_preview: string;
};

type PortalView = "licenses" | "help";

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(undefined, { dateStyle: "medium" });
  } catch {
    return value;
  }
}

function readPortalToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PORTAL_TOKEN_STORAGE_KEY);
}

function readPortalEmail(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PORTAL_EMAIL_STORAGE_KEY);
}

export function LicensePortalPage() {
  const [portalToken] = useState(readPortalToken);
  const [sessionEmail] = useState(readPortalEmail);
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [view, setView] = useState<PortalView>("licenses");

  const callbackUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/pricing/self-hosted/portal/callback`;
  }, []);

  const { mutate: requestLink, isPending: sendingLink } = useRequestPortalLink();
  const {
    data: licensesData,
    isLoading: loadingLicenses,
    error: licensesError,
    refetch,
  } = usePortalLicenses(portalToken);
  const {
    mutate: resendLicense,
    isPending: resending,
    variables: resendingJti,
  } = useResendLicense(portalToken);

  function handleRequestLink(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    requestLink(
      { email: trimmed, callback_url: callbackUrl },
      { onSuccess: () => setLinkSent(true) },
    );
  }

  const handleSessionExpired = useCallback(() => {
    clearPortalSession();
    toast.error("Your portal session expired. Request a new sign-in link.");
    window.location.href = "/pricing/self-hosted/portal";
  }, []);

  function handleSignOut() {
    clearPortalSession();
    toast.success("Signed out");
    window.location.href = "/pricing/self-hosted/portal";
  }

  useEffect(() => {
    if (licensesError instanceof ApiError && licensesError.status === 401) {
      handleSessionExpired();
    }
  }, [licensesError, handleSessionExpired]);

  if (!portalToken) {
    return (
      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <Navbar />
        <main className="px-4 pt-24 pb-16 md:pt-28 md:pb-20">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600 sm:text-xs">
                Self-hosted license portal
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Sign in to your portal
              </h1>
              <p className="mx-auto mt-4 max-w-sm text-sm text-slate-500 leading-relaxed">
                Enter the email you used at checkout. We&apos;ll send a one-time
                sign-in link — no account or password required.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              {linkSent ? (
                <div className="text-center">
                  <CheckCircle2
                    size={36}
                    className="mx-auto text-emerald-500"
                    strokeWidth={1.5}
                  />
                  <h2 className="mt-4 text-base sm:text-lg font-semibold text-slate-900">
                    Check your inbox
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
                    If a purchase exists for{" "}
                    <strong className="text-slate-900">{email}</strong>, you&apos;ll
                    receive a sign-in link within a minute. The link expires in 15
                    minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkSent(false);
                      setEmail("");
                    }}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 hover:text-orange-500 transition-colors"
                  >
                    Use a different email
                    <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestLink} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Email used at checkout
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      placeholder="admin@yourcompany.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingLink || !email.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {sendingLink ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Mail size={14} />
                    )}
                    Email me a sign-in link
                  </button>
                </form>
              )}
            </div>

            <p className="mt-6 text-center text-xs sm:text-sm text-slate-500">
              Need to buy a license first?{" "}
              <Link
                href="/pricing/self-hosted"
                className="font-semibold text-orange-600 underline hover:text-orange-500 transition-colors"
              >
                See self-hosted pricing
              </Link>
              .
            </p>
          </div>
        </main>
      </div>
    );
  }

  const licenses: PortalLicense[] = licensesData?.licenses ?? [];
  const activeLicenses = licenses.filter((l) => !l.revoked_at);
  const revokedLicenses = licenses.filter((l) => l.revoked_at);
  const portalEmail = sessionEmail ?? licensesData?.email ?? "";
  const initial = portalEmail.charAt(0).toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-[1320px] flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="px-5 py-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-orange-600 text-white">
                <ShieldCheck size={16} />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900">Entivia</p>
                <p className="text-[10px] font-medium text-slate-500">License portal</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-3">
            <SidebarItem
              icon={LayoutGrid}
              label="Licenses"
              active={view === "licenses"}
              onClick={() => setView("licenses")}
              badge={activeLicenses.length || undefined}
            />
            <SidebarItem
              icon={LifeBuoy}
              label="Help & docs"
              active={view === "help"}
              onClick={() => setView("help")}
            />

            <div className="mt-6 px-3 pt-4 border-t border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick links
              </p>
              <ul className="mt-2 space-y-0.5">
                <li>
                  <Link
                    href="/pricing/self-hosted"
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Buy another license
                    <ArrowRight size={11} />
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/license-activation"
                    className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    Activation docs
                    <ArrowRight size={11} />
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="border-t border-slate-100 p-3">
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  {portalEmail}
                </p>
                <p className="text-[10px] text-slate-500">Portal session</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3 min-w-0">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-700 lg:hidden">
                <ShieldCheck size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {view === "licenses" ? "Licenses" : "Help"}
                </p>
                <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                  {view === "licenses" ? "Your license keys" : "Help & docs"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={loadingLicenses}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {loadingLicenses ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCcw size={12} />
                )}
                Refresh
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors lg:hidden"
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          </header>

          <div className="p-5 sm:p-8 space-y-6">
            {view === "licenses" && (
              <>
                {/* Stat cards */}
                <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <StatCard
                    icon={KeyRound}
                    label="Active keys"
                    value={String(activeLicenses.length)}
                    accent="emerald"
                  />
                  <StatCard
                    icon={Server}
                    label="Total purchases"
                    value={String(licenses.length)}
                    accent="slate"
                  />
                  <StatCard
                    icon={ShieldAlert}
                    label="Revoked"
                    value={String(revokedLicenses.length)}
                    accent={revokedLicenses.length > 0 ? "rose" : "slate"}
                  />
                </section>

                {loadingLicenses && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                    <Loader2
                      size={20}
                      className="mx-auto mb-3 animate-spin text-orange-500"
                    />
                    Loading your licenses…
                  </div>
                )}

                {!loadingLicenses && licenses.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
                    <ShieldAlert
                      size={28}
                      strokeWidth={1.5}
                      className="mx-auto text-slate-400"
                    />
                    <p className="mt-4 text-sm font-semibold text-slate-900">
                      No licenses found for this email
                    </p>
                    <p className="mt-2 mx-auto max-w-md text-xs sm:text-sm text-slate-500">
                      Either no purchase has been completed yet, or it was made
                      with a different email. You can{" "}
                      <Link
                        href="/pricing/self-hosted"
                        className="font-semibold text-orange-600 underline hover:text-orange-500"
                      >
                        buy a license
                      </Link>{" "}
                      or sign in with a different address.
                    </p>
                  </div>
                )}

                {!loadingLicenses && licenses.length > 0 && (
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                      <h2 className="text-sm font-semibold text-slate-900">
                        License keys
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Last 8 chars shown — email yourself the full key
                      </p>
                    </div>
                    <ul className="divide-y divide-slate-100">
                      {licenses.map((row) => (
                        <LicenseRow
                          key={row.jti}
                          row={row}
                          resending={resending && resendingJti === row.jti}
                          onResend={() => resendLicense(row.jti)}
                        />
                      ))}
                    </ul>
                  </section>
                )}
              </>
            )}

            {view === "help" && <HelpPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-orange-50 text-orange-700"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <Icon size={14} />
        {label}
      </span>
      {badge != null && (
        <span
          className={`grid h-5 min-w-[20px] place-items-center rounded-full px-1.5 text-[10px] font-bold ${
            active ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: "emerald" | "rose" | "slate";
}) {
  const tone =
    accent === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
      : accent === "rose"
      ? "bg-rose-50 text-rose-700 ring-rose-100"
      : "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${tone}`}>
          <Icon size={15} />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function LicenseRow({
  row,
  resending,
  onResend,
}: {
  row: PortalLicense;
  resending: boolean;
  onResend: () => void;
}) {
  const revoked = row.revoked_at != null;
  return (
    <li className="px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-orange-50 text-orange-700">
              <KeyRound size={13} />
            </span>
            <p className="text-sm font-semibold text-slate-900">
              {row.plan.charAt(0).toUpperCase() + row.plan.slice(1)} self-hosted
            </p>
            {revoked ? (
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-700 ring-1 ring-rose-100">
                Revoked
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100">
                Active
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px] sm:text-xs">
            <code className="rounded-md bg-slate-100 px-2 py-1 font-mono text-slate-700 break-all">
              {row.license_key_preview}
            </code>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(row.license_key_preview);
                toast.success("Key suffix copied");
              }}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Copy key suffix"
            >
              <Copy size={11} />
            </button>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] sm:text-xs sm:grid-cols-4">
            <div>
              <dt className="text-slate-500">Issued</dt>
              <dd className="font-medium text-slate-800">{formatDate(row.issued_at)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Expires</dt>
              <dd className="font-medium text-slate-800">
                {row.expires_at ? formatDate(row.expires_at) : "Never"}
              </dd>
            </div>
            {row.seat_limit != null && (
              <div>
                <dt className="text-slate-500">Seats</dt>
                <dd className="font-medium text-slate-800">{row.seat_limit}</dd>
              </div>
            )}
            <div className="col-span-2 min-w-0 truncate sm:col-span-1">
              <dt className="text-slate-500">Payment ref</dt>
              <dd className="truncate font-mono text-[10px] text-slate-600 sm:text-[11px]">
                {row.payment_reference}
              </dd>
            </div>
          </dl>

          {row.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {row.features.map((f) => (
                <span
                  key={f}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0">
          <button
            type="button"
            disabled={revoked || resending}
            onClick={onResend}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:pointer-events-none sm:w-auto"
          >
            {resending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Mail size={12} />
            )}
            Email me the key
          </button>
        </div>
      </div>
    </li>
  );
}

function HelpPanel() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-orange-700">
            <HelpCircle size={16} />
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-900">
              How activation works
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              In your self-hosted Entivia instance, go to{" "}
              <strong>Settings → License</strong> and paste your{" "}
              <code className="font-mono text-slate-800">plc_…</code> key. The instance
              contacts the Entivia license server to validate the key, then caches it
              locally so you stay running even if the license server is briefly
              unreachable.
            </p>
            <Link
              href="/docs/license-activation"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-500"
            >
              Read the activation docs
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Lost your key?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Click <strong>Email me the key</strong> on any active license to receive
            the full <code className="font-mono">plc_…</code> key by email again.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Need help?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Email{" "}
            <a
              href="mailto:support@entivia.online"
              className="font-semibold text-orange-600 hover:text-orange-500"
            >
              support@entivia.online
            </a>{" "}
            with your payment reference.
          </p>
        </div>
      </div>
    </div>
  );
}
