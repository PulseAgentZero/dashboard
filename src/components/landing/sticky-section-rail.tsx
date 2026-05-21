"use client";

import { useEffect, useState } from "react";

export type SectionRailItem = {
  id: string;
  label: string;
};

export function StickySectionRail({ sections }: { sections: readonly SectionRailItem[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <aside className="hidden lg:block w-44 shrink-0">
      <nav className="sticky top-28 space-y-1">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
          On this page
        </p>
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={[
              "block rounded-lg px-3 py-2 text-sm transition-colors",
              active === id
                ? "bg-[var(--mk-accent-soft)] font-medium text-[var(--mk-accent)]"
                : "text-[var(--mk-text-muted)] hover:text-[var(--mk-text)]",
            ].join(" ")}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
