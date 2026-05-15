import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const API_PREFIX = "/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("pulse_access_token")
      : null;

  const res = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // Backend error envelope: { "error": { "code", "message", "fields"? } }
    const err = body.error ?? {};
    const apiErr = new ApiError(
      res.status,
      err.code ?? "UNKNOWN",
      err.message ?? res.statusText,
      err.fields,
    );

    // 401 = expired session — clear tokens and let the page handle redirect
    if (res.status === 401) {
      localStorage.removeItem("pulse_access_token");
      localStorage.removeItem("pulse_refresh_token");
    }

    // Global toast for server/network errors — callers handle 4xx themselves
    if (res.status >= 500) {
      toast.error("Server error. Please try again.");
    }

    throw apiErr;
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
