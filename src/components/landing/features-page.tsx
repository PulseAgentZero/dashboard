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
 * Reconstructed with an elegant, smooth slate/zinc dark theme.
 */
export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800">
      <Navbar />

      <main>
        {/* =============================== HERO =============================== */}
        <section
          data-navbar-theme="dark"
          className="relative px-4 pt-32 pb-16 sm:px-6 md:px-10 md:pt-40 md:pb-24 lg:pt-44"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                  <span className="h-px w-6 bg-zinc-800" />
                  Core Capabilities
                </div>

                <h1 className="mt-6 font-serif text-4xl font-normal leading-[1.15] sm:leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.75rem]">
                  Your data already knows.
                  <br />
                  <span className="text-zinc-400">
                    Entivia surfaces it.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-zinc-400 font-medium">
                  An autonomous intelligence layer that plugs securely into your active database cluster, profiles every operational record, and alerts your team what to execute next.
                </p>

                <div className="mt-8 flex flex-row items-center gap-4 shrink-0">
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-3 text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-950 shadow-sm hover:bg-zinc-200 transition-colors"
                  >
                    Start free
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/products"
                    className="px-2 py-3 text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    See every product
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 shadow-xl ring-1 ring-white/5">
                <TelecomMock />
              </div>
            </div>

            {/* Live counter — minimal single line indicator */}
            <div className="mt-16 sm:mt-24 border-t border-zinc-900 pt-6">
              <p className="max-w-2xl font-mono text-xs uppercase tracking-wider text-zinc-500 font-bold flex flex-wrap items-center gap-1.5">
                <span className="text-orange-400 font-semibold tabular-nums tracking-normal bg-orange-500/5 border border-orange-500/10 px-2 py-0.5 rounded">
                  <EntityCounter />
                </span>{" "}
                records analyzed live across customer environments.
              </p>
            </div>
          </div>
        </section>

        {/* =============================== CHAPTERS =============================== */}

        <Chapter
          number="01"
          kicker="Direct Pipeline queries"
          title="We query your data live. We never replicate it."
          body={
            <>
              <p>
                Most business intelligence stacks demand a complex, multimonth engineering project to get off the ground—requiring heavy infrastructure setups, slow file extractions, and duplicate tables stored in insecure workspaces.
              </p>
              <p>
                Entivia maps directly over your architecture. We connect read-only into your Postgres, MySQL, MSSQL, or SQLite environments, translating native schema structures in real time.
              </p>
              <p>
                When self-hosting, the pipeline remains entirely enclosed inside your private virtual cloud layer. Your sensitive table rows never touch external networks.
              </p>
            </>
          }
        />

        <Chapter
          number="02"
          kicker="Predictive analytics"
          title="Every transaction, user profile, or product receives a tier."
          body={
            <>
              <p>
                Once initialized, our background agent pipelines cross-reference telemetry indicators continuously. The model traces hidden decay trajectories unique to your sector—including usage velocity changes, localized delays, or structural stock drops.
              </p>
              <p>
                Every active entry receives an operational tier index: critical, high, medium, or healthy. For entries flashing anomalies, recommendation scripts formulate precise procedural solutions derived directly from raw contextual telemetry patterns.
              </p>
            </>
          }
          reverse
        />

        <Chapter
          number="03"
          kicker="Semantic processing"
          title="Anyone on your team can ask the database anything."
          body={
            <>
              <p>
                Execute precise programmatic searches using raw conversation sentences. The analytical core interprets the prompt context, compiles standard transactional queries, and evaluates real-time tables in milliseconds.
              </p>
              <p>
                &ldquo;Who are my highest-risk customers in Lagos this week?&rdquo; &nbsp;&ldquo;Which trade SKUs are approaching warehouse thresholds?&rdquo; &nbsp;&ldquo;Why did operational parameters spike yesterday afternoon?&rdquo;
              </p>
              <p>
                No query engineering experience required. Answers trace back precisely to real source records, preserving extreme consistency while eliminating AI hallucination vectors.
              </p>
            </>
          }
        />

        <Chapter
          number="04"
          kicker="Webhook dispatch systems"
          title="The moment metrics fluctuate, your engineers know."
          body={
            <>
              <p>
                Establish explicit automated thresholds over vital risk matrices. The instant data fields cross specified parameters, Entivia drops structured notification payloads directly inside Slack channels, internal engineering endpoints, or third-party monitoring nodes.
              </p>
              <p>
                Data checks dispatch continuously on custom schedules. Power users can run complex customized queries inside Studio, format clean visualizations instantly, and generate read-only public reference links for immediate syncups.
              </p>
            </>
          }
          reverse
        />

        {/* =============================== HOSTING =============================== */}
        <section
          data-navbar-theme="dark"
          className="relative border-t border-zinc-900 bg-zinc-950 px-4 py-20 sm:py-28 md:px-10"
        >
          <div className="mx-auto max-w-3xl text-left sm:text-center">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Infrastructure Orchestration
            </p>
            <p className="mt-4 font-serif text-xl sm:text-2xl md:text-3xl font-normal leading-relaxed text-zinc-300">
              Deploy via{" "}
              <Link
                href="/pricing"
                className="text-orange-400 hover:text-orange-300 transition-colors underline decoration-orange-500/20 underline-offset-4"
              >
                Entivia Cloud
              </Link>{" "}
              for immediate plug-and-play instances, or run our images{" "}
              <Link
                href="/docs/hosting/self-hosted"
                className="text-orange-400 hover:text-orange-300 transition-colors underline decoration-orange-500/20 underline-offset-4"
              >
                locally inside your VPC
              </Link>{" "}
              if enterprise compliance policies limit data migration. The core engine functions identically.
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
      className="relative border-t border-zinc-900 px-4 py-20 sm:px-6 md:px-10 md:py-28"
    >
      <div
        className={[
          "mx-auto grid max-w-6xl gap-10 lg:grid-cols-[220px_1fr] lg:gap-16",
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
          <p className="font-mono text-xs tabular-nums text-orange-400 font-bold">
            Chapter {number}
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
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
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-tight text-white tracking-tight">
            {title}
          </h2>
          <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-400 font-medium">
            {body}
          </div>
        </div>
      </div>
    </section>
  );
}