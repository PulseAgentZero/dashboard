"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV, getDocHref } from "@/lib/docs/navigation";

type Props = {
  onNavigate?: () => void;
};

export function DocsSidebar({ onNavigate }: Props) {
  const pathname = usePathname();

  function isActive(slug: string) {
    const href = getDocHref(slug);
    if (href === "/docs") return pathname === "/docs";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav className="space-y-6 py-4 sm:space-y-8 sm:py-6">
      {DOCS_NAV.map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const href = getDocHref(item.slug);
              const active = isActive(item.slug);
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`block rounded-md px-3 py-1.5 text-[13px] transition-colors ${
                      active
                        ? "bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
