import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiKeysApi, llmKeysApi } from "@/lib/api/apikeys-api";

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: apiKeysApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; scope: string; expires_at?: string | null }) =>
      apiKeysApi.create(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: () => toast.error("Failed to create API key"),
  });
}

export function useRevokeApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.revoke(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["api-keys"] });
      toast.success("API key revoked");
    },
    onError: () => toast.error("Failed to revoke key"),
  });
}

export function useLlmKeys() {
  return useQuery({
    queryKey: ["settings", "llm-keys"],
    queryFn: llmKeysApi.get,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useUpdateLlmKeys() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { anthropic?: string | null; groq?: string | null }) =>
      llmKeysApi.update(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["settings", "llm-keys"] });
      toast.success("LLM keys updated");
    },
    onError: () => toast.error("Failed to update LLM keys"),
  });
}
