import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Docs links from the dashboard open in a new tab so users keep their session context. */
export function DashboardDocsLink({ href, children, className }: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </Link>
  );
}

export function isDocsHref(href: string): boolean {
  return href === "/docs" || href.startsWith("/docs/");
}
