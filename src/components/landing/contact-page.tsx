"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { Github } from "../../../public/icon/github";

const REASONS = [
  { id: "demo", label: "Book a demo" },
  { id: "pilot", label: "Start a pilot" },
  { id: "self-hosted", label: "Self-hosted" },
  { id: "partnership", label: "Partner" },
  { id: "support", label: "Support" },
  { id: "other", label: "Other" },
] as const;

const CHANNELS = [
  { label: "General", value: "hello@entivia.online", href: "mailto:hello@entivia.online" },
  { label: "Sales", value: "sales@entivia.online", href: "mailto:sales@entivia.online" },
  { label: "Security", value: "security@entivia.online", href: "mailto:security@entivia.online" },
];

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] =
    useState<(typeof REASONS)[number]["id"]>("demo");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-800">
      <Navbar />

      <main
        data-navbar-theme="dark"
        className="relative px-4 pt-32 pb-24 md:px-10 md:pt-40 lg:pt-44"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_520px] lg:gap-20 lg:items-start">
            
            {/* ---------- Left: editorial copy ---------- */}
            <div className="lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                <span className="h-px w-6 bg-zinc-800" />
                Inquiries Channel
              </div>

              <h1 className="mt-6 font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl md:text-6xl">
                Talk to us.
              </h1>

              <p className="mt-6 max-w-md text-sm sm:text-base leading-relaxed text-zinc-400 font-medium">
                Tell us about your active infrastructure matrix, your industry parameters, and what good logs look like. You are writing directly to founders and platform engineers.
              </p>

              <dl className="mt-12 grid grid-cols-1 gap-y-6 text-xs sm:grid-cols-2 sm:gap-x-8 border-t border-zinc-900 pt-8">
                {CHANNELS.map((c) => (
                  <div key={c.label}>
                    <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      {c.label}
                    </dt>
                    <dd className="mt-2">
                      <a
                        href={c.href}
                        className="font-mono text-xs sm:text-sm font-semibold text-zinc-300 hover:text-orange-400 transition-colors"
                      >
                        {c.value}
                      </a>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Source Ecosystem
                  </dt>
                  <dd className="mt-2">
                    <a
                      href="https://github.com/entivia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold text-zinc-300 hover:text-orange-400 transition-colors"
                    >
                      <Github  />
                      github.com/entivia
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    Base Core Operations
                  </dt>
                  <dd className="mt-2 font-mono text-xs text-zinc-400 font-semibold">
                    Lagos · WAT (UTC+1)
                  </dd>
                </div>
              </dl>

              <p className="mt-12 max-w-md border-t border-zinc-900 pt-6 font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
                Standard processing window within 24 business hours. NDA schedules processed instantly upon corporate requests.
              </p>
            </div>

            {/* ---------- Right: Form Canvas ---------- */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-sm p-5 sm:p-8 shadow-xl ring-1 ring-white/5">
              {submitted ? (
                <div className="flex min-h-[440px] flex-col items-center justify-center text-center animate-[fadeUp_.45s_ease-out]">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/5 text-orange-400">
                    <CheckCircle2 size={22} />
                  </div>
                  <h2 className="font-serif text-2xl font-normal text-white tracking-tight">
                    Payload received.
                  </h2>
                  <p className="mt-2 max-w-xs text-xs sm:text-sm leading-relaxed text-zinc-400 font-medium">
                    A technical lead will initialize contact within one operational business day.
                  </p>
                  <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-100 px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-sm hover:bg-zinc-200 transition-colors"
                  >
                    Return home
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                      Routing Parameter
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {REASONS.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setReason(r.id)}
                          className={[
                            "rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase font-bold tracking-wider transition-all",
                            reason === r.id
                              ? "border-orange-500/20 bg-orange-500/10 text-orange-400"
                              : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                          ].join(" ")}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="name" label="Name" placeholder="Amina Bello" required />
                    <Field
                      id="email"
                      label="Work email"
                      type="email"
                      placeholder="you@company.com"
                      required
                    />
                    <Field id="company" label="Company" placeholder="Your enterprise" />
                    <Field id="role" label="Role" placeholder="Ops Engineer" />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Context Parameters
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      placeholder="What telemetry anomalies are you attempting to resolve across your infrastructure data?"
                      className="w-full resize-y rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-all focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-between rounded-xl bg-zinc-100 px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-zinc-950 shadow-sm hover:bg-zinc-200 transition-colors"
                  >
                    <span>Dispatch message</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>

                  <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-600 font-bold leading-normal">
                    By submitting infrastructure telemetry metrics, you consent to our active{" "}
                    <Link
                      href="/privacy"
                      className="text-zinc-400 underline underline-offset-2 hover:text-white transition-colors"
                    >
                      privacy systems
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  id,
  label,
  type = "text",
  placeholder,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-all focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 font-medium"
      />
    </div>
  );
}