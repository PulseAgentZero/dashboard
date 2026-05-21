"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Database,
  FileText,
  Lock,
  Mail,
  Server,
  Shield,
} from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

const TRUST_CARDS = [
  {
    title: "Security",
    description:
      "Encryption, authentication, shared responsibility, and how to report a vulnerability.",
    href: "/security",
    icon: Shield,
  },
  {
    title: "Privacy Policy",
    description:
      "How we collect, use, and protect personal data on Cloud and self-hosted.",
    href: "/privacy",
    icon: Lock,
  },
  {
    title: "Terms of Service",
    description: "Terms governing use of Entivia Cloud, APIs, and licenses.",
    href: "/terms",
    icon: FileText,
  },
  {
    title: "Documentation",
    description: "Product guides, hosting, configuration, and API reference.",
    href: "/docs",
    icon: BookOpen,
  },
  {
    title: "Data source hardening",
    description: "Read-only users, connector security, and least privilege.",
    href: "/docs/data-sources#security-recommendations",
    icon: Database,
  },
  {
    title: "Self-hosted privacy",
    description: "Keep pipeline data in your VPC; local LLM options.",
    href: "/docs/hosting/self-hosted#data-privacy",
    icon: Server,
  },
  {
    title: "Contact us",
    description: "Talk to our team about pilots, partnerships, or support.",
    href: "/contact",
    icon: Mail,
  },
] as const;

export function TrustCenterPage() {
  return (
    <div className="marketing-dark min-h-screen bg-[var(--mk-bg)] text-[var(--mk-text)]">
      <Navbar />

      <main
        data-navbar-theme="dark"
        className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:px-8"
      >
        <div className="mb-12 border-b border-[var(--mk-border)] pb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[var(--mk-accent)]">
            Trust Center
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[var(--mk-text)] sm:text-4xl">
            Security, privacy, and compliance resources
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--mk-text-muted)] sm:text-[15px]">
            Entivia is built for regulated and operationally sensitive environments.
            Use the resources below to understand how we protect your data and how
            you stay in control—especially on self-hosted deployments.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {TRUST_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex flex-col rounded-2xl border border-[var(--mk-border)] bg-[var(--mk-surface)] p-6 transition-colors hover:border-[var(--mk-accent)]/40 hover:bg-[var(--mk-surface-2)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mk-accent-soft)] text-[var(--mk-accent)]">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--mk-text-faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--mk-accent)]" />
                </div>
                <h2 className="text-lg font-semibold text-[var(--mk-text)]">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--mk-text-muted)]">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-[var(--mk-text-muted)]">
          Questions?{" "}
          <a
            href="mailto:security@entivia.online"
            className="text-[var(--mk-accent)] hover:underline"
          >
            security@entivia.online
          </a>
          {" · "}
          <a
            href="mailto:privacy@entivia.online"
            className="text-[var(--mk-accent)] hover:underline"
          >
            privacy@entivia.online
          </a>
          {" · "}
          <a
            href="mailto:legal@entivia.online"
            className="text-[var(--mk-accent)] hover:underline"
          >
            legal@entivia.online
          </a>
        </p>
      </main>

      <Footer />
    </div>
  );
}
