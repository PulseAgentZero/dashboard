import { api } from "./client";

export type WebhookDelivery = {
  id: string;
  event_type: string;
  url: string;
  status: "success" | "failed" | "pending";
  response_status: number | null;
  attempts: number;
  last_attempt_at: string | null;
  created_at: string;
  payload?: Record<string, unknown>;
};

export type LicenseInfo = {
  id: string | null;
  plan: string;
  is_valid: boolean;
  expires_at: string | null;
  seats: number | null;
  features: string[];
  issued_to: string | null;
};

export const webhooksApi = {
  listDeliveries: (params?: { page?: number; limit?: number; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    return api.get<WebhookDelivery[]>(`/webhooks/deliveries${q ? `?${q}` : ""}`);
  },

  retry: (id: string) =>
    api.post<{ message: string }>(`/webhooks/deliveries/${id}/retry`, {}),
};

export const licenseApi = {
  get: () => api.get<LicenseInfo>("/license"),

  activate: (key: string) =>
    api.post<LicenseInfo>("/license", { license_key: key }),
};
