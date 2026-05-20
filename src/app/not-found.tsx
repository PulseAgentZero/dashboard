import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Compass, Home } from "lucide-react";
import { BladeFan } from "../../public/icon/bladeFan";
import { appHref, marketingHref } from "@/lib/site-urls";

export const metadata: Metadata = {
  title: "Page not found · Entivia",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(40rem 28rem at 80% -10%, rgba(255, 140, 0, 0.18), transparent 60%), radial-gradient(36rem 24rem at -10% 90%, rgba(255, 99, 132, 0.14), transparent 60%)",
        }}
      />

      <div className="mx-auto w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-600 text-white shadow-md shadow-orange-600/25 ring-1 ring-orange-700/10">
          <BladeFan color="white" size={28} />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange-600">
          404 · Not found
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
          The page may have moved, or the link you followed is out of date. Try one of the
          shortcuts below.
        </p>

        <div className="mt-7 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
          <Link
            href={marketingHref("/")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-600/20 transition-colors hover:bg-orange-700"
          >
            <Home size={15} />
            Back to home
          </Link>
          <Link
            href={appHref("/dashboard")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Compass size={15} />
            Open dashboard
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
          <Link
            href="/docs"
            className="inline-flex items-center gap-1 hover:text-slate-800"
          >
            Documentation
            <ArrowRight size={11} />
          </Link>
          <span aria-hidden className="text-slate-300">
            ·
          </span>
          <Link
            href={appHref("/auth/login")}
            className="inline-flex items-center gap-1 hover:text-slate-800"
          >
            Sign in
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
