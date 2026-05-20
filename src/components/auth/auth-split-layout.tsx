import Link from "next/link";
import { BladeFan } from "../../../public/icon/bladeFan";

type AuthSplitLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthSplitLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthSplitLayoutProps) {
  return (
    <>
      <style>{`
        .auth-gradient {
          background: linear-gradient(-45deg, #e8390e, #f7620a, #ffcd43, #ff3366, #c9260c, #ff8c00);
          background-size: 400% 400%;
          animation: authShift 14s ease infinite;
        }
        @keyframes authShift {
          0%   { background-position: 0% 50%; }
          25%  { background-position: 50% 0%; }
          50%  { background-position: 100% 50%; }
          75%  { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes authBlob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33%       { transform: translate(35px, -55px) scale(1.1); }
          66%       { transform: translate(-25px, 35px) scale(0.93); }
        }
        @keyframes authBlob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(-45px, 28px) scale(1.08); }
          75%       { transform: translate(28px, -38px) scale(1.13); }
        }
        @keyframes authBlob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(20px, 45px) scale(0.92); }
        }
        .auth-blob-1 { animation: authBlob1 18s ease-in-out infinite; }
        .auth-blob-2 { animation: authBlob2 22s ease-in-out infinite; }
        .auth-blob-3 { animation: authBlob3 16s ease-in-out infinite; }
      `}</style>

      <div className="flex min-h-screen w-full bg-white">
        <div className="auth-gradient relative hidden w-1/2 overflow-hidden lg:flex">
          <div className="auth-blob-1 pointer-events-none absolute top-[-20%] left-[-10%] h-[85%] w-[80%] rounded-full bg-[#ff1a4b]/45 blur-[90px]" />
          <div className="auth-blob-2 pointer-events-none absolute bottom-[-18%] right-[-8%] h-[80%] w-[75%] rounded-full bg-[#c9260c]/55 blur-[100px]" />
          <div className="auth-blob-3 pointer-events-none absolute top-[30%] left-[25%] h-[60%] w-[55%] rounded-full bg-[#ffaa00]/35 blur-[80px]" />

          <Link
            href="/"
            aria-label="Go to Entivia home"
            className="absolute top-10 left-10 z-20 flex items-center gap-3 rounded-full px-1 py-1 -mx-1 -my-1 transition-opacity hover:opacity-80"
          >
            <div className="animate-spin" style={{ animationDuration: "60s" }}>
              <BladeFan color="white" size={36} />
            </div>
            <span className="text-base font-bold tracking-tight text-white">Entivia</span>
          </Link>

          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-12 xl:px-16">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
              Entity Intelligence Platform
            </p>
            <h2 className="mb-4 font-serif text-4xl leading-[1.2] text-white xl:text-5xl">
              Know every
              <br />
              entity.
            </h2>
            <div className="h-px w-10 bg-white/30" />
            <p className="mt-4 font-serif text-xl italic leading-snug text-white/40 xl:text-2xl">
              Act before it&apos;s too late.
            </p>
          </div>

          <div className="absolute bottom-10 left-10 z-20">
            <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
              Intelligence Layer v1.0
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center p-8 sm:p-12 md:p-16 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
              <p className="mt-2 text-slate-600">{subtitle}</p>
            </div>
            {children}
            {footer}
          </div>
        </div>
      </div>
    </>
  );
}
