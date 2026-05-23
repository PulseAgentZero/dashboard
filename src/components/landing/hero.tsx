"use client";

import Link from "next/link";

const DATA_LINES = [
  { tag: "ENTITY", val: "C-004821", sub: "HIGH risk" },
  { tag: "SCORED", val: "12,400", sub: "just now" },
  { tag: "ACTION", val: "Upsell", sub: "89 accounts" },
  { tag: "SEGMENT", val: "Churn Risk", sub: "234 entities" },
  { tag: "PIPELINE", val: "COMPLETE", sub: "99.8% acc." },
  { tag: "ENTITY", val: "P-008912", sub: "MED risk" },
  { tag: "RECCO", val: "Escalate", sub: "Priority 1" },
  { tag: "INDEXED", val: "1.2M rows", sub: "real-time" },
  { tag: "ENTITY", val: "D-001047", sub: "HEALTHY" },
  { tag: "ACTION", val: "Retain", sub: "12 accounts" },
  { tag: "SCORED", val: "8,930", sub: "0.9s ago" },
  { tag: "SEGMENT", val: "High Value", sub: "1,204 users" },
  { tag: "RECCO", val: "Discount", sub: "Priority 2" },
  { tag: "ENTITY", val: "C-009234", sub: "LOW risk" },
  { tag: "PIPELINE", val: "RUNNING", sub: "4,200 left" },
  { tag: "ACTION", val: "Nurture", sub: "67 accounts" },
];

export default function Hero() {
  return (
    <>
      <style>{`
        .hero-gradient {
          background: linear-gradient(-45deg, #e8390e, #f7620a, #ffcd43, #ff3366, #c9260c, #ff8c00);
          background-size: 400% 400%;
          animation: gradientShift 14s ease infinite;
        }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          25%  { background-position: 50% 0%; }
          50%  { background-position: 100% 50%; }
          75%  { background-position: 50% 100%; }
          100% { background-position: 0% 50%; }
        }

      `}</style>

      <section
        data-navbar-theme="dark"
        className="hero-gradient grain relative min-h-screen flex flex-col justify-between pt-26 sm:pt-30 md:pt-34 overflow-hidden"
      >
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="blob-1 absolute top-[-20%] left-[-10%] w-[80%] sm:w-[70%] h-[90%] rounded-full bg-[#ff1a4b]/50 blur-[80px] md:blur-[100px]" />
          <div className="blob-2 absolute bottom-[-15%] right-[-5%] w-[75%] sm:w-[65%] h-[85%] rounded-full bg-[#c9260c]/60 blur-[90px] md:blur-[110px]" />
          <div className="blob-3 absolute top-[30%] left-[20%] sm:left-[35%] w-[55%] h-[60%] rounded-full bg-[#ffaa00]/40 blur-[70px] md:blur-[90px]" />
        </div>

        <div
          className="absolute right-7 top-0 bottom-0 z-10 hidden xl:flex items-start overflow-hidden pointer-events-none w-36"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          }}
        >
          <div className="data-scroll flex flex-col gap-4 pt-24 text-right w-full">
            {[...DATA_LINES, ...DATA_LINES].map((line, i) => (
              <div key={i} className="flex flex-col items-end gap-0.5">
                <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/30">
                  {line.tag}
                </span>
                <span
                  className={[
                    "font-mono text-[11px] font-medium",
                    line.sub.includes("HIGH")
                      ? "text-rose-300/80"
                      : line.sub.includes("MED")
                        ? "text-amber-300/80"
                        : line.sub.includes("HEALTHY") || line.sub.includes("LOW")
                          ? "text-emerald-300/80"
                          : "text-white/65",
                  ].join(" ")}
                >
                  {line.val}
                </span>
                <span className="font-mono text-[8px] text-white/30">{line.sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 my-auto flex flex-col items-center justify-center grow">
         <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif text-white tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
  Connect your Data.{" "}
  <br className="hidden sm:block" />
  <span>Stream the actions.</span>
</h1>

<p className="text-white/90 text-base sm:text-lg md:text-xl font-medium max-w-md sm:max-w-lg leading-relaxed mb-8 px-2">
  Entivia links to your data sources to turn complex data into structured recommendation queues and instant pipelines.
</p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/auth/signup"
              className="hero-cta-glow bg-white text-black font-mono font-bold tracking-wider text-xs sm:text-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-full shadow-xl hover:bg-black hover:text-white active:scale-98 transition-all duration-300 uppercase"
            >
              Get started free
            </Link>
            <Link
              href="/features"
              className="text-white/80 font-medium text-sm sm:text-base hover:text-white transition underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
            >
              See how it works →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
