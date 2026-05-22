import type { PublicDashboard } from "@/types/studio";

const _apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = _apiUrl !== undefined ? _apiUrl : "http://localhost:8000";
const PUBLIC_PREFIX = "/api/public/v1/studio";

export class PublicApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "PublicApiError";
  }
}

async function publicGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${PUBLIC_PREFIX}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = body.error ?? {};
    throw new PublicApiError(
      res.status,
      err.code ?? "UNKNOWN",
      err.message ?? res.statusText,
    );
  }
  const json = await res.json();
  return (json.data ?? json) as T;
}

export const studioPublicApi = {
  getDashboardBySlug: (slug: string, filterParams: Record<string, string> = {}) => {
    const sp = new URLSearchParams(filterParams);
    const q = sp.toString();
    return publicGet<PublicDashboard>(`/dashboards/${slug}${q ? `?${q}` : ""}`);
  },

  getDashboardByEmbedToken: (token: string, filterParams: Record<string, string> = {}) => {
    const sp = new URLSearchParams(filterParams);
    const q = sp.toString();
    return publicGet<PublicDashboard>(`/embed/${token}${q ? `?${q}` : ""}`);
  },
};
