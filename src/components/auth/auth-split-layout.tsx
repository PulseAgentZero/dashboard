import Image from "next/image";
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
    <div className="flex min-h-screen w-full bg-white">
      <div className="relative hidden w-1/2 overflow-hidden bg-black lg:flex">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
          alt="Entivia Intelligence Network"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 z-10 bg-linear-to-br from-black/80 via-black/20 to-black/90" />
        <div
          className="absolute top-12 left-12 z-20 animate-spin"
          style={{ animationDuration: "60s" }}
        >
          <BladeFan color="white" size={64} />
        </div>
        <div className="absolute bottom-12 left-12 z-20">
          <h1 className="text-4xl font-black tracking-tighter text-white italic">
            ENTIVIA
          </h1>
          <p className="mt-2 font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase">
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
  );
}
