"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      data-navbar-theme="dark"
      className="relative overflow-hidden bg-zinc-950 px-4 py-20 sm:py-28 md:px-10 border-t border-zinc-900"
    >
      {/* Premium subtle background accent glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[350px] w-[500px] rounded-full bg-orange-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="inline-block text-[10px] font-bold font-mono uppercase tracking-widest text-orange-400 bg-orange-500/5 border border-orange-500/10 px-2.5 py-1 rounded">
          Instant Deployment
        </span>
        
        <h2 className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight text-white">
          Your telemetry data is ready.
          <br />
          <span className="text-zinc-500">Are you?</span>
        </h2>
        
        <p className="mt-6 text-sm sm:text-base leading-relaxed text-zinc-400 max-w-xl mx-auto font-medium">
          Connect your existing database cluster, describe your workflows, and Entivia starts sorting, scoring, and outputting actionable metrics instantly.
        </p>

        {/* Action Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto sm:max-w-none">
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-zinc-100 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-sm hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            Start free instant
            <ArrowRight size={14} />
          </Link>
          <Link
            href="/docs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/40 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-300 hover:border-zinc-700 hover:text-white transition-all backdrop-blur-sm"
          >
            <BookOpen size={14} className="text-zinc-500" />
            Read technical docs
          </Link>
        </div>

        {/* Feature Check-list Meta */}
        <p className="mt-8 font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
          Free tier forever <span className="text-zinc-800 mx-1.5">•</span> No credit card required <span className="text-zinc-800 mx-1.5">•</span> Open-Source MIT Ecosystem
        </p>
      </div>
    </section>
  );
}