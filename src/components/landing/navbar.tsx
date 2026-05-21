"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { BladeFan } from "../../../public/icon/bladeFan";

export const NAV_LINKS = [
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Features", href: "/features" },
  { label: "Documentation", href: "/docs" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-navbar-theme]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const hitting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (hitting.length > 0) {
          setDark(hitting[0].target.getAttribute("data-navbar-theme") === "dark");
        }
      },
      {
        threshold: 0,
        rootMargin: "-56px 0px -45% 0px",
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        if (!isOpen) setVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const T = dark;

  function navLinkClass(href: string, mobile = false) {
    const active = pathname === href || pathname.startsWith(`${href}/`);

    if (mobile) {
      return [
        "flex items-center justify-between border-b border-current/10 pb-3 text-left w-full group transition",
        active ? "text-[var(--mk-accent)]" : "opacity-90 group-hover:opacity-100",
      ].join(" ");
    }

    return [
      "relative transition opacity-80 hover:opacity-100",
      active ? "opacity-100 text-[var(--mk-accent)]" : "",
    ].join(" ");
  }

  return (
    <>
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-6 transition-transform duration-300 ease-in-out",
          visible ? "translate-y-0" : "-translate-y-28",
        ].join(" ")}
      >
        <div
          className={[
            "max-w-7xl mx-auto flex items-center justify-between rounded-full pl-0 pr-0 h-14",
            "border backdrop-blur-md transition-all duration-500 relative z-50",
            T ? "border-white/20 bg-white/5" : "border-black/10 bg-white/80",
          ].join(" ")}
        >
          <Link
  href="/"
  className={[
    "flex items-center gap-2 h-full px-4 font-bold tracking-tight text-base transition-colors duration-500 shrink-0",
    T ? "text-white" : "text-black",
  ].join(" ")}
>
  <BladeFan strokeWidth={3} size={25} color={T ? "#ffffff" : "#000000"} />
 <p className="text-[18px] mb-0.5 font-medium">
   Entivia
 </p>
</Link>

          <div className="flex items-center h-full">
            <div
              className={[
                "hidden lg:flex items-center gap-6 font-medium text-[14px] mr-6 transition-colors duration-500",
                T ? "text-white" : "text-neutral-800",
              ].join(" ")}
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={navLinkClass(href)}
                >
                  <span className="relative">
                    {label}
                    {(pathname === href || pathname.startsWith(`${href}/`)) && (
                      <span
                        className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-[var(--mk-accent,#ea580c)]"
                        aria-hidden
                      />
                    )}
                  </span>
                </Link>
              ))}
              <span className={T ? "text-white/20" : "text-black/15"}>|</span>
              <Link href="/auth/login" className="opacity-80 hover:opacity-100 transition">
                Log in
              </Link>
            </div>

            <div
              className={[
                "hidden sm:flex lg:hidden items-center gap-5 text-sm font-medium mr-6 transition-colors duration-500",
                T ? "text-white" : "text-neutral-800",
              ].join(" ")}
            >
              <Link href="/auth/login" className="opacity-80 hover:opacity-100 transition">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="opacity-80 hover:opacity-100 transition-opacity hidden md:inline-block"
              >
                Sign up
              </Link>
            </div>

            <Link
              href="/auth/signup"
              className={[
                "hidden md:flex items-center justify-center h-full px-5 sm:px-6 border-l",
                "font-mono font-bold tracking-wider text-[14px] uppercase transition-all duration-500 rounded-r-full",
                T
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-black/10 text-neutral-900 hover:bg-black/5",
              ].join(" ")}
            >
              Get started
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={[
                "flex lg:hidden items-center justify-center h-full px-5 border-l transition-all duration-500 rounded-r-full",
                T
                  ? "border-white/20 text-white hover:bg-white/5"
                  : "border-black/10 text-neutral-800 hover:bg-black/5",
              ].join(" ")}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <div
        className={[
          "fixed inset-0 z-40 lg:hidden flex flex-col justify-between pt-28 px-6 sm:px-10 pb-10 transition-all duration-300 marketing-dark",
          isOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4",
          "bg-[var(--mk-bg)]/95 text-[var(--mk-text)] backdrop-blur-xl",
        ].join(" ")}
      >
        <div className="flex flex-col gap-5 text-lg sm:text-xl font-medium overflow-y-auto max-h-[60vh] pt-4">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={navLinkClass(href, true)}
            >
              <span>{label}</span>
              <ChevronDown className="w-5 h-5 opacity-60 -rotate-90" />
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--mk-border)] pt-6 mt-auto">
          <div className="flex sm:hidden gap-3">
            <Link
              href="/auth/login"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-center text-sm font-medium rounded-full border border-[var(--mk-border)] hover:bg-[var(--mk-surface)] transition"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 text-center text-sm font-medium rounded-full bg-[var(--mk-accent)] text-white transition hover:bg-[var(--mk-accent-hover)]"
            >
              Sign up
            </Link>
          </div>

          <Link
            href="/auth/signup"
            onClick={() => setIsOpen(false)}
            className="w-full py-3.5 text-center font-mono font-bold tracking-wider text-xs uppercase rounded-full border border-[var(--mk-border)] bg-white text-black hover:bg-neutral-100 hidden sm:block md:hidden"
          >
            Get started
          </Link>
        </div>
      </div>
    </>
  );
}
