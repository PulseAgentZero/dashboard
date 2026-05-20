import { BladeFan } from "../../../public/icon/bladeFan";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
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

      <div className="flex min-h-screen w-full">

        {/* Left — animated gradient panel */}
        <div className="auth-gradient hidden lg:flex w-1/2 relative overflow-hidden">

          {/* Blobs */}
          <div className="auth-blob-1 absolute top-[-20%] left-[-10%] w-[80%] h-[85%] rounded-full bg-[#ff1a4b]/45 blur-[90px] pointer-events-none" />
          <div className="auth-blob-2 absolute bottom-[-18%] right-[-8%] w-[75%] h-[80%] rounded-full bg-[#c9260c]/55 blur-[100px] pointer-events-none" />
          <div className="auth-blob-3 absolute top-[30%] left-[25%] w-[55%] h-[60%] rounded-full bg-[#ffaa00]/35 blur-[80px] pointer-events-none" />

          {/* Top-left logo */}
          <div className="absolute top-10 left-10 z-20 flex items-center gap-3">
            <div className="animate-spin" style={{ animationDuration: "60s" }}>
              <BladeFan color="white" size={36} />
            </div>
            <span className="text-white font-bold tracking-tight text-base">Entivia</span>
          </div>

          {/* Centered brand statement */}
          <div className="absolute inset-0 z-10 flex flex-col items-start justify-center px-12 xl:px-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40 mb-4">
              Entity Intelligence Platform
            </p>
            <h2 className="text-white font-serif text-4xl xl:text-5xl leading-[1.2] mb-4">
              Know every<br />entity.
            </h2>
            <div className="w-10 h-px bg-white/30" />
            <p className="mt-4 text-white/40 font-serif text-xl xl:text-2xl italic leading-snug">
              Act before it&apos;s too late.
            </p>
          </div>

          {/* Bottom version */}
          <div className="absolute bottom-10 left-10 z-20">
            <p className="text-white/25 font-mono text-[9px] uppercase tracking-[0.35em]">
              Intelligence Layer v1.0
            </p>
          </div>

        </div>

        {/* Right — form panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-white">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
              <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>

      </div>
    </>
  );
}
