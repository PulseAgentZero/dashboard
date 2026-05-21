import type { ZodType } from "zod";
import { ApiError } from "@/lib/api/client";

export type FieldErrors = Record<string, string>;

export function zodFieldErrors(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}): FieldErrors {
  const flat = error.flatten().fieldErrors;
  const out: FieldErrors = {};
  for (const [key, messages] of Object.entries(flat)) {
    const msg = messages?.[0];
    if (msg) out[key] = msg;
  }
  return out;
}

export function parseWithSchema<T>(
  schema: ZodType<T>,
  data: unknown,
): { ok: true; data: T } | { ok: false; errors: FieldErrors; message: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { ok: true, data: result.data };
  }
  const errors = zodFieldErrors(result.error);
  const message =
    Object.values(errors)[0] ?? "Please fix the errors below.";
  return { ok: false, errors, message };
}

export function formDataToRecord(form: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  form.forEach((value, key) => {
    if (typeof value === "string") out[key] = value;
  });
  return out;
}

/** API field keys may differ from form names; map common aliases here. */
const API_FIELD_ALIASES: Record<string, string> = {
  new_password: "password",
  current_password: "current_password",
  org_name: "org_name",
  full_name: "name",
};

/** Maps API validation keys to form field names used in controlled inputs. */
const API_FIELD_FORM_ALIASES: Record<string, string> = {
  new_password: "next",
  current_password: "current",
  full_name: "name",
};

function mapApiFieldKey(key: string): string {
  return API_FIELD_FORM_ALIASES[key] ?? API_FIELD_ALIASES[key] ?? key;
}

export function normalizeApiFieldErrors(
  fields: Record<string, string>,
): FieldErrors {
  const out: FieldErrors = {};
  for (const [key, message] of Object.entries(fields)) {
    out[mapApiFieldKey(key)] = message;
  }
  return out;
}

export function apiErrorFields(err: unknown): FieldErrors | null {
  if (!(err instanceof ApiError) || !err.fields) return null;
  const keys = Object.keys(err.fields);
  if (keys.length === 0) return null;
  return normalizeApiFieldErrors(err.fields);
}

export function shouldDeferMutationToast(err: unknown): boolean {
  return apiErrorFields(err) !== null;
}
