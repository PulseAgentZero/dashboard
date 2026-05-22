import { api } from "./client";

export type WebhookDeliveriesResponse = {
  deliveries: WebhookDelivery[];
  total: number;
  page: number;
  limit: number;
};

export type WebhookDelivery = {
  id: string;
  channel_id: string;
  event_type: string;
  status: string;
  response_status: number | null;
  attempts: number;
  last_attempt_at: string | null;
  created_at: string;
};

export type LicenseInfo = {
  id?: string | null;
  plan: string;
  effective_plan?: string;
  is_valid: boolean;
  locked?: boolean;
  lock_reason?: string | null;
  expires_at: string | null;
  seats?: number | null;
  seat_limit?: number | null;
  seat_used?: number;
  features: string[];
  effective_features?: string[];
  limits?: Record<string, number>;
  effective_limits?: Record<string, number>;
  issued_to?: string | null;
};

export const webhooksApi = {
  listDeliveries: (params?: { page?: number; limit?: number; status?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.status) qs.set("status", params.status);
    const q = qs.toString();
    return api.get<WebhookDeliveriesResponse | WebhookDelivery[]>(
      `/webhooks/deliveries${q ? `?${q}` : ""}`,
    );
  },

  retry: (id: string) =>
    api.post<{ message: string }>(`/webhooks/deliveries/${id}/retry`, {}),
};

export const licenseApi = {
  get: () => api.get<LicenseInfo>("/license"),

  activate: (key: string) =>
    api.post<LicenseInfo>("/license/activate", { license_key: key }),
};
