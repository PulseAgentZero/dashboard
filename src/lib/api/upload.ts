import { tokens } from "@/lib/auth-tokens";
import { ApiError } from "./client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_PREFIX = "/api/v1";

function parseUploadError(res: Response, body: Record<string, unknown>): ApiError {
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
