import { api } from "./client";

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
