import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocsArticle } from "@/components/docs/docs-article";
import { getDocBySlug } from "@/lib/docs/get-doc";
import { getAllDocSlugs, getDocNavItem } from "@/lib/docs/navigation";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

function resolveSlug(segments?: string[]): string {
  if (!segments || segments.length === 0) return "";
  return segments.join("/");
}

export async function generateStaticParams() {
  return getAllDocSlugs().map((slug) =>
    slug === "" ? { slug: [] } : { slug: slug.split("/") },
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = resolveSlug(segments);
  const nav = getDocNavItem(slug);
  const doc = getDocBySlug(slug);
  const title = doc?.title ?? nav?.title ?? "Documentation";
  return {
    title: `${title} | Entivia Docs`,
    description: `Entivia documentation — ${title}`,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug: segments } = await params;
  const slug = resolveSlug(segments);
  const doc = getDocBySlug(slug);

  if (!doc) notFound();

  return <DocsArticle slug={slug} content={doc.content} />;
}
