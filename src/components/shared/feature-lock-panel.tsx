"use client";

import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

type Props = {
  title: string;
  description: string;
  upgradeHref: string;
  upgradeLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function FeatureLockPanel({
  title,
  description,
  upgradeHref,
  upgradeLabel,
  secondaryHref,
  secondaryLabel,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white px-6 py-16 text-center shadow-xs">
      {/* Updated lock icon ring from Indigo to clean Slate & Amber/Orange */}
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 border border-orange-100 text-orange-600">
        <Lock size={20} />
      </div>
      
      <h2 className="mt-4 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
        {title}
      </h2>
      <p className="mt-1.5 max-w-md text-xs sm:text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      <div className="mt-6 flex flex-col w-full sm:w-auto sm:flex-row items-center justify-center gap-2.5 px-4 sm:px-0">
        {/* Main CTA button updated to branding Orange */}
        <Link
          href={upgradeHref}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-orange-700 transition-colors"
        >
          {upgradeLabel}
          <ArrowRight size={14} />
        </Link>
        
        {/* Secondary link matching page styling profiles */}
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}