"use client";

import Link from "next/link";
import { ArrowRight, Send, Sparkles } from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import FinalCTA from "@/components/landing/final-CTA";
import { PLATFORM_PRODUCTS } from "@/lib/marketing/products";

const INTEGRATIONS = [
  "Postgres",
  "MySQL",
  "MSSQL",
  "SQLite",
  "CSV / Excel",
  "Slack",
  "Webhooks",
  "Anthropic",
  "Groq",
];

/* ============== per-product visual — clean, premium charts ============== */
function ProductVisual({ id }: { id: string }) {
  switch (id) {
    case "risk-scoring":
      return <RiskScoringMock />;
    case "recommendations":
      return <RecommendationsMock />;
    case "ask-anything":
      return <AskAnythingMock />;
    case "connectors":
      return <ConnectorsMock />;
    case "studio":
      return <StudioMock />;
    case "alerts":
      return <AlertsMock />;
    default:
      return null;
  }
}

const FRAME =
  "rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm p-5 sm:p-6 shadow-xl ring-1 ring-white/5";

function RiskScoringMock() {
  const tiers = [
    { label: "Critical", val: 91, count: 42, color: "bg-rose-500", bar: "bg-rose-500/80", text: "text-rose-400 bg-rose-500/10" },
    { label: "High", val: 73, count: 188, color: "bg-amber-500", bar: "bg-amber-500/80", text: "text-amber-400 bg-amber-500/10" },
    { label: "Healthy", val: 42, count: 2104, color: "bg-emerald-500", bar: "bg-emerald-500/80", text: "text-emerald-400 bg-emerald-500/10" },
  ];
  return (
    <div className={FRAME}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Risk distribution · Live metrics
      </p>
      <div className="mt-6 space-y-4">
        {tiers.map((t) => (
          <div key={t.label} className="flex items-center gap-4">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${t.color} bg-opacity-20 border border-white/10`}>
              <span className="font-mono text-xs font-bold text-white">{t.val}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${t.text}`}>
                  {t.label}
                </span>
                <span className="font-mono text-xs font-semibold text-zinc-300">
                  {t.count.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${t.val}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsMock() {
  const items = [
    {
      tag: "Critical",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      title: "Offer 7-day data bundle",
      sub: "Amina B. · 71% profile optimization match",
    },
    {
      tag: "High",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      title: "Reorder SKU-8842 — 240 units",
      sub: "Ikeja 12 Cluster · exhausts in 72 hours",
    },
    {
      tag: "Medium",
      color: "text-zinc-400 bg-zinc-800/60 border-zinc-700/50",
      title: "Reallocate 2 operational shifts",
      sub: "Ward C → Ward B · 94% volume density",
    },
  ];
  return (
    <div className={FRAME}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Recommendations priority queue
      </p>
      <div className="mt-5 space-y-3">
        {items.map((it, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4 transition-all hover:bg-zinc-950/80"
          >
            <div className="flex items-center justify-between gap-4">
              <span className={`text-[9px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${it.color}`}>
                {it.tag}
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                just now
              </span>
            </div>
            <p className="mt-2.5 text-sm font-medium text-zinc-100">
              {it.title}
            </p>
            <p className="mt-1 text-xs text-zinc-400 font-medium">{it.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AskAnythingMock() {
  return (
    <div className={FRAME}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Natural language interpreter
      </p>
      <div className="mt-5 space-y-3.5">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-zinc-800/70 border border-zinc-700/30 px-4 py-2.5">
          <p className="text-sm text-zinc-100 font-medium">
            Who are my highest-risk customers in Lagos this week?
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-1">
          <Sparkles size={12} className="animate-pulse text-orange-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            Running analytical query over Postgres…
          </span>
        </div>
        
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-orange-500/20 bg-orange-500/5 px-4 py-3.5">
          <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-orange-400">
            42 profiles pinpointed
          </p>
          <p className="mt-1.5 text-sm text-zinc-200 leading-relaxed">
            Subscribers inside zone LAG-B with transactional throughput down &gt;50% within 14 days. Primary links: Amina B., Tunde O., Faith E.
          </p>
          <p className="mt-2.5 font-mono text-[9px] text-zinc-500">
            Execution completed in 0.8s
          </p>
        </div>
        
        <div className="flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/60 px-3.5 py-2">
          <input
            disabled
            placeholder="Ask engine anything…"
            className="flex-1 bg-transparent text-xs sm:text-sm outline-none placeholder:text-zinc-600 cursor-not-allowed"
          />
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800">
            <Send size={10} className="text-zinc-400" />
          </span>
        </div>
      </div>
    </div>
  );
}

function ConnectorsMock() {
  const dbs = [
    { abbr: "PG", name: "Postgres", live: true },
    { abbr: "MY", name: "MySQL", live: true },
    { abbr: "MS", name: "MSSQL", live: false },
    { abbr: "SL", name: "SQLite", live: false },
    { abbr: "CSV", name: "CSV / Sheets", live: true },
    { abbr: "XLS", name: "Excel Ledger", live: false },
  ];
  return (
    <div className={FRAME}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Live connectors · read-only compliance
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {dbs.map((d) => (
          <div
            key={d.abbr}
            className={[
              "rounded-xl border p-3 transition-colors",
              d.live
                ? "border-orange-500/20 bg-orange-500/5"
                : "border-zinc-800/80 bg-zinc-950/20",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs sm:text-sm font-bold text-zinc-200">
                {d.abbr}
              </span>
              {d.live && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              )}
            </div>
            <p className="mt-3 font-mono text-[9px] uppercase font-bold tracking-wider text-zinc-500">
              {d.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudioMock() {
  const bars = [42, 68, 55, 78, 92, 71, 88, 95, 82, 110, 98, 125];
  return (
    <div className={FRAME}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Studio matrix · transactional yield
      </p>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="text-2xl sm:text-3xl font-serif font-bold text-zinc-100">₦18,410,000</p>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
          ↑ 23%
        </span>
      </div>
      <div className="mt-6 flex h-28 items-end gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className={[
              "flex-1 rounded-t",
              i === bars.length - 1
                ? "bg-orange-500 shadow-md shadow-orange-500/20"
                : "bg-zinc-800 hover:bg-zinc-700 transition-colors",
            ].join(" ")}
            style={{ height: `${(h / 125) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function AlertsMock() {
  return (
    <div className={FRAME}>
      <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Pipeline alert triggers
      </p>
      <div className="mt-5 space-y-3">
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] font-bold font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400">
              Risk anomaly
            </span>
            <span className="font-mono text-[10px] text-zinc-500">2s ago</span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-200">
            Churn probability threshold spike up 12% across tier clusters.
          </p>
          <p className="mt-2.5 font-mono text-[10px] text-orange-400 font-bold">
            → delivered payload to #ops-alerts
          </p>
        </div>
        
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[9px] font-bold font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
              Capacity margin
            </span>
            <span className="font-mono text-[10px] text-zinc-500">4m ago</span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-200">
            Ward B real-time occupancy metrics exceeded 90%.
          </p>
          <p className="mt-2.5 font-mono text-[10px] text-zinc-500">
            → automated webhook integration • 200 OK
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============== page ============== */
export function ProductsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800">
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section
          data-navbar-theme="dark"
          className="relative px-4 pt-32 pb-16 sm:px-6 md:px-10 md:pt-40 md:pb-24 lg:pt-44"
        >
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-500">
              <span className="h-px w-6 bg-zinc-800" />
              Engine Architecture
            </div>
            
            <h1 className="mt-6 max-w-4xl font-serif text-4xl font-normal leading-[1.15] sm:leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.75rem]">
              Connect once. Six dimensions unlock instantly.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Zero continuous custom glue code required. Run an immediate analytical hook into your data systems to activate predictive scoring arrays, real-time alerts, and semantic search vectors.
            </p>

            {/* Product Table of Contents Grid */}
            <ol className="mt-16 grid gap-x-12 gap-y-2 sm:grid-cols-2 border-t border-zinc-900 pt-4">
              {PLATFORM_PRODUCTS.map((p, i) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="group flex items-center justify-between gap-4 border-b border-zinc-900 py-3.5 transition-colors hover:border-zinc-800"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-zinc-600 tabular-nums font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        {p.title}
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-zinc-600 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-orange-400"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* STACKED CHRONICLE MODULES */}
        {PLATFORM_PRODUCTS.map((product, index) => {
          const Icon = product.icon;
          return (
            <section
              key={product.id}
              id={product.id}
              data-navbar-theme="dark"
              className="relative border-t border-zinc-900 px-4 py-20 sm:px-6 md:px-10 md:py-28"
            >
              <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_480px] lg:gap-16 lg:items-start">
                
                {/* Product Core Documentation Copy */}
                <div className="lg:max-w-md">
                  <div className="flex items-center gap-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <Icon size={14} className="text-zinc-600" />
                    <span>
                      {String(index + 1).padStart(2, "0")} / {String(PLATFORM_PRODUCTS.length).padStart(2, "0")} MODULE
                    </span>
                  </div>
                  
                  <h2 className="mt-5 font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight text-white tracking-tight">
                    {product.title}
                  </h2>
                  
                  <p className="mt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    {product.subtitle}
                  </p>
                  
                  <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-400 font-medium">
                    {product.description}
                  </p>

                  <ul className="mt-8 space-y-3 border-t border-zinc-900 pt-6">
                    {product.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-3 text-xs sm:text-sm text-zinc-400 font-medium leading-normal"
                      >
                        <span className="font-mono text-zinc-700 shrink-0 mt-0.5">—</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Active Dynamic Component Preview Canvas */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <ProductVisual id={product.id} />
                </div>
              </div>
            </section>
          );
        })}

        {/* ECOSYSTEM ECO-NET LINKS */}
        <section
          data-navbar-theme="dark"
          className="relative border-t border-zinc-900 bg-zinc-950 px-4 py-20 sm:px-6 md:px-10 md:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
              <div>
                <h2 className="max-w-md font-serif text-2xl sm:text-3xl text-white tracking-tight">
                  Integrates directly across legacy storage stacks.
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-500 font-medium">
                  Connect zero-trust pipelines via secure read-only analytical queries.
                </p>
              </div>
              
              <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end max-w-xl">
                {INTEGRATIONS.map((i) => (
                  <li
                    key={i}
                    className="font-mono text-xs sm:text-sm text-zinc-400 font-bold border border-zinc-900 bg-zinc-900/20 px-3 py-1 rounded-md"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            
            <Link
              href="/docs/data-sources"
              className="mt-10 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 transition-colors"
            >
              Examine all schema connections
              <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}