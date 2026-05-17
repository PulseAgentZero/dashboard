import { api } from "./client";

export type AuditLog = {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AuditLogsResponse = {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
};

export const auditApi = {
  list: (params?: { page?: number; limit?: number; action?: string; user_id?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.action) qs.set("action", params.action);
    if (params?.user_id) qs.set("user_id", params.user_id);
    const q = qs.toString();
    return api.get<AuditLogsResponse | AuditLog[]>(`/audit-logs${q ? `?${q}` : ""}`);
  },
};
