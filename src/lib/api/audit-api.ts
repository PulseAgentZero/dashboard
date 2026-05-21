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

type AuditLogApiRow = AuditLog & {
  user?: { email?: string | null } | null;
  resource?: string | null;
};

function normalizeAuditLog(row: AuditLogApiRow): AuditLog {
  return {
    ...row,
    user_email: row.user_email ?? row.user?.email ?? null,
    resource_type: row.resource_type ?? row.resource ?? null,
  };
}

export const auditApi = {
  list: async (params?: {
    page?: number;
    limit?: number;
    action?: string;
    user_id?: string;
  }): Promise<AuditLogsResponse> => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.action) qs.set("action", params.action);
    if (params?.user_id) qs.set("user_id", params.user_id);
    const q = qs.toString();
    const data = await api.get<AuditLogsResponse | AuditLogApiRow[]>(`/audit-logs${q ? `?${q}` : ""}`);
    if (Array.isArray(data)) {
      const logs = data.map(normalizeAuditLog);
      return { logs, total: logs.length, page: 1, limit: logs.length };
    }
    return {
      logs: data.logs.map(normalizeAuditLog),
      total: data.total,
      page: data.page,
      limit: data.limit,
    };
  },
};
