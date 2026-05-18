import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/legal/legal-layout";
import { getLegalPageBySlug } from "@/lib/legal/get-legal-page";
import { getLegalPageMeta } from "@/lib/legal/pages";

export function generateMetadata(): Metadata {
  const meta = getLegalPageMeta("terms");
  return {
    title: `${meta?.title ?? "Terms of Service"} | Pulse`,
    description: meta?.description,
  };
}

export default function TermsPage() {
  const doc = getLegalPageBySlug("terms");
  if (!doc) notFound();

  return <LegalLayout content={doc.content} lastUpdated={doc.lastUpdated} />;
}
