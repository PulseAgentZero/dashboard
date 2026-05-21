import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function FinalCTA() {
  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aner",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zion",
  ];

  return (
    <section
      data-navbar-theme="dark"
      className="relative w-full bg-[var(--mk-bg)] py-32 overflow-hidden border-t border-[var(--mk-border)]"
    >
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20 pointer-events-none">
        {[...Array(72)].map((_, i) => (
          <div key={i} className="border-[0.5px] border-[var(--mk-border)]" />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-10 bg-[var(--mk-surface)]/80 rounded shadow-inner" />
        <div className="absolute top-24 left-4 w-48 h-12 bg-[var(--mk-surface)]/60 rounded" />
        <div className="absolute top-40 left-20 w-40 h-8 bg-[var(--mk-surface)]/40 rounded" />
        <div className="absolute top-12 right-8 w-24 h-16 bg-[var(--mk-surface)]/80 rounded" />
        <div className="absolute top-32 right-12 w-52 h-10 bg-[var(--mk-surface)]/60 rounded" />
        <div className="absolute top-48 right-4 w-36 h-12 bg-[var(--mk-surface)]/40 rounded" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-6 flex flex-col items-center text-center">
        <div className="flex -space-x-3 mb-10">
          {avatars.map((src, i) => (
            <div key={i} className="relative w-10 h-10">
              <Image
                src={src}
                alt="Operational Team member"
                width={40}
                height={40}
                className="rounded-full border-2 border-[var(--mk-bg)] bg-zinc-800 object-cover"
                unoptimized
              />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-[var(--mk-bg)] bg-[var(--mk-surface)] flex items-center justify-center text-[10px] text-[var(--mk-text-faint)] font-bold z-10">
            +50
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--mk-text)] tracking-tight mb-6">
          <span className="text-[var(--mk-text-faint)] italic font-mono text-xl sm:text-2xl mr-2">
            /
          </span>
          Start deciding from your data today.
        </h2>

        <p className="text-lg sm:text-xl md:text-2xl text-[var(--mk-text-muted)] font-medium leading-tight mb-12 max-w-2xl">
          Connect in minutes. Score risk automatically. Get answers backed by
          your data—not made up.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            href="/auth/signup"
            className="flex items-center gap-3 bg-[var(--mk-accent)] hover:bg-[var(--mk-accent-hover)] px-6 py-3 rounded-full font-mono text-sm transition-all shadow-lg"
            style={{ boxShadow: "0 4px 24px var(--mk-accent-ring)" }}
          >
            <span className="text-white font-bold tracking-tighter">
              Get started with Entivia
            </span>
          </Link>
          <Link
            href="/docs"
            className="px-8 py-3 rounded-full border border-[var(--mk-border)] bg-[var(--mk-surface)] text-[var(--mk-text-muted)] hover:text-[var(--mk-text)] hover:bg-[var(--mk-surface-2)] transition-all font-medium"
          >
            Read the docs
          </Link>
        </div>

        <p className="text-[10px] text-[var(--mk-text-faint)] font-mono tracking-[0.3em] uppercase">
          Open Source Core • MIT Licensed • Self-Hostable
        </p>
      </div>
    </section>
  );
}
