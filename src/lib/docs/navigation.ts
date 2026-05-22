export type DocNavItem = {
  title: string;
  slug: string;
  file?: string;
};

export type DocNavSection = {
  title: string;
  items: DocNavItem[];
};

/** Sidebar navigation — slug maps to content/docs/{file}.md */
export const DOCS_NAV: DocNavSection[] = [
  {
    title: "Guides",
    items: [
      { title: "Introduction", slug: "", file: "introduction" },
      { title: "Getting started", slug: "getting-started", file: "getting-started" },
      { title: "Product features", slug: "features", file: "features" },
      {
        title: "Supported data sources",
        slug: "data-sources",
        file: "data-sources",
      },
      { title: "Architecture", slug: "architecture", file: "architecture" },
    ],
  },
  {
    title: "Hosting",
    items: [
      { title: "Entivia Cloud (SaaS)", slug: "hosting/cloud", file: "hosting-cloud" },
      {
        title: "Self-hosted",
        slug: "hosting/self-hosted",
        file: "hosting-self-hosted",
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Environment variables",
        slug: "configuration/environment-variables",
        file: "configuration-environment-variables",
      },
      {
        title: "Redis, email & storage",
        slug: "configuration/redis-email-storage",
        file: "configuration-redis-email-storage",
      },
      {
        title: "License activation",
        slug: "configuration/license",
        file: "configuration-license",
      },
      {
        title: "Log streaming",
        slug: "configuration/log-streaming",
        file: "configuration-log-streaming",
      },
    ],
  },
  {
    title: "API reference",
    items: [
      { title: "Overview", slug: "api/overview", file: "api-overview" },
      {
        title: "Authentication",
        slug: "api/authentication",
        file: "api-authentication",
      },
      { title: "Entities", slug: "api/entities", file: "api-entities" },
      {
        title: "Recommendations",
        slug: "api/recommendations",
        file: "api-recommendations",
      },
      { title: "Analytics", slug: "api/analytics", file: "api-analytics" },
      { title: "Pipeline", slug: "api/pipeline", file: "api-pipeline" },
      { title: "Studio (public)", slug: "api/studio", file: "api-studio" },
      { title: "Errors & limits", slug: "api/errors", file: "api-errors" },
    ],
  },
];

export function getAllDocSlugs(): string[] {
  return DOCS_NAV.flatMap((section) =>
    section.items.map((item) => item.slug),
  );
}

export function getDocNavItem(slug: string): DocNavItem | undefined {
  for (const section of DOCS_NAV) {
    const item = section.items.find((i) => i.slug === slug);
    if (item) return item;
  }
  return undefined;
}

export function getDocHref(slug: string): string {
  return slug ? `/docs/${slug}` : "/docs";
}

export function getPrevNext(slug: string): {
  prev: DocNavItem | null;
  next: DocNavItem | null;
} {
  const flat = DOCS_NAV.flatMap((s) => s.items);
  const idx = flat.findIndex((i) => i.slug === slug);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? flat[idx - 1]! : null,
    next: idx < flat.length - 1 ? flat[idx + 1]! : null,
  };
}
