import fs from "fs";
import path from "path";
import { getDocNavItem } from "./navigation";

const DOCS_DIR = path.join(process.cwd(), "content/docs");

export type DocContent = {
  title: string;
  slug: string;
  content: string;
};

function extractTitle(markdown: string, fallback: string): string {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? fallback;
}

export function getDocBySlug(slug: string): DocContent | null {
  const navItem = getDocNavItem(slug);
  if (!navItem?.file) return null;

  const filePath = path.join(DOCS_DIR, `${navItem.file}.md`);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, "utf-8");
  return {
    title: extractTitle(content, navItem.title),
    slug,
    content,
  };
}

export function getAllDocFiles(): string[] {
  if (!fs.existsSync(DOCS_DIR)) return [];
  return fs
    .readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
