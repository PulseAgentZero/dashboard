"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  RefreshCcw,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import {
  PORTAL_EMAIL_STORAGE_KEY,
  PORTAL_TOKEN_STORAGE_KEY,
  clearPortalSession,
  usePortalLicenses,
  useRequestPortalLink,
  useResendLicense,
} from "@/hooks/billing/use-billing";

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

  const callbackUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/pricing/self-hosted/portal/callback`;
  }, []);

  const { mutate: requestLink, isPending: sendingLink } = useRequestPortalLink();
  const { data: licensesData, isLoading: loadingLicenses, error: licensesError, refetch } =
    usePortalLicenses(portalToken);
  const { mutate: resendLicense, isPending: resending, variables: resendingJti } =
    useResendLicense(portalToken);

  function handleRequestLink(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    requestLink(
      { email: trimmed, callback_url: callbackUrl },
      {
        onSuccess: () => setLinkSent(true),
      },
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

  // ── Unauthenticated: request-magic-link form ─────────────────────────────
  if (!portalToken) {
    return (
      <div className="min-h-screen bg-black text-white antialiased">
        <Navbar />
        <main className="px-4 pt-24 pb-16 md:pt-28 md:pb-20">
          <div className="mx-auto max-w-lg">
            <div className="mb-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 sm:text-xs">
                Self-hosted license portal
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
                Retrieve your license keys
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm sm:text-base text-zinc-400 leading-relaxed">
                Enter the email you used at checkout. We&apos;ll send a one-time
                sign-in link — no account or password required.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-orange-950/5">
              {linkSent ? (
                <div className="text-center">
                  <CheckCircle2
                    size={36}
                    className="mx-auto text-emerald-400"
                    strokeWidth={1.5}
                  />
                  <h2 className="mt-4 text-base sm:text-lg font-semibold text-white">
                    Check your inbox
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    If a purchase exists for <strong className="text-zinc-200">{email}</strong>,
                    you&apos;ll receive a sign-in link within a minute. The link
                    expires in 15 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setLinkSent(false);
                      setEmail("");
                    }}
                    className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    Use a different email
                    <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestLink} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-400">
                      Email used at checkout
                    </label>
                    <input
                      type="email"
                      required
                      autoFocus
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      placeholder="admin@yourcompany.com"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingLink || !email.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-3 px-4 text-sm font-bold text-white shadow-lg shadow-orange-600/10 hover:bg-orange-500 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
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

            <p className="mt-6 text-center text-xs sm:text-sm text-zinc-500">
              Need to buy a license first?{" "}
              <Link
                href="/pricing/self-hosted"
                className="font-semibold text-orange-400 underline hover:text-orange-300 transition-colors"
              >
                See self-hosted pricing
              </Link>
              .
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Authenticated: list of license keys ──────────────────────────────────
  const licenses = licensesData?.licenses ?? [];

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Navbar />
      <main className="px-4 pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 sm:text-xs">
                License portal
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Your license keys
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                Signed in as{" "}
                <span className="font-semibold text-zinc-200">
                  {sessionEmail ?? licensesData?.email ?? ""}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={loadingLicenses}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800/60 transition-colors disabled:opacity-40 disabled:pointer-events-none"
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
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800/60 transition-colors"
              >
                <LogOut size={12} />
                Sign out
              </button>
            </div>
          </div>

          {loadingLicenses && (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 px-5 py-8 text-center text-sm text-zinc-400">
              <Loader2
                size={20}
                className="mx-auto mb-3 animate-spin text-orange-500"
              />
              Loading your licenses…
            </div>
          )}

          {!loadingLicenses && licenses.length === 0 && (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 px-5 py-12 text-center">
              <ShieldAlert
                size={28}
                strokeWidth={1.5}
                className="mx-auto text-zinc-500"
              />
              <p className="mt-4 text-sm font-semibold text-zinc-300">
                No licenses found for this email
              </p>
              <p className="mt-2 text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                Either no purchase has been completed yet, or it was made with a
                different email. You can{" "}
                <Link
                  href="/pricing/self-hosted"
                  className="font-semibold text-orange-400 underline hover:text-orange-300 transition-colors"
                >
                  buy a license
                </Link>{" "}
                or sign in with a different address.
              </p>
            </div>
          )}

          {!loadingLicenses && licenses.length > 0 && (
            <div className="space-y-3">
              {licenses.map((row) => {
                const revoked = row.revoked_at != null;
                return (
                  <div
                    key={row.jti}
                    className="rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <KeyRound size={14} className="text-orange-500 shrink-0" />
                          <p className="text-sm font-semibold text-white">
                            {row.plan.charAt(0).toUpperCase() + row.plan.slice(1)} self-hosted
                          </p>
                          {revoked && (
                            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300">
                              Revoked
                            </span>
                          )}
                          {!revoked && (
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400">
                          <code className="font-mono text-zinc-500 break-all">
                            {row.license_key_preview}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              void navigator.clipboard.writeText(
                                row.license_key_preview,
                              );
                              toast.success("Key suffix copied");
                            }}
                            className="opacity-60 hover:opacity-100 transition-opacity"
                            title="Copy key suffix"
                          >
                            <Copy size={11} />
                          </button>
                        </div>
                        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px] sm:text-xs">
                          <div>
                            <dt className="text-zinc-500">Issued</dt>
                            <dd className="text-zinc-300">
                              {formatDate(row.issued_at)}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-zinc-500">Expires</dt>
                            <dd className="text-zinc-300">
                              {row.expires_at ? formatDate(row.expires_at) : "Never"}
                            </dd>
                          </div>
                          {row.seat_limit != null && (
                            <div>
                              <dt className="text-zinc-500">Seats</dt>
                              <dd className="text-zinc-300">{row.seat_limit}</dd>
                            </div>
                          )}
                          <div className="col-span-2 truncate">
                            <dt className="text-zinc-500">Payment ref</dt>
                            <dd className="text-zinc-400 truncate font-mono text-[10px] sm:text-[11px]">
                              {row.payment_reference}
                            </dd>
                          </div>
                        </dl>
                      </div>
                      <div className="shrink-0">
                        <button
                          type="button"
                          disabled={
                            revoked ||
                            (resending && resendingJti === row.jti)
                          }
                          onClick={() => resendLicense(row.jti)}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800/60 transition-colors disabled:opacity-40 disabled:pointer-events-none sm:w-auto"
                        >
                          {resending && resendingJti === row.jti ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Mail size={12} />
                          )}
                          Email me the key
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              <p className="px-1 pt-2 text-[11px] sm:text-xs text-zinc-500">
                We only show the last 8 characters of each key here. To get the
                full key, click <strong className="text-zinc-300">Email me the key</strong>{" "}
                — for security the key itself is only ever delivered by email.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
