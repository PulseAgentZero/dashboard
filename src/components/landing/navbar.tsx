import Link from "next/link";
import { isCloudDeployment, isSelfHostedDeployment } from "@/lib/deployment";

export default function Navbar() {
  const cloud = isCloudDeployment();
  const selfHosted = isSelfHostedDeployment();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-6 bg-black/80 backdrop-blur-sm border-b border-white/10 md:px-16">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-white font-black tracking-tighter text-2xl uppercase italic">
          PulseData
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="/features" className="hover:text-white transition-colors">
          Features
        </Link>
        <Link href="/docs" className="hover:text-white transition-colors">
          Docs
        </Link>
        {cloud && (
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        )}
        {selfHosted && (
          <Link
            href="/pricing/self-hosted"
            className="hover:text-white transition-colors"
          >
            License
          </Link>
        )}
        {!cloud && !selfHosted && (
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        )}
        <Link href="/auth/login" className="hover:text-white transition-colors">
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="ml-2 bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-zinc-200 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
