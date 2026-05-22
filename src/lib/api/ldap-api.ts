import { api } from "./client";

export type LdapConfig = {
  id: string;
  is_active: boolean;
  server_url: string;
  bind_dn: string;
  bind_password_set: boolean;
  user_search_base: string;
  user_search_filter: string;
  email_attr: string;
  name_attr: string;
  group_attr: string | null;
  default_role: string;
  role_mapping: Record<string, string>;
  sync_schedule_cron: string;
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_summary: Record<string, unknown> | null;
  updated_at: string;
};

export type LdapConfigBody = {
  is_active?: boolean;
  server_url: string;
  bind_dn: string;
  bind_password?: string | null;
  user_search_base: string;
  user_search_filter?: string;
  email_attr?: string;
  name_attr?: string;
  group_attr?: string | null;
  default_role?: string;
  role_mapping?: Record<string, string>;
  sync_schedule_cron?: string;
};

export const ldapApi = {
  get: () => api.get<{ config: LdapConfig | null }>("/ldap/config"),
  upsert: (body: LdapConfigBody) => api.put<{ config: LdapConfig }>("/ldap/config", body),
  remove: () => api.delete<{ message: string }>("/ldap/config"),
  testConnection: () =>
    api.post<{ success: boolean; message: string }>("/ldap/test-connection", {}),
  syncNow: () => api.post<Record<string, unknown>>("/ldap/sync-now", {}),
};
