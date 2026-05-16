'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const active = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            active.add(entry.target);
          } else {
            active.delete(entry.target);
          }
        });
        setIsDark(active.size > 0);
      },
      { rootMargin: '0px 0px -92% 0px' }
    );

    document
      .querySelectorAll('[data-navbar-theme="dark"]')
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 font-sans transition-all duration-300 border-b ${
          isDark
            ? 'bg-black/75 border-zinc-800/40 text-white shadow-sm shadow-black/5'
            : 'bg-white/75 border-zinc-200/60 text-zinc-900 shadow-sm shadow-zinc-100/50'
        } backdrop-blur-md`}
      >
        {/* Maximum bound containment layout for ultra-wide monitors */}
        <div className="max-w-7xl mx-auto w-full py-4 flex items-center justify-between">
          
          {/* LOGO AREA */}
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className={`font-mono font-black tracking-tighter text-xl uppercase italic select-none transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              PulseData
            </span>
          </Link>

          {/* DESKTOP & TABLET LINKS */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {['Works', 'Features', 'About', 'Platform', 'Deploy'].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className={`transition-colors duration-200 font-medium ${
                  isDark
                    ? 'text-zinc-400 hover:text-white'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {item}
              </Link>
            ))}

            <Link
              href="/auth/signup"
              className={`ml-2 px-5 py-2 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-200 shadow-xs ${
                isDark
                  ? 'bg-white text-zinc-950 hover:bg-zinc-100'
                  : 'bg-zinc-950 text-white hover:bg-zinc-800'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* MOBILE TRIGGER BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-1.5 rounded-md border transition-all duration-200"
            style={{
              borderColor: isDark ? 'rgba(63, 63, 70, 0.4)' : 'rgba(228, 228, 231, 0.8)',
              color: isDark ? '#ffffff' : '#18181b'
            }}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* MOBILE PANEL OVERLAY */}
      <div
        className={`fixed inset-0 z-40 md:hidden bg-white/95 backdrop-blur-lg transition-all duration-300 flex flex-col justify-between pt-24 pb-12 px-8 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 text-left">
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold border-b border-zinc-100 pb-2">
            / NAVIGATION MAP
          </span>
          {['Works', 'Features', 'About', 'Platform', 'Deploy'].map((item, index) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold tracking-tight text-zinc-800 hover:text-zinc-950 flex items-center justify-between group"
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              <span>{item}</span>
              <span className="text-sm font-mono text-zinc-300 group-hover:text-zinc-900 transition-colors">
                [0{index + 1}]
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Action Floor */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/auth/signup"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3.5 rounded-xl bg-zinc-950 text-white font-bold text-sm tracking-wide uppercase shadow-sm"
          >
            Create Free Account
          </Link>
          <p className="text-center text-[10px] font-mono text-zinc-400">
            Enterprise intelligence layer ©2026 PulseData Inc.
          </p>
        </div>
      </div>
    </>
  );
}