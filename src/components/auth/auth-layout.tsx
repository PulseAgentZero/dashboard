import Image from "next/image";
import Link from "next/link";
import { BladeFan } from "../../../public/icon/bladeFan";
import { marketingHref } from "@/lib/site-urls";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode; // Added footer support for layout parity
}) {
  return (
    <>
      <style>{`
        .auth-gradient {
          background: linear-gradient(-45deg, #e1310a, #f25507, #ffa500, #ef1a4c, #b31d05, #e06c00);
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
          33%       { transform: translate(45px, -65px) scale(1.15); }
          66%       { transform: translate(-35px, 45px) scale(0.9); }
        }
        @keyframes authBlob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          40%       { transform: translate(-55px, 35px) scale(1.1); }
          75%       { transform: translate(35px, -45px) scale(1.15); }
        }
        @keyframes authBlob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50%       { transform: translate(30px, 55px) scale(0.95); }
        }
        .auth-blob-1 { animation: authBlob1 16s ease-in-out infinite; }
        .auth-blob-2 { animation: authBlob2 20s ease-in-out infinite; }
        .auth-blob-3 { animation: authBlob3 14s ease-in-out infinite; }
      `}</style>

      {/* Container switches back to full screen constraints on desktop views */}
      <div className="flex min-h-screen w-full lg:h-screen overflow-x-hidden bg-white">
        
        {/* Left Side Panel (Desktop Only) */}
        <div className="auth-gradient relative hidden w-7/12 overflow-hidden lg:flex xl:w-3/5">
          {/* Enhanced Backdrop Blur Layers */}
          <div className="auth-blob-1 pointer-events-none absolute top-[-15%] left-[-15%] h-[90%] w-[85%] rounded-full bg-[#ff0a3f]/40 blur-[110px]" />
          <div className="auth-blob-2 pointer-events-none absolute bottom-[-15%] right-[-10%] h-[85%] w-[80%] rounded-full bg-[#a31502]/60 blur-[120px]" />
          <div className="auth-blob-3 pointer-events-none absolute top-[25%] left-[20%] h-[65%] w-[60%] rounded-full bg-[#ffbc1a]/30 blur-[90px]" />

          {/* Top Logo / Navigation Branding */}
          <Link
            href={marketingHref("/")}
            aria-label="Go to Entivia home"
            className="absolute top-12 left-12 z-20 flex items-center gap-3.5 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/10 transition-all duration-200 hover:bg-white/15"
          >
            <div className="animate-spin" style={{ animationDuration: "45s" }}>
              <BladeFan color="white" size={24} />
            </div>
            <span className="text-sm font-semibold tracking-wide text-white">Entivia</span>
          </Link>

          {/* Modern Typography Main Showcase */}
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-16 xl:px-24">
            <div className="max-w-xl space-y-6">
              <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-6xl xl:leading-[1.1]">
                Total visibility over <span className="text-orange-200">every entity.</span>
              </h2>

              <div className="h-px w-16 bg-gradient-to-r from-white/40 to-transparent" />

              <p className="text-lg font-medium leading-relaxed text-white/80 xl:text-xl">
                Instant clarity when it matters most. Connect fragmented datasets into action in real-time.
              </p>
            </div>
          </div>

          {/* Bottom Version Branding */}
          <div className="absolute bottom-12 left-12 z-20 flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
            <span>Core Layer v1.0</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Secure Environment</span>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="flex w-full items-center flex-col justify-between p-6 sm:p-12 md:p-16 lg:w-5/12 xl:w-2/5 lg:h-full lg:overflow-y-auto">
          
          {/* Mobile-only Header Logo */}
          <div className="w-full flex lg:hidden justify-start mb-8 sm:mb-12">
            <Link
              href={marketingHref("/")}
              aria-label="Go to Entivia home"
              className="flex items-center gap-2.5"
            >
              <div className="animate-spin text-orange-600" style={{ animationDuration: "45s" }}>
                <BladeFan color="currentColor" size={22} />
              </div>
              <span className="text-base font-bold tracking-tight text-slate-900">Entivia</span>
            </Link>
          </div>

          {/* Main content container wrapper - cleans up text alignments */}
          <div className="my-auto w-full max-w-md space-y-6 py-4">
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                {subtitle}
              </p>
            </div>
            
            <div className="w-full">
              {children}
            </div>
          </div>

          {/* Footer content container (if passed) */}
          {footer && (
            <div className="w-full max-w-md mt-8 lg:mt-6">
              {footer}
            </div>
          )}
          
        </div>
      </div>
    </>
  );
}