"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useDocHeadings } from "@/hooks/docs/use-doc-headings";

type Props = {
  containerId?: string;
  variant?: "sidebar" | "mobile";
};

function useActiveHeading(headings: { id: string }[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return activeId;
}

function TocLinks({
  headings,
  activeId,
  onNavigate,
}: {
  headings: ReturnType<typeof useDocHeadings>;
  activeId: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="space-y-1.5 border-l border-zinc-200 dark:border-zinc-700">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={onNavigate}
            className={`block border-l-2 py-0.5 text-[13px] leading-snug transition-colors ${
              h.level === 3 ? "pl-5" : "pl-3"
            } ${
              activeId === h.id
                ? "border-orange-600 font-medium text-orange-700 dark:border-orange-400 dark:text-orange-300"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200"
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function DocsToc({
  containerId = "docs-article",
  variant = "sidebar",
}: Props) {
  const headings = useDocHeadings(containerId);
  const activeId = useActiveHeading(headings);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (headings.length === 0) return null;

  if (variant === "mobile") {
    return (
      <nav className="xl:hidden" aria-label="On this page">
        <details
          open={mobileOpen}
          onToggle={(e) => setMobileOpen((e.target as HTMLDetailsElement).open)}
          className="group rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-zinc-800 marker:content-none dark:text-zinc-200 [&::-webkit-details-marker]:hidden">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              On this page
            </span>
            <ChevronDown
              size={16}
              className="shrink-0 text-zinc-400 transition-transform group-open:rotate-180 dark:text-zinc-500"
            />
          </summary>
          <div className="max-h-[40vh] overflow-y-auto overscroll-contain border-t border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <TocLinks
              headings={headings}
              activeId={activeId}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </details>
      </nav>
    );
  }

  return (
    <nav className="hidden xl:block" aria-label="On this page">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        On this page
      </p>
      <TocLinks headings={headings} activeId={activeId} />
    </nav>
  );
}
