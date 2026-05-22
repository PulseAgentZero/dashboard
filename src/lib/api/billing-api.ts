import { api, ApiError } from "./client";

export type InitializePaymentResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type CloudPlanTier = "pro" | "growth";

export type SubscriptionResponse = {
  plan: string;
  effective_plan?: string;
  status: string;
  paystack_subscription_code: string | null;
  next_payment_date: string | null;
  payment_failed_at?: string | null;
  grace_ends_at?: string | null;
  payment_attention?: boolean;
  manage_link_available?: boolean;
  updated_at: string | null;
};

export type ManageLinkResponse = {
  link: string;
};

export type SelfHostedVerifyResponse = {
  status: string;
  message: string;
  license_key: string | null;
};

export type PortalRequestLinkResponse = {
  status: string;
  message: string;
};

export type PortalExchangeResponse = {
  portal_token: string;
  email: string;
  expires_in: number;
};

export type PortalLicenseRow = {
  jti: string;
  plan: string;
  features: string[];
  seat_limit: number | null;
  expires_at: string | null;
  revoked_at: string | null;
  issued_at: string;
  payment_reference: string;
  license_key_preview: string;
};

export type PortalLicensesResponse = {
  email: string;
  licenses: PortalLicenseRow[];
};

export type PortalResendResponse = {
  status: string;
  message: string;
};

export const billingApi = {
  initializeCloud: (body: { callback_url: string; plan?: CloudPlanTier }) =>
    api.post<InitializePaymentResponse>("/billing/initialize", {
      callback_url: body.callback_url,
      plan: body.plan ?? "pro",
    }),

  verifyCloud: (reference: string) =>
    api.get<SubscriptionResponse>(`/billing/verify/${encodeURIComponent(reference)}`),

  getSubscription: () => api.get<SubscriptionResponse>("/billing/subscription"),

  getManageLink: () =>
    api.get<ManageLinkResponse>("/billing/subscription/manage-link"),

  cancelSubscription: () =>
    api.post<SubscriptionResponse>("/billing/subscription/cancel", {}),

  initializeSelfHosted: (body: { email: string; callback_url: string }) =>
    api.post<InitializePaymentResponse>("/billing/self-hosted/initialize", body),

  verifySelfHosted: (reference: string) =>
    api.get<SelfHostedVerifyResponse>(
      `/billing/self-hosted/verify/${encodeURIComponent(reference)}`,
    ),
};

// ── License customer portal ─────────────────────────────────────────────────
//
// The portal endpoints are intentionally separate from the cloud-auth client.
// They are anonymous (request-link / exchange) or authenticated by a *portal*
// session JWT — not the cloud user JWT. We use plain fetch so the shared
// `api` helper never attaches the cloud `Authorization: Bearer <user-jwt>`
// header and never clears cloud tokens on 401.

const _portalApiUrl = process.env.NEXT_PUBLIC_API_URL;
const PORTAL_BASE_URL = _portalApiUrl !== undefined ? _portalApiUrl : "http://localhost:8000";
const PORTAL_PREFIX = "/api/v1";

async function portalFetch<T>(
  path: string,
  init: RequestInit & { portalToken?: string } = {},
): Promise<T> {
  const { portalToken, headers, ...rest } = init;
  const res = await fetch(`${PORTAL_BASE_URL}${PORTAL_PREFIX}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(portalToken ? { Authorization: `Bearer ${portalToken}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = body.error ?? body.detail ?? {};
    const errObj = typeof err === "object" && err !== null ? err : {};
    const code = (errObj as { code?: string }).code ?? "UNKNOWN";
    const message =
      (errObj as { message?: string }).message ??
      res.statusText ??
      "Request failed";
    throw new ApiError(res.status, code, message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const licensePortalApi = {
  requestLink: (body: { email: string; callback_url: string }) =>
    portalFetch<PortalRequestLinkResponse>(
      "/billing/self-hosted/portal/request-link",
      { method: "POST", body: JSON.stringify(body) },
    ),

  exchange: (token: string) =>
    portalFetch<PortalExchangeResponse>(
      "/billing/self-hosted/portal/exchange",
      { method: "POST", body: JSON.stringify({ token }) },
    ),

  listLicenses: (portalToken: string) =>
    portalFetch<PortalLicensesResponse>(
      "/billing/self-hosted/portal/licenses",
      { portalToken },
    ),

  resend: (portalToken: string, jti: string) =>
    portalFetch<PortalResendResponse>(
      `/billing/self-hosted/portal/licenses/${encodeURIComponent(jti)}/resend`,
      { method: "POST", body: "{}", portalToken },
    ),
};
