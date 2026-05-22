import { toast } from "sonner";
import { tokens } from "@/lib/auth-tokens";

// Empty string = same-origin (self-hosted via nginx). Falls back to localhost for local dev.
const _apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = _apiUrl !== undefined ? _apiUrl : "http://localhost:8000";
const API_PREFIX = "/api/v1";

const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/signup",
  "/auth/refresh",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
];

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

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = tokens.getRefresh();
  if (!refresh) return null;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${BASE_URL}${API_PREFIX}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        });
        if (!res.ok) {
          tokens.clear();
          return null;
        }
        const data = await res.json();
        tokens.set(data.access_token, data.refresh_token);
        return data.access_token as string;
      } catch {
        tokens.clear();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

function shouldAttemptRefresh(path: string): boolean {
  return !NO_REFRESH_PATHS.some((p) => path.startsWith(p));
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retried = false,
): Promise<T> {
  const token =
    typeof window !== "undefined" ? tokens.getAccess() : null;

  const res = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (res.status === 401 && !retried && shouldAttemptRefresh(path)) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return request<T>(path, init, true);
    }
    if (typeof window !== "undefined") {
      tokens.clear();
      window.location.href = "/auth/login";
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = body.error ?? body.detail ?? {};
    const detail =
      typeof err === "object" && err !== null && !("code" in err) && "detail" in body
        ? body.detail
        : err;
    const errObj =
      typeof detail === "object" && detail !== null ? detail : err;
    const code = errObj.code ?? "UNKNOWN";
    const rawMessage = errObj.message ?? res.statusText;
    const fields = errObj.fields as Record<string, string> | undefined;
    const safeMessage =
      res.status >= 500 || code === "INTERNAL_ERROR"
        ? "Something went wrong. Please try again."
        : rawMessage;

    const apiErr = new ApiError(res.status, code, safeMessage, fields);

    if (res.status === 401 && !retried) {
      tokens.clear();
    }

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
  post: <T>(
    path: string,
    body: unknown,
    options?: { headers?: Record<string, string> },
  ) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      headers: options?.headers,
    }),
  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "DELETE",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
};
