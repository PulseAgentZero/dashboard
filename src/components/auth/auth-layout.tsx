import Image from "next/image";
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
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
          alt="Pulse Intelligence Network"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/20 to-black/90 z-10" />
        <div
          className="absolute top-12 left-12 z-20 animate-spin"
          style={{ animationDuration: "60s" }}
        >
          <BladeFan color="white" size={64} />
        </div>
        <div className="absolute bottom-12 left-12 z-20">
          <h1 className="text-white text-4xl font-black italic tracking-tighter">
            PULSE
          </h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">
            Intelligence Layer v1.0
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-slate-600">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
