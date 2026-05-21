"use client";

import { useState } from "react";
import { DocsHeader } from "./docs-header";
import { DocsSidebar } from "./docs-sidebar";
import { DocsFooter } from "./docs-footer";

export function DocsShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col overflow-x-hidden bg-white dark:bg-zinc-950">
      <DocsHeader
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((o) => !o)}
      />

      <div className="flex min-h-0 flex-1">
        {/* Left nav — fixed, scrolls independently */}
        <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-zinc-100 dark:border-zinc-800 lg:block xl:w-64">
          <DocsSidebar />
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close sidebar"
            />
            <aside className="fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-zinc-100 bg-white pt-14 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
              <DocsSidebar onNavigate={() => setMobileOpen(false)} />
            </aside>
          </>
        )}

        {/* Center — only this scrolls */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          {children}
          <DocsFooter />
        </main>
      </div>
    </div>
  );
}
