"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import FinalCTA from "@/components/landing/final-CTA";
import { TelecomMock } from "@/components/landing/industry-mocks";
import { EntityCounter } from "@/components/landing/entity-counter";

/**
 * Magazine-style Features page.
 * No eyebrow chips, no italic-orange headline accents, no watermark numbers,
 * no comparison tables, no FAQ. Just a confident long-form read.
 */
export function FeaturesPage() {
  return (
    <div className="marketing-dark min-h-screen bg-[var(--mk-bg)] text-[var(--mk-text)]">
      <Navbar />

      <main>
        {/* =============================== HERO =============================== */}
        <section
          data-navbar-theme="dark"
          className="relative px-6 pt-36 pb-20 md:px-10 md:pt-44 md:pb-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--mk-text-faint)]">
                  <span className="h-px w-8 bg-[var(--mk-text-faint)]" />
                  Features
                </div>

                <h1 className="mt-8 text-[2.75rem] font-medium leading-[1.05] tracking-tight text-[var(--mk-text)] sm:text-6xl md:text-7xl lg:text-[5.25rem]">
                  Your data already knows.
                  <br />
                  <span className="text-[var(--mk-text-muted)]">
                    Entivia surfaces it.
                  </span>
                </h1>

                <p className="mt-8 max-w-md text-base leading-relaxed text-[var(--mk-text-muted)] sm:text-lg">
                  An autonomous intelligence layer that plugs into the database
                  you already run, scores every entity in it, and tells your
                  team what to do next.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--mk-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--mk-accent-hover)]"
                  >
                    Start free
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/products"
                    className="text-sm font-medium text-[var(--mk-text-muted)] underline underline-offset-4 transition-colors hover:text-[var(--mk-text)]"
                  >
                    See every product
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                <TelecomMock />
              </div>
            </div>

            {/* Live counter — single quiet line, not a 3-stat strip */}
            <p className="mt-20 max-w-2xl font-mono text-sm leading-relaxed text-[var(--mk-text-faint)]">
              <span className="text-[var(--mk-text)]">
                <EntityCounter />
              </span>{" "}
              entities scored across customers since launch. Counter ticking
              live.
            </p>
          </div>
        </section>

        {/* =============================== CHAPTERS =============================== */}

        <Chapter
          number="01"
          kicker="Reading, not extracting"
          title="We query your data live. We never copy it."
          body={
            <>
              <p>
                Most analytics tools start with a 12-week ETL project. Bulk
                exports, duplicate warehouses, brittle pipelines, and a copy of
                your sensitive data sitting somewhere it shouldn&apos;t.
              </p>
              <p>
                Entivia takes a different approach. We connect read-only to your
                Postgres, MySQL, MSSQL, or SQLite, and query it directly. Every
                answer in the product traces back to a row in your database.
                Nothing is cached, nothing is duplicated, nothing is invented.
              </p>
              <p>
                On self-hosted deployments, the pipeline runs entirely inside
                your VPC. Your row data never leaves your network.
              </p>
            </>
          }
        />

        <Chapter
          number="02"
          kicker="The intelligence layer"
          title="Every customer, patient, SKU, or route gets a score."
          body={
            <>
              <p>
                Once connected, an autonomous pipeline of agents profiles every
                entity in your database. It learns the signals that matter —
                usage trends, late payments, occupancy, sell-through, fuel use,
                whatever your domain looks like — and assigns each entity a
                tier: critical, high, medium, or healthy.
              </p>
              <p>
                For everything flagged critical or high, the recommendation
                agent drafts a next-best action grounded in real patterns from
                your data. Not generic playbooks. Actions specific to that
                entity, that week, that store.
              </p>
            </>
          }
          reverse
        />

        <Chapter
          number="03"
          kicker="Plain-English chat"
          title="Anyone on your team can ask the data anything."
          body={
            <>
              <p>
                Type a question in normal English. The agent translates it to
                SQL, runs it against your live database, and answers in seconds
                — citing the rows it pulled from.
              </p>
              <p>
                &ldquo;Who are my highest-risk customers in Lagos this
                week?&rdquo; &nbsp;&ldquo;Which SKUs are about to stock
                out?&rdquo; &nbsp;&ldquo;Why did Ward B&apos;s occupancy spike
                yesterday?&rdquo;
              </p>
              <p>
                No SQL skills required. No dashboards to build. Answers are
                grounded in your schema and business context, so they stay on
                domain.
              </p>
            </>
          }
        />

        <Chapter
          number="04"
          kicker="Find-you-first alerts"
          title="When risk moves, your team hears about it."
          body={
            <>
              <p>
                Set thresholds on the scores and signals that matter to your
                business. When something spikes, Entivia pushes to Slack, email,
                or any webhook on your stack. The alert includes the entity, the
                signal, and the recommended action — not just a number.
              </p>
              <p>
                Pipelines run on a schedule or on demand. Power users can write
                SQL in Studio, build dashboards, and share public links when
                they need to ship a chart fast.
              </p>
            </>
          }
          reverse
        />

        {/* =============================== HOSTING — single calm sentence =============================== */}
        <section
          data-navbar-theme="dark"
          className="relative border-t border-[var(--mk-border)] px-6 py-28 md:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--mk-text-faint)]">
              Hosting
            </p>
            <p className="mt-6 text-2xl font-medium leading-[1.35] text-[var(--mk-text)] sm:text-3xl md:text-[2rem]">
              Use{" "}
              <Link
                href="/pricing"
                className="text-[var(--mk-accent)] underline underline-offset-[6px] decoration-[var(--mk-accent)]/30 hover:decoration-[var(--mk-accent)]"
              >
                Entivia Cloud
              </Link>{" "}
              if you want it now. Run it{" "}
              <Link
                href="/docs/hosting/self-hosted"
                className="text-[var(--mk-accent)] underline underline-offset-[6px] decoration-[var(--mk-accent)]/30 hover:decoration-[var(--mk-accent)]"
              >
                in your own VPC
              </Link>{" "}
              if your data can&apos;t leave. The product is the same either way.
            </p>
          </div>
        </section>

        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

/* -------- Chapter component — strict structure, varying side -------- */
function Chapter({
  number,
  kicker,
  title,
  body,
  reverse,
}: {
  number: string;
  kicker: string;
  title: string;
  body: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section
      data-navbar-theme="dark"
      className="relative border-t border-[var(--mk-border)] px-6 py-24 md:px-10 md:py-32"
    >
      <div
        className={[
          "mx-auto grid max-w-6xl gap-12 lg:grid-cols-[200px_1fr] lg:gap-20",
          reverse ? "lg:[direction:rtl]" : "",
        ].join(" ")}
      >
        {/* Marginalia — number + kicker, magazine-style */}
        <div
          className={[
            "lg:sticky lg:top-28 lg:self-start",
            reverse ? "lg:[direction:ltr]" : "",
          ].join(" ")}
        >
          <p className="font-mono text-xs tabular-nums text-[var(--mk-accent)]">
            Ch. {number}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-[var(--mk-text-faint)]">
            {kicker}
          </p>
        </div>

        {/* Body */}
        <div
          className={[
            "max-w-2xl",
            reverse ? "lg:[direction:ltr]" : "",
          ].join(" ")}
        >
          <h2 className="text-3xl font-medium leading-[1.15] tracking-tight text-[var(--mk-text)] sm:text-4xl md:text-[2.5rem]">
            {title}
          </h2>
          <div className="mt-8 space-y-5 text-base leading-[1.75] text-[var(--mk-text-muted)]">
            {body}
          </div>
        </div>
      </div>
    </section>
  );
}
