import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BladeFan } from "../../../public/icon/bladeFan";
import { appHref, marketingHref } from "@/lib/site-urls";

export type ErrorSplitVariant = "404" | "500";

const VARIANT_STYLES: Record<
  ErrorSplitVariant,
  {
    gradient: string;
    blob1: string;
    blob2: string;
    blob3: string;
    tag: string;
    accent: string;
    primaryBtn: string;
  }
> = {
  "404": {
    gradient:
      "linear-gradient(-45deg, #e8390e, #f7620a, #ffcd43, #ff3366, #c9260c, #ff8c00)",
    blob1: "bg-[#ff1a4b]/45",
    blob2: "bg-[#c9260c]/55",
    blob3: "bg-[#ffaa00]/35",
    tag: "Lost signal",
    accent: "text-orange-100",
    primaryBtn: "bg-orange-600 hover:bg-orange-700 shadow-orange-600/25",
  },
  "500": {
    gradient:
      "linear-gradient(-45deg, #be123c, #e11d48, #fb7185, #f43f5e, #9f1239, #fda4af)",
    blob1: "bg-[#fb7185]/50",
    blob2: "bg-[#be123c]/55",
    blob3: "bg-[#fecdd3]/40",
    tag: "Pipeline interrupted",
    accent: "text-rose-100",
    primaryBtn: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/25",
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
        .error-split-gradient {
          background: ${v.gradient};
          background-size: 400% 400%;
          animation: errorShift 14s ease infinite;
        }
        @keyframes errorShift {
          0%   { background-position: 0% 50%; }
          25%  { background-position: 50% 0%; }
          50%  { background-position: 100% 50%; }
          75%  { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes errorBlob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(35px, -55px) scale(1.1); }
          66%       { transform: translate(-25px, 35px) scale(0.93); }
        }
        @keyframes errorBlob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(-45px, 28px) scale(1.08); }
          75%       { transform: translate(28px, -38px) scale(1.13); }
        }
        @keyframes errorBlob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(20px, 45px) scale(0.92); }
        }
        .error-blob-1 { animation: errorBlob1 18s ease-in-out infinite; }
        .error-blob-2 { animation: errorBlob2 22s ease-in-out infinite; }
        .error-blob-3 { animation: errorBlob3 16s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .error-split-gradient,
          .error-blob-1,
          .error-blob-2,
          .error-blob-3,
          .error-fan-spin {
            animation: none !important;
          }
        }
        .error-fan-spin {
          animation: errorFanSpin 60s linear infinite;
        }
        @keyframes errorFanSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
        {/* Visual panel */}
        <div className="error-split-gradient relative flex min-h-[32vh] flex-1 items-center justify-center overflow-hidden lg:min-h-screen lg:max-w-[52%]">
          <div
            className={`error-blob-1 pointer-events-none absolute top-[-20%] left-[-10%] h-[85%] w-[80%] rounded-full blur-[90px] ${v.blob1}`}
          />
          <div
            className={`error-blob-2 pointer-events-none absolute bottom-[-18%] right-[-8%] h-[80%] w-[75%] rounded-full blur-[100px] ${v.blob2}`}
          />
          <div
            className={`error-blob-3 pointer-events-none absolute top-[30%] left-[25%] h-[60%] w-[55%] rounded-full blur-[80px] ${v.blob3}`}
          />

          <div className="relative z-10 flex flex-col items-center px-6 py-12">
            <p
              className={`mb-6 font-mono text-[10px] uppercase tracking-[0.35em] ${v.accent} opacity-80`}
            >
              {code} · {v.tag}
            </p>

            <div
              className="relative flex items-center justify-center font-serif leading-none text-white/95 select-none"
              style={{ fontSize: "clamp(5rem, 14vw, 11rem)" }}
              aria-hidden
            >
              <span>{code[0]}</span>
              <span className="relative mx-[0.02em] inline-flex h-[1em] w-[0.62em] items-center justify-center">
                <span className="error-fan-spin absolute inset-0 flex items-center justify-center opacity-95">
                  <BladeFan color="white" size={72} strokeWidth={6} />
                </span>
              </span>
              <span>{code[2]}</span>
            </div>

            <Link
              href={marketingHref("/")}
              className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white/20"
            >
              <BladeFan color="white" size={18} strokeWidth={3} />
              Entivia
            </Link>
          </div>
        </div>

        {/* Content panel */}
        <div className="flex w-full flex-1 items-center justify-center p-8 sm:p-12 lg:max-w-[48%] lg:p-16">
          <div className="w-full max-w-md space-y-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-400">
                {code} · {variant === "404" ? "Not found" : "Server error"}
              </p>
              <h1 className="mt-3 font-serif text-3xl leading-[1.15] tracking-tight text-slate-900 sm:text-4xl">
                {headline}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{description}</p>
              {digest && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                  <span className="font-mono text-slate-400">ref</span>
                  <span className="font-mono text-[10px]">{digest}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">{children}</div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-6 text-[12px] text-slate-500">
              <Link href="/docs" className="inline-flex items-center gap-1 hover:text-slate-800">
                Documentation
                <ArrowRight size={11} />
              </Link>
              <span aria-hidden className="text-slate-300">
                ·
              </span>
              <Link
                href={appHref("/auth/login")}
                className="inline-flex items-center gap-1 hover:text-slate-800"
              >
                Sign in
                <ArrowRight size={11} />
              </Link>
              <span aria-hidden className="text-slate-300">
                ·
              </span>
              <a
                href="mailto:support@entivia.online"
                className="inline-flex items-center gap-1 hover:text-slate-800"
              >
                Contact support
                <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function errorPrimaryButtonClass(variant: ErrorSplitVariant): string {
  return `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${VARIANT_STYLES[variant].primaryBtn}`;
}

export function errorSecondaryButtonClass(): string {
  return "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50";
}
