export type LegalPageMeta = {
  slug: string;
  title: string;
  description: string;
  file: string;
};

export const LEGAL_PAGES: LegalPageMeta[] = [
  {
    slug: "terms",
    title: "Terms of Service",
    description:
      "Terms governing your use of Entivia Cloud, self-hosted deployments, and related services.",
    file: "terms",
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "How Entivia collects, uses, stores, and protects personal data on Entivia Cloud and self-hosted.",
    file: "privacy",
  },
  {
    slug: "security",
    title: "Security",
    description:
      "Security practices, shared responsibility, encryption, and vulnerability disclosure for Entivia.",
    file: "security",
  },
];

export function getLegalPageMeta(slug: string): LegalPageMeta | undefined {
  return LEGAL_PAGES.find((p) => p.slug === slug);
}
