import { api } from "./client";

export type AlertRule = {
  id: string;
  name: string;
  description: string | null;
  metric: string;
  operator: string;
  threshold: number | null;
  channel_ids: string[];
  cooldown_minutes: number;
  is_active: boolean;
  created_at: string;
};

export type AlertChannel = {
  id: string;
  name: string;
  type: string;
  config?: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  /** Present for webhook channels when returned by list API */
  events?: string[];
  url_hint?: string | null;
};

export type AlertEvent = {
  id: string;
  rule_id: string | null;
  rule_name: string | null;
  entity_id: string | null;
  severity: string | null;
  message: string | null;
  fired_at: string;
};

export const alertsApi = {
  listRules: () => api.get<AlertRule[]>("/alerts/rules"),
  createRule: (body: Omit<AlertRule, "id" | "is_active" | "created_at">) =>
    api.post<AlertRule>("/alerts/rules", body),
  updateRule: (id: string, body: Partial<Omit<AlertRule, "id" | "created_at">>) =>
    api.put<AlertRule>(`/alerts/rules/${id}`, body),
  deleteRule: (id: string) => api.delete<void>(`/alerts/rules/${id}`),

  listChannels: () => api.get<AlertChannel[]>("/alerts/channels"),
  createChannel: (body: { name: string; type: string; config?: Record<string, unknown> }) =>
    api.post<AlertChannel>("/alerts/channels", body),
  updateChannel: (id: string, body: { name?: string; config?: Record<string, unknown> }) =>
    api.put<AlertChannel>(`/alerts/channels/${id}`, body),
  deleteChannel: (id: string) => api.delete<void>(`/alerts/channels/${id}`),
  testChannel: (id: string) =>
    api.post<{ success: boolean; message: string }>(`/alerts/channels/${id}/test`, {}),

  listEvents: (params?: { rule_id?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.rule_id) qs.set("rule_id", params.rule_id);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return api.get<AlertEvent[]>(`/alerts/events${q ? `?${q}` : ""}`);
  },
};
