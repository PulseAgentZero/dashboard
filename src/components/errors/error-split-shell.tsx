import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BladeFan } from "../../../public/icon/bladeFan";
import { appHref } from "@/lib/site-urls";

export type ErrorSplitVariant = "404" | "500";

const VARIANT_STYLES: Record<
  ErrorSplitVariant,
  {
    bgClass: string;
    tag: string;
    accent: string;
    primaryBtn: string;
  }
> = {
  "404": {
    bgClass: "bg-gradient-to-b from-zinc-900 to-black",
    tag: "Lost signal",
    accent: "text-orange-500",
    primaryBtn: "bg-orange-600 hover:bg-orange-700 shadow-xs",
  },
  "500": {
    bgClass: "bg-gradient-to-b from-zinc-950 to-zinc-900",
    tag: "Pipeline interrupted",
    accent: "text-orange-500",
    primaryBtn: "bg-orange-600 hover:bg-orange-700 shadow-xs",
  },
};

type Props = {
  variant: ErrorSplitVariant;
  headline: string;
  description: string;
  children: React.ReactNode;
  digest?: string | null;
};

export function ErrorSplitShell({
  variant,
  headline,
  description,
  children,
  digest,
}: Props) {
  const v = VARIANT_STYLES[variant];
  const code = variant;

  return (
    <>
      <style>{`
        .error-fan-spin {
          animation: errorFanSpin 20s linear infinite;
        }
        @keyframes errorFanSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .error-fan-spin { animation: none !important; }
        }
      `}</style>

      <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row antialiased">
        {/* Visual panel */}
        <div className={`relative flex min-h-[28vh] flex-1 items-center justify-center overflow-hidden lg:min-h-screen lg:max-w-[50%] ${v.bgClass}`}>
  <div className="relative z-10 flex flex-col items-center px-6 py-8 text-center">
    <p className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">
      Status {code}
    </p>

    <div className="relative flex items-center justify-center text-9xl font-black tracking-tighter text-white select-none sm:text-[11rem]">
      <span>{code[0]}</span>
      <span className="relative mx-1.5 inline-flex h-[1em] w-[0.62em] items-center justify-center">
        <span className="error-fan-spin absolute inset-0 flex items-center justify-center">
          <BladeFan color="#f97316" size={72} strokeWidth={5} />
        </span>
      </span>
      <span>{code[2]}</span>
    </div>

    <p className={`mt-6 text-sm font-bold tracking-widest uppercase ${v.accent}`}>
      {v.tag}
    </p>
  </div>
</div>

        {/* Content panel */}
        <div className="flex w-full flex-1 items-center justify-center p-8 sm:p-12 lg:max-w-[50%] lg:p-16">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-orange-600 border border-orange-100/50">
                  {variant === "404" ? "Not found" : "Server log failure"}
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {headline}
              </h1>
              <p className="text-sm leading-relaxed text-slate-500">{description}</p>
              
              {digest && (
                <div className="pt-1">
                  <p className="inline-flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Trace ID</span>
                    <span className="font-mono text-slate-600 select-all">{digest}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {children}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-xs font-medium text-slate-500">
              <Link href="/docs" className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors">
                Documentation
                <ArrowRight size={12} className="text-slate-400" />
              </Link>
              <span aria-hidden className="text-slate-200">·</span>
              <Link href={appHref("/auth/login")} className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors">
                Sign in
                <ArrowRight size={12} className="text-slate-400" />
              </Link>
              {/* <span aria-hidden className="text-slate-200">·</span>
              <a href="mailto:support@entivia.online" className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors">
                Support desk
                <ArrowRight size={12} className="text-slate-400" />
              </a> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function errorPrimaryButtonClass(variant: ErrorSplitVariant): string {
  return `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer ${VARIANT_STYLES[variant].primaryBtn}`;
}

export function errorSecondaryButtonClass(): string {
  return "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 cursor-pointer";
}