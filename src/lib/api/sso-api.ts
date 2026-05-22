import { api } from "./client";

export type SsoConfig = {
  id: string;
  org_id: string;
  provider: "oidc" | "saml";
  is_active: boolean;
  client_id: string | null;
  client_secret_set: boolean;
  discovery_url: string | null;
  scopes: string | null;
  email_claim: string;
  name_claim: string;
  entity_id: string | null;
  metadata_url: string | null;
  metadata_xml_set: boolean;
  acs_url_path: string | null;
  name_id_format: string | null;
  default_role: string;
  auto_provision_users: boolean;
  allowed_email_domains: string[];
  updated_at: string;
};

export type SsoConfigBody = {
  provider: "oidc" | "saml";
  is_active?: boolean;
  client_id?: string | null;
  client_secret?: string | null;
  discovery_url?: string | null;
  scopes?: string | null;
  email_claim?: string;
  name_claim?: string;
  entity_id?: string | null;
  metadata_xml?: string | null;
  metadata_url?: string | null;
  default_role?: string;
  auto_provision_users?: boolean;
  allowed_email_domains?: string[];
};

export const ssoApi = {
  get: () => api.get<{ config: SsoConfig | null }>("/sso/config"),
  upsert: (body: SsoConfigBody) => api.put<{ config: SsoConfig }>("/sso/config", body),
  remove: () => api.delete<{ message: string }>("/sso/config"),
  publicStatus: async (orgSlug: string) => {
    const base =
      process.env.NEXT_PUBLIC_API_URL !== undefined
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:8000";
    const res = await fetch(
      `${base}/api/v1/auth/sso/${encodeURIComponent(orgSlug)}/status`,
    );
    if (!res.ok) return { enabled: false, provider: null };
    return res.json() as Promise<{ enabled: boolean; provider?: string | null }>;
  },
};
