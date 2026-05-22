import type { Org, User } from "@/types/auth";

const REDIRECT_STORAGE_KEY = "pulse_post_auth_redirect";

const ALLOWED_REDIRECT_PREFIXES = ["/dashboard", "/pricing", "/p/"] as const;

export function sanitizePostAuthRedirect(
  redirect: string | null | undefined,
): string | null {
  if (!redirect) return null;
  const path = redirect.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  const ok = ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`),
  );
  return ok ? path : null;
}

/** Persist redirect across OAuth / 2FA hops (login page should call this on mount). */
export function savePostAuthRedirect(redirect: string | null | undefined) {
  if (typeof window === "undefined") return;
  const safe = sanitizePostAuthRedirect(redirect);
  if (safe) {
    sessionStorage.setItem(REDIRECT_STORAGE_KEY, safe);
  }
}

function consumeStoredRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(REDIRECT_STORAGE_KEY);
  if (stored) {
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    return sanitizePostAuthRedirect(stored);
  }
  return null;
}

export function resolvePostAuthPath(redirectFromUrl?: string | null): string {
  return (
    consumeStoredRedirect() ??
    sanitizePostAuthRedirect(redirectFromUrl) ??
    "/dashboard"
  );
}

export function postAuthRedirect(
  _org: Pick<Org, "onboarding_done"> | null | undefined,
  router: { push: (href: string) => void },
  user?: Pick<User, "is_verified"> | null,
  redirectFromUrl?: string | null,
) {
  if (user && !user.is_verified) {
    router.push("/auth/verify-email?notice=1");
  } else {
    router.push(resolvePostAuthPath(redirectFromUrl));
  }
}
