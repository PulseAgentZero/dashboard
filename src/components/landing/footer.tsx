import Link from "next/link";
import { BladeFan } from "../../../public/icon/bladeFan";

const navLinks = {
  Product: ["Data Connection", "Entity Profiles", "Action Queue", "AI Agent"],
  Company: ["About", "Blog", "Careers", "Press"],
  Legal: ["Privacy Policy", "Terms of Service", "Security"],
};

const socials = ["Twitter", "LinkedIn", "GitHub"];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0b0d14]">
      <div className="mx-auto max-w-7xl px-8 py-16 md:px-16">
        {/* Top row */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-white">
              <BladeFan color="#6366f1" size={30} />
              <span className="text-[17px] font-semibold tracking-wide">PULSE</span>
            </div>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-slate-500">
              AI-powered operational intelligence for businesses in emerging
              markets. Connect your data. Act instantly.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(navLinks).map(([group, items]) => (
            <div key={group}>
              <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {group}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-[14px] text-slate-400 transition-colors hover:text-white"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center">
          <p className="text-[12px] text-slate-600">
            © 2026 Pulse Technologies Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {socials.map((s) => (
              <Link
                key={s}
                href="#"
                className="text-[12px] text-slate-600 transition-colors hover:text-slate-300"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
