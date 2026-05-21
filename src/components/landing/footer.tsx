"use client";

import Link from "next/link";
import { BladeFan } from "../../../public/icon/bladeFan";
import { Heart } from "lucide-react";
import { NAV_LINKS } from "./navbar";
import { Github } from "../../../public/icon/github";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      data-navbar-theme="dark"
      className="bg-neutral-950 text-neutral-200 pt-16 pb-12 font-sans relative z-10 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Grid Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-neutral-900">
          
          {/* Brand & Mission Segment */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-base text-white">
                <BladeFan color="white" strokeWidth={5} size={34} />
              <span>Entivia</span>
            </Link>
            <p className="text-neutral-400 text-sm max-w-sm leading-relaxed">
              The open-source, self-hostable operational intelligence layer turning relational databases into real-time profiles, risk tracking matrix runs, and conversational workflows across emerging African enterprises.
            </p>
            
            {/* Social Channels */}
            <div className="flex items-center gap-3.5 mt-2 text-neutral-500">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github />
              </a>
            </div>
          </div>

          {/* Navigation Link Column */}
          <div className="col-span-1 md:col-span-3 md:col-start-7 flex flex-col gap-3.5">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-bold">Platform</span>
            <div className="flex flex-col gap-2.5 text-sm">
              {NAV_LINKS.slice(0, 4).map((link) => (
                <Link key={link.href} href={link.href} className="text-neutral-400 hover:text-white transition-colors w-fit">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal / Business Column */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-3.5">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-500 font-bold">Company</span>
            <div className="flex flex-col gap-2.5 text-sm">
              {NAV_LINKS.slice(4).map((link) => (
                <Link key={link.href} href={link.href} className="text-neutral-400 hover:text-white transition-colors w-fit">
                  {link.label}
                </Link>
              ))}
              <Link href="/privacy" className="text-neutral-400 hover:text-white transition-colors w-fit">Privacy Policy</Link>
              <Link href="/terms" className="text-neutral-400 hover:text-white transition-colors w-fit">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* Bottom Metadata & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
          <div>
            &copy; {currentYear} Entivia Systems. All rights reserved. Available under the MIT License.
          </div>
          <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800/60 px-3 py-1.5 rounded-full text-neutral-400">
            <span>Built for DSN × Bluechip Technologies Challenge 3.0</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>

      </div>
    </footer>
  );
}