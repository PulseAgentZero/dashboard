import { api } from "./client";

export type ApiKey = {
  id: string;
  name: string;
  scope: string;
  key_prefix: string;
  expires_at: string | null;
  created_at: string;
  last_used_at: string | null;
};

export type ApiKeyCreateResponse = ApiKey & { key: string };

export type ApiKeysListResponse = {
  api_keys: ApiKey[];
};

export function parseApiKeysList(
  data: ApiKeysListResponse | ApiKey[] | null | undefined,
): ApiKey[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.api_keys ?? [];
}

export const apiKeysApi = {
  list: async (): Promise<ApiKey[]> => {
    const data = await api.get<ApiKeysListResponse | ApiKey[]>("/api-keys");
    return parseApiKeysList(data);
  },
  create: (body: { name: string; scope: string; expires_at?: string | null }) =>
    api.post<ApiKeyCreateResponse>("/api-keys", body),
  revoke: (id: string) => api.delete<void>(`/api-keys/${id}`),
};

export const llmKeysApi = {
  get: () => api.get<{ anthropic: string | null; groq: string | null }>("/settings/llm-keys"),
  update: (body: { anthropic?: string | null; groq?: string | null }) =>
    api.put<{ anthropic: string | null; groq: string | null }>("/settings/llm-keys", body),
};
