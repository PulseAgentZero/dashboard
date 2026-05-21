import { tokens } from "@/lib/auth-tokens";
import { ApiError } from "./client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

/**
 * Default user-facing message for 413 responses — covers both the FastAPI
 * `payload_too_large` path and bare HTML 413s from nginx (when the file is
 * bigger than `client_max_body_size`, the request never reaches FastAPI so
 * the response body is HTML, not JSON).
 */
const DEFAULT_413_MESSAGE =
  "Your file is larger than the 500 MB upload limit. Split or compress the file and try again.";

function parseUploadError(res: Response, body: Record<string, unknown>): ApiError {
  if (res.status === 413) {
    const err = body.error as { code?: string; message?: string } | undefined;
    const detail = body.detail;
    const message =
      err?.message ||
      (typeof detail === "string"
        ? detail
        : detail && typeof detail === "object" && !Array.isArray(detail)
          ? (detail as { message?: string }).message
          : undefined) ||
      DEFAULT_413_MESSAGE;
    return new ApiError(res.status, err?.code ?? "PAYLOAD_TOO_LARGE", message);
  }

  const err = body.error as { code?: string; message?: string } | undefined;
  if (err?.message) {
    return new ApiError(res.status, err.code ?? "UNKNOWN", err.message);
  }
  const detail = body.detail;
  if (typeof detail === "string") {
    return new ApiError(res.status, "UNKNOWN", detail);
  }
  if (detail && typeof detail === "object" && !Array.isArray(detail)) {
    const d = detail as { code?: string; message?: string };
    return new ApiError(res.status, d.code ?? "UNKNOWN", d.message ?? res.statusText);
  }
  return new ApiError(res.status, "UNKNOWN", res.statusText);
}

export async function uploadMultipart<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  const token =
    typeof window !== "undefined" ? tokens.getAccess() : null;

  const res = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    throw parseUploadError(res, body);
  }

  return res.json() as Promise<T>;
}
