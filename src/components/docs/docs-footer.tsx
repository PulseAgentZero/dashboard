import Link from "next/link";

export function DocsFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 text-center text-sm text-zinc-500 sm:px-6 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} Pulse Intelligence Engine</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-wider">
          <Link
            href="/docs"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Documentation
          </Link>
          <Link
            href="/pricing"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Pricing
          </Link>
          <Link
            href="/trust"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Trust Center
          </Link>
          <Link
            href="/security"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Security
          </Link>
          <Link
            href="/privacy"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
