import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FileQuestion } from "lucide-react";
import { appHref, marketingHref } from "@/lib/site-urls";

export const metadata: Metadata = {
  title: "Page not found · Entivia Docs",
  description: "The documentation page you're looking for doesn't exist.",
};

export default function DocsNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white dark:bg-indigo-600">
          <FileQuestion size={22} />
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400">
          404 · Docs not found
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          That doc doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          The link may be out of date, or the page was renamed. Use the sidebar to browse
          topics, or return to the documentation home.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Documentation home
            <ArrowRight size={12} />
          </Link>
          <Link
            href={marketingHref("/")}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Entivia site
          </Link>
          <Link
            href={appHref("/auth/login")}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
