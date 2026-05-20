/**
 * Cross-subdomain URL helpers.
 *
 * The Entivia frontend Next.js bundle is served on three origins in production:
 *
 *  - entivia.online        — marketing pages (apex)
 *  - app.entivia.online    — the dashboard / auth surface
 *  - docs.entivia.online   — product docs (rewrites all paths under /docs)
 *
 * Links rendered on the docs subdomain that point at `/auth/login` resolve to
 * `docs.entivia.online/auth/login`, which the nginx rewrite turns into
 * `/docs/auth/login` and renders a 404. To navigate to the auth/app surface
 * from docs, build an absolute URL pointing at the app origin via
 * `NEXT_PUBLIC_APP_URL`.
 *
 * In local development none of these env vars need to be set — the helpers
 * fall back to relative paths so `npm run dev` keeps working unchanged.
 */

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

function joinPath(base: string, path: string): string {
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${safePath}`;
}

export function getAppUrl(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_APP_URL ?? "");
}

export function getMarketingUrl(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_MARKETING_URL ?? "");
}

/**
 * URL for an app-surface route (auth, dashboard). Returns an absolute URL when
 * `NEXT_PUBLIC_APP_URL` is configured (production docs subdomain), otherwise a
 * relative path so local dev and same-origin renders are unaffected.
 */
export function appHref(path: string): string {
  const base = getAppUrl();
  return base ? joinPath(base, path) : path;
}

/**
 * URL for a marketing route (apex domain). Falls back to a relative path when
 * `NEXT_PUBLIC_MARKETING_URL` is unset.
 */
export function marketingHref(path: string = "/"): string {
  const base = getMarketingUrl();
  return base ? joinPath(base, path) : path;
}
