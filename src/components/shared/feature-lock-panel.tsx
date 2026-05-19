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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-16 text-center shadow-sm">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-100 ring-1 ring-indigo-200">
        <Lock size={26} className="text-indigo-600" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={upgradeHref}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          {upgradeLabel}
          <ArrowRight size={14} />
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
