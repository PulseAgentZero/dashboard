import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NEXT_PUBLIC_* vars are baked in at build time, so this evaluates once per build.
const SELF_HOSTED = process.env.NEXT_PUBLIC_DEPLOYMENT_MODE === "self_hosted";

function docsRewriteHostname(): string {
  const raw = process.env.NEXT_PUBLIC_DOCS_URL ?? "";
  if (!raw) return "docs.entivia.online";
  try {
    const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(normalized).hostname;
  } catch {
    return "docs.entivia.online";
  }
}

const DOCS_HOST = docsRewriteHostname();

const DOCS_PASSTHROUGH_PREFIXES = ["/_next/", "/connectors/"];
const DOCS_PASSTHROUGH_EXACT = new Set([
  "/favicon.ico",
  "/logo.svg",
  "/robots.txt",
  "/sitemap.xml",
]);

function isDocsStaticRootAsset(pathname: string): boolean {
  return /\.(?:svg|png|jpg|jpeg|gif|ico|webp|avif|woff2?|ttf|otf|eot|map|txt|xml|json|webmanifest)$/i.test(
    pathname,
  );
}

function shouldPassthroughOnDocsHost(pathname: string): boolean {
  if (
    DOCS_PASSTHROUGH_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    DOCS_PASSTHROUGH_EXACT.has(pathname) ||
    isDocsStaticRootAsset(pathname)
  ) {
    return true;
  }
  return pathname.startsWith("/docs");
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0] ?? "";
  const { pathname } = request.nextUrl;

  // docs.* serves pages at /, /getting-started, … internally mapped to /docs/*
  if (host === DOCS_HOST) {
    if (shouldPassthroughOnDocsHost(pathname)) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/docs" : `/docs${pathname}`;
    return NextResponse.rewrite(url);
  }

  // In self-hosted mode the landing page is irrelevant — send users straight to login.
  if (SELF_HOSTED && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image).*)",
  ],
};
