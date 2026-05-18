"use client";

import { useEffect, useState } from "react";
import { DocsHeader } from "./docs-header";
import { DocsSidebar } from "./docs-sidebar";
import { DocsFooter } from "./docs-footer";

type Props = {
  children: React.ReactNode;
};

export function DocsShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
      <DocsHeader
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((o) => !o)}
      />

      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:block xl:w-64">
          <div className="sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain">
            <DocsSidebar />
          </div>
        </aside>

        {mobileOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            />
            <aside className="fixed inset-y-0 left-0 z-40 w-[min(100vw-3rem,18rem)] overflow-y-auto overscroll-contain border-r border-zinc-200 bg-white pt-14 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
              <DocsSidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      <DocsFooter />
    </div>
  );
}
