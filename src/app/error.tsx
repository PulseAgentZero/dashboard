"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, ArrowRight, Home, RefreshCcw } from "lucide-react";
import { BladeFan } from "../../public/icon/bladeFan";
import { appHref, marketingHref } from "@/lib/site-urls";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalRouteError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Surface the error in the browser console so users can share it with support.
    console.error("[entivia] route error", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(40rem 28rem at 80% -10%, rgba(244, 63, 94, 0.16), transparent 60%), radial-gradient(36rem 24rem at -10% 90%, rgba(255, 140, 0, 0.14), transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/25 ring-1 ring-rose-700/10">
          <AlertOctagon size={28} />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-rose-600">
          500 · Something went wrong
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          We hit an unexpected error
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
          The page failed to load. Please try again — if the issue persists, reach out and we&apos;ll
          investigate quickly.
        </p>

        {error?.digest && (
          <p className="mx-auto mt-4 inline-flex max-w-xs items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600">
            <BladeFan size={12} color="#475569" />
            Error reference
            <span className="font-mono text-[10px] text-slate-500">{error.digest}</span>
          </p>
        )}

        <div className="mt-7 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-600/20 transition-colors hover:bg-orange-700"
          >
            <RefreshCcw size={15} />
            Try again
          </button>
          <Link
            href={marketingHref("/")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Home size={15} />
            Back to home
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
          <Link
            href={appHref("/dashboard")}
            className="inline-flex items-center gap-1 hover:text-slate-800"
          >
            Open dashboard
            <ArrowRight size={11} />
          </Link>
          <span aria-hidden className="text-slate-300">
            ·
          </span>
          <a
            href="mailto:support@entivia.online"
            className="inline-flex items-center gap-1 hover:text-slate-800"
          >
            Contact support
            <ArrowRight size={11} />
          </a>
        </div>
      </div>
    </main>
  );
}
