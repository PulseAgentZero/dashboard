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

/* ============== per-product visual — clean, no fake chrome ============== */
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
  "rounded-2xl border border-[var(--mk-border)] bg-[var(--mk-surface)] p-6";

function RiskScoringMock() {
  const tiers = [
    { label: "Critical", val: 91, count: 42, color: "bg-rose-500", text: "text-rose-400" },
    { label: "High", val: 73, count: 188, color: "bg-amber-500", text: "text-amber-400" },
    { label: "Healthy", val: 42, count: 2104, color: "bg-emerald-500", text: "text-emerald-400" },
  ];
  return (
    <div className={FRAME}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
        Risk distribution · live
      </p>
      <div className="mt-5 space-y-3">
        {tiers.map((t) => (
          <div key={t.label} className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-full ${t.color}`}>
              <span className="text-xs font-bold text-white">{t.val}</span>
            </div>
            <div className="flex-1">
              <p className={`text-xs font-semibold uppercase tracking-wider ${t.text}`}>
                {t.label}
              </p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--mk-border)]">
                <div className={`h-full ${t.color}`} style={{ width: `${t.val}%` }} />
              </div>
            </div>
            <span className="font-mono text-sm font-bold text-[var(--mk-text)]">
              {t.count.toLocaleString()}
            </span>
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
      color: "text-rose-400",
      ring: "border-rose-500/30",
      title: "Offer 7-day data bundle",
      sub: "Amina B. · 71% accept rate on similar profiles",
    },
    {
      tag: "High",
      color: "text-amber-400",
      ring: "border-amber-500/30",
      title: "Reorder SKU-8842 — 240 units",
      sub: "Ikeja 12 · stocks out in 3d",
    },
    {
      tag: "Medium",
      color: "text-orange-400",
      ring: "border-orange-500/30",
      title: "Reallocate 2 nurses",
      sub: "Ward C → Ward B · 94% occupancy",
    },
  ];
  return (
    <div className={FRAME}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
        Recommendations queue
      </p>
      <div className="mt-5 space-y-2.5">
        {items.map((it, i) => (
          <div
            key={i}
            className={`rounded-xl border ${it.ring} bg-[var(--mk-bg)] p-3.5`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${it.color}`}>
                {it.tag}
              </span>
              <span className="font-mono text-[9px] text-[var(--mk-text-faint)]">
                just now
              </span>
            </div>
            <p className="mt-1.5 text-sm font-medium text-[var(--mk-text)]">
              {it.title}
            </p>
            <p className="mt-0.5 text-xs text-[var(--mk-text-muted)]">{it.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AskAnythingMock() {
  return (
    <div className={FRAME}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
        Ask anything
      </p>
      <div className="mt-5 space-y-3">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm border border-[var(--mk-border)] bg-[var(--mk-bg)] px-4 py-2.5">
          <p className="text-sm text-[var(--mk-text)]">
            Who are my highest-risk customers in Lagos this week?
          </p>
        </div>
        <div className="flex items-center gap-2 px-1">
          <Sparkles size={11} className="animate-pulse text-[var(--mk-accent)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
            Running SQL on your Postgres…
          </span>
        </div>
        <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-[var(--mk-accent)]/30 bg-[var(--mk-accent-soft)] px-4 py-3">
          <p className="text-xs font-bold text-[var(--mk-accent)]">
            42 entities found
          </p>
          <p className="mt-1 text-sm text-[var(--mk-text)]">
            Subscribers in zone LAG-B with usage down &gt;50% in 14 days. Top
            three: Amina B., Tunde O., Faith E.
          </p>
          <p className="mt-2 font-mono text-[10px] text-[var(--mk-text-faint)]">
            answered in 0.8s
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-[var(--mk-border)] bg-[var(--mk-bg)] px-3 py-2.5">
          <input
            disabled
            placeholder="Ask anything…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--mk-text-faint)]"
          />
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mk-accent)]">
            <Send size={11} className="text-white" />
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
    { abbr: "CSV", name: "CSV", live: true },
    { abbr: "XLS", name: "Excel", live: false },
  ];
  return (
    <div className={FRAME}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
        Connections · 3 live · read-only
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {dbs.map((d) => (
          <div
            key={d.abbr}
            className={[
              "rounded-xl border p-3",
              d.live
                ? "border-[var(--mk-accent)]/40 bg-[var(--mk-accent-soft)]"
                : "border-[var(--mk-border)] bg-[var(--mk-bg)]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[var(--mk-text)]">
                {d.abbr}
              </span>
              {d.live && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              )}
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-[var(--mk-text-faint)]">
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
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
        Studio · revenue by week
      </p>
      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-3xl font-semibold text-[var(--mk-text)]">₦18.4M</p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
          ↑ 23%
        </span>
      </div>
      <div className="mt-4 flex h-32 items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className={[
              "flex-1 rounded-t-sm",
              i === bars.length - 1
                ? "bg-[var(--mk-accent)]"
                : "bg-[var(--mk-accent)]/35",
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
      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
        Alerts · incoming
      </p>
      <div className="mt-5 space-y-2.5">
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
              Risk spike
            </span>
            <span className="font-mono text-[9px] text-[var(--mk-text-faint)]">2s ago</span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-[var(--mk-text)]">
            Churn segment up 12% since Monday
          </p>
          <p className="mt-2 font-mono text-[10px] text-[var(--mk-accent)]">
            → #ops-alerts · Slack delivered
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Threshold met
            </span>
            <span className="font-mono text-[9px] text-[var(--mk-text-faint)]">4m</span>
          </div>
          <p className="mt-1.5 text-sm font-medium text-[var(--mk-text)]">
            Ward B occupancy &gt; 90%
          </p>
          <p className="mt-2 font-mono text-[10px] text-[var(--mk-accent)]">
            → webhook · 200 OK
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============== page ============== */
export function ProductsPage() {
  return (
    <div className="marketing-dark min-h-screen bg-[var(--mk-bg)] text-[var(--mk-text)]">
      <Navbar />

      <main>
        {/* HERO */}
        <section
          data-navbar-theme="dark"
          className="relative px-6 pt-36 pb-24 md:px-10 md:pt-44 md:pb-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--mk-text-faint)]">
              <span className="h-px w-8 bg-[var(--mk-text-faint)]" />
              Products
            </div>
            <h1 className="mt-8 max-w-4xl text-[2.75rem] font-medium leading-[1.05] tracking-tight text-[var(--mk-text)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Connect once. Six things start happening.
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--mk-text-muted)] sm:text-lg">
              No glue code. No data pipeline to babysit. One connection, then
              scoring, recommendations, chat, charts, and alerts.
            </p>

            {/* Product index — text only, like a magazine TOC */}
            <ol className="mt-16 grid gap-x-12 gap-y-3 sm:grid-cols-2">
              {PLATFORM_PRODUCTS.map((p, i) => (
                <li key={p.id}>
                  <a
                    href={`#${p.id}`}
                    className="group flex items-baseline gap-4 border-b border-[var(--mk-border)] py-3 text-sm transition-colors hover:border-[var(--mk-accent)]/50"
                  >
                    <span className="font-mono text-xs text-[var(--mk-text-faint)] tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[var(--mk-text-muted)] group-hover:text-[var(--mk-text)]">
                      {p.title}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-[var(--mk-text-faint)] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PRODUCT SECTIONS — uniform stacked editorial blocks */}
        {PLATFORM_PRODUCTS.map((product, index) => {
          const Icon = product.icon;
          return (
            <section
              key={product.id}
              id={product.id}
              data-navbar-theme="dark"
              className="relative border-t border-[var(--mk-border)] px-6 py-24 md:px-10 md:py-32"
            >
              <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_500px] lg:gap-20">
                {/* Copy */}
                <div className="lg:max-w-md">
                  <div className="flex items-center gap-3 text-[var(--mk-text-faint)]">
                    <Icon size={16} />
                    <span className="font-mono text-xs tabular-nums">
                      {String(index + 1).padStart(2, "0")} / {String(PLATFORM_PRODUCTS.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-6 text-3xl font-medium leading-[1.15] tracking-tight text-[var(--mk-text)] sm:text-4xl md:text-[2.5rem]">
                    {product.title}
                  </h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.15em] text-[var(--mk-accent)]">
                    {product.subtitle}
                  </p>
                  <p className="mt-7 text-base leading-relaxed text-[var(--mk-text-muted)]">
                    {product.description}
                  </p>

                  <ul className="mt-8 space-y-3 border-t border-[var(--mk-border)] pt-6">
                    {product.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-baseline gap-3 text-sm text-[var(--mk-text-muted)]"
                      >
                        <span className="font-mono text-[10px] text-[var(--mk-text-faint)]">
                          —
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mock — sticky on desktop so it stays in view as you read */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <ProductVisual id={product.id} />
                </div>
              </div>
            </section>
          );
        })}

        {/* INTEGRATIONS — minimal */}
        <section
          data-navbar-theme="dark"
          className="relative border-t border-[var(--mk-border)] px-6 py-24 md:px-10"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-end lg:gap-20">
              <h2 className="max-w-md text-3xl font-medium leading-[1.15] tracking-tight text-[var(--mk-text)] sm:text-4xl">
                Connects to what you already use.
              </h2>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
                {INTEGRATIONS.map((i) => (
                  <li
                    key={i}
                    className="font-mono text-sm text-[var(--mk-text-muted)]"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/docs/data-sources"
              className="mt-12 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--mk-accent)] hover:underline"
            >
              See all connectors
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
