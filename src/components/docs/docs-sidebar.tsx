"use client";

import Link from "next/link";
import { DOCS_NAV } from "@/lib/docs/navigation";
import { useDocHref, useIsDocActive } from "@/hooks/docs/use-doc-href";

type Props = {
  onNavigate?: () => void;
};

function DocNavLink({
  slug,
  title,
  onNavigate,
}: {
  slug: string;
  title: string;
  onNavigate?: () => void;
}) {
  const href = useDocHref(slug);
  const active = useIsDocActive(slug);

  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className={`block rounded-md px-3 py-1.5 text-[13px] transition-colors ${
          active
            ? "bg-orange-50 font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
            : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        }`}
      >
        {title}
      </Link>
    </li>
  );
}

export function DocsSidebar({ onNavigate }: Props) {
  return (
    <nav className="space-y-6 py-4 sm:space-y-8 sm:py-6">
      {DOCS_NAV.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <DocNavLink
                key={item.slug}
                slug={item.slug}
                title={item.title}
                onNavigate={onNavigate}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

