"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BladeFan } from "../../../public/icon/bladeFan";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = scrolled ? "text-slate-700" : "text-white";
  const fanColor = scrolled ? "#334155" : "#ffffff";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-300 ${
        scrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 w-[35%] ${textColor}`}>
        <BladeFan color={fanColor} size={36} />
        <p className="text-[18px] font-semibold tracking-wide">PULSE</p>
      </div>

      {/* Nav links */}
      <div
        className={`hidden md:flex gap-8 font-medium w-[30%] items-center justify-center text-[14px] ${textColor}`}
      >
        <a href="#" className="hover:opacity-70 transition-opacity">Products</a>
        <a href="#" className="hover:opacity-70 transition-opacity">Learn</a>
        <a href="#" className="hover:opacity-70 transition-opacity">Company</a>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-end gap-2 w-[35%]">
        <Link
          href="/auth/login"
          className={`text-[13px] font-medium px-4 py-2 transition-opacity hover:opacity-70 ${textColor}`}
        >
          Log in
        </Link>
        <Link
          href="/auth/signup"
          className="bg-[#3B66F5] text-white text-[13px] px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Get started
        </Link>
      </div>
    </nav>
  );
}
