import { api } from "./client";

export type InitializePaymentResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

export type SubscriptionResponse = {
  plan: string;
  status: string;
  paystack_subscription_code: string | null;
  next_payment_date: string | null;
  updated_at: string | null;
};

export type SelfHostedVerifyResponse = {
  status: string;
  message: string;
  license_key: string | null;
};

export const billingApi = {
  initializeCloud: (callback_url: string) =>
    api.post<InitializePaymentResponse>("/billing/initialize", { callback_url }),

  verifyCloud: (reference: string) =>
    api.get<SubscriptionResponse>(`/billing/verify/${encodeURIComponent(reference)}`),

  getSubscription: () => api.get<SubscriptionResponse>("/billing/subscription"),

  cancelSubscription: () =>
    api.post<SubscriptionResponse>("/billing/subscription/cancel", {}),

  initializeSelfHosted: (body: { email: string; callback_url: string }) =>
    api.post<InitializePaymentResponse>("/billing/self-hosted/initialize", body),

  verifySelfHosted: (reference: string) =>
    api.get<SelfHostedVerifyResponse>(
      `/billing/self-hosted/verify/${encodeURIComponent(reference)}`,
    ),
};
