"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Database,
  FileText,
  Lock,
  Server,
  Shield,
} from "lucide-react";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";

const TRUST_CARDS = [
  {
    title: "Security",
    description:
      "Encryption, authentication, shared responsibility, and vulnerability disclosure.",
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
] as const;

export function TrustCenterPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:px-8">
        <div className="mb-12 border-b border-zinc-900 pb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-zinc-600">
            Trust Center
          </p>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Security, privacy, and compliance resources
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-[15px]">
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
                className="group relative flex flex-col border border-zinc-900 bg-zinc-950/50 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900/40"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-5 w-5 text-indigo-400" strokeWidth={1.5} />
                  <ArrowRight className="h-4 w-4 text-zinc-600 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {card.description}
                </p>
              </Link>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-zinc-500">
          Questions?{" "}
          <a
            href="mailto:security@pulsedata.io"
            className="text-indigo-400 hover:text-indigo-300"
          >
            security@pulsedata.io
          </a>
          {" · "}
          <a
            href="mailto:privacy@pulsedata.io"
            className="text-indigo-400 hover:text-indigo-300"
          >
            privacy@pulsedata.io
          </a>
          {" · "}
          <a
            href="mailto:legal@pulsedata.io"
            className="text-indigo-400 hover:text-indigo-300"
          >
            legal@pulsedata.io
          </a>
        </p>
      </main>

      <Footer />
    </div>
  );
}
