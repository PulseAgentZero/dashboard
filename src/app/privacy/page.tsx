import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalLayout } from "@/components/legal/legal-layout";
import { getLegalPageBySlug } from "@/lib/legal/get-legal-page";
import { getLegalPageMeta } from "@/lib/legal/pages";

export function generateMetadata(): Metadata {
  const meta = getLegalPageMeta("privacy");
  return {
    title: `${meta?.title ?? "Privacy Policy"} | Pulse`,
    description: meta?.description,
  };
}

export default function PrivacyPage() {
  const doc = getLegalPageBySlug("privacy");
  if (!doc) notFound();

  return <LegalLayout content={doc.content} lastUpdated={doc.lastUpdated} />;
}
