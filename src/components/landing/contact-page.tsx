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
    <div className="marketing-dark min-h-screen bg-[var(--mk-bg)] text-[var(--mk-text)]">
      <Navbar />

      <main
        data-navbar-theme="dark"
        className="relative px-6 pt-36 pb-24 md:px-10 md:pt-44"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-16 lg:grid-cols-[1fr_520px] lg:gap-24 lg:items-start">
            {/* ---------- Left: editorial copy ---------- */}
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[var(--mk-text-faint)]">
                <span className="h-px w-8 bg-[var(--mk-text-faint)]" />
                Contact
              </div>

              <h1 className="mt-8 text-[2.75rem] font-medium leading-[1.05] tracking-tight text-[var(--mk-text)] sm:text-6xl md:text-7xl">
                Talk to us.
              </h1>

              <p className="mt-8 max-w-md text-base leading-relaxed text-[var(--mk-text-muted)] sm:text-lg">
                Tell us about your data, your industry, and what good looks
                like. You&apos;re writing to founders and engineers — not a
                ticket queue.
              </p>

              <dl className="mt-14 grid grid-cols-1 gap-y-6 text-sm sm:grid-cols-2 sm:gap-x-8">
                {CHANNELS.map((c) => (
                  <div key={c.label}>
                    <dt className="text-xs uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
                      {c.label}
                    </dt>
                    <dd className="mt-1.5">
                      <a
                        href={c.href}
                        className="font-mono text-[var(--mk-text)] underline-offset-4 hover:text-[var(--mk-accent)] hover:underline"
                      >
                        {c.value}
                      </a>
                    </dd>
                  </div>
                ))}
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
                    Source
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href="https://github.com/entivia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-[var(--mk-text)] underline-offset-4 hover:text-[var(--mk-accent)] hover:underline"
                    >
                      <Github />
                      github.com/entivia
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
                    Where we are
                  </dt>
                  <dd className="mt-1.5 text-[var(--mk-text-muted)]">
                    Lagos · WAT (UTC+1)
                  </dd>
                </div>
              </dl>

              <p className="mt-14 max-w-md border-t border-[var(--mk-border)] pt-6 text-sm text-[var(--mk-text-faint)]">
                Replies within one business day. We sign NDAs before sharing
                anything sensitive.
              </p>
            </div>

            {/* ---------- Right: form ---------- */}
            <div className="rounded-3xl border border-[var(--mk-border)] bg-[var(--mk-surface)] p-6 sm:p-8">
              {submitted ? (
                <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mk-accent-soft)] text-[var(--mk-accent)]">
                    <CheckCircle2 size={28} />
                  </div>
                  <h2 className="text-2xl font-medium text-[var(--mk-text)] sm:text-3xl">
                    Message received.
                  </h2>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--mk-text-muted)]">
                    Someone from the team will reply within one business day.
                  </p>
                  <Link
                    href="/"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--mk-accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--mk-accent-hover)]"
                  >
                    Back home
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--mk-text-faint)]">
                      What&apos;s this about
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {REASONS.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setReason(r.id)}
                          className={[
                            "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                            reason === r.id
                              ? "border-[var(--mk-accent)] bg-[var(--mk-accent)] text-white"
                              : "border-[var(--mk-border)] bg-[var(--mk-bg)] text-[var(--mk-text-muted)] hover:border-[var(--mk-text-faint)] hover:text-[var(--mk-text)]",
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
                    <Field id="company" label="Company" placeholder="Your company" />
                    <Field id="role" label="Role" placeholder="Ops Manager" />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-xs uppercase tracking-[0.2em] text-[var(--mk-text-faint)]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="What are you trying to figure out about your data?"
                      className="w-full resize-y rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg)] px-4 py-3 text-sm text-[var(--mk-text)] placeholder:text-[var(--mk-text-faint)] outline-none transition-colors focus:border-[var(--mk-accent)] focus:ring-1 focus:ring-[var(--mk-accent)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-between rounded-2xl bg-[var(--mk-accent)] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--mk-accent-hover)]"
                  >
                    <span>Send message</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </button>

                  <p className="text-[11px] leading-relaxed text-[var(--mk-text-faint)]">
                    By sending this you agree to our{" "}
                    <Link
                      href="/privacy"
                      className="text-[var(--mk-text-muted)] underline underline-offset-2 hover:text-[var(--mk-accent)]"
                    >
                      privacy policy
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
        className="mb-2 block text-xs uppercase tracking-[0.2em] text-[var(--mk-text-faint)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--mk-border)] bg-[var(--mk-bg)] px-4 py-2.5 text-sm text-[var(--mk-text)] placeholder:text-[var(--mk-text-faint)] outline-none transition-colors focus:border-[var(--mk-accent)] focus:ring-1 focus:ring-[var(--mk-accent)]"
      />
    </div>
  );
}
