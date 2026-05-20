"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getPublicRedocUrl } from "@/lib/docs/api-url";
import { appHref, marketingHref } from "@/lib/site-urls";
import { DocsThemeToggle } from "./docs-theme-toggle";

type Props = {
  mobileOpen: boolean;
  onToggleMobile: () => void;
};

export function DocsHeader({ mobileOpen, onToggleMobile }: Props) {
  const redocUrl = getPublicRedocUrl();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="flex h-14 min-w-0 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleMobile}
            className="-ml-1 shrink-0 rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link
            href={marketingHref("/")}
            className="shrink-0 font-black tracking-tighter text-zinc-900 uppercase italic dark:text-white"
          >
            Entivia
          </Link>
          <span className="hidden shrink-0 text-zinc-300 sm:inline dark:text-zinc-600">
            /
          </span>
          <Link
            href="/docs"
            className="truncate text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Docs
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-sm sm:gap-3">
          <DocsThemeToggle />
          <a
            href={redocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 md:inline"
          >
            API (ReDoc)
          </a>
          <Link
            href={appHref("/dashboard/playground")}
            className="hidden text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 md:inline"
          >
            Playground
          </Link>
          <Link
            href={appHref("/auth/login")}
            className="rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white hover:bg-zinc-700 sm:px-4 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}
