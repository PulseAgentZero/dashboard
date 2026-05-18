import fs from "fs";
import path from "path";
import {
  getLegalPageMeta,
  LEGAL_PAGES,
  type LegalPageMeta,
} from "./pages";

const LEGAL_DIR = path.join(process.cwd(), "content/legal");

export type LegalContent = {
  slug: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: string | null;
};

function extractTitle(markdown: string, fallback: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

function parseFrontmatter(raw: string): {
  body: string;
  lastUpdated: string | null;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { body: raw, lastUpdated: null };

  const frontmatter = match[1];
  const lastUpdatedMatch = frontmatter.match(/^lastUpdated:\s*(.+)$/m);
  return {
    body: match[2],
    lastUpdated: lastUpdatedMatch?.[1]?.trim() ?? null,
  };
}

export function getLegalPageBySlug(slug: string): LegalContent | null {
  const meta = getLegalPageMeta(slug);
  if (!meta) return null;

  const filePath = path.join(LEGAL_DIR, `${meta.file}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { body, lastUpdated } = parseFrontmatter(raw);

  return {
    slug,
    title: extractTitle(body, meta.title),
    description: meta.description,
    content: body,
    lastUpdated,
  };
}

export function getAllLegalSlugs(): string[] {
  return LEGAL_PAGES.map((p) => p.slug);
}

export function getLegalPageMetaForSlug(slug: string): LegalPageMeta | undefined {
  return getLegalPageMeta(slug);
}
