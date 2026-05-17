import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agentApi } from "@/lib/api/agent-api";

export function useConversations() {
  return useQuery({
    queryKey: ["agent", "conversations"],
    queryFn: agentApi.listConversations,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: ["agent", "conversations", id],
    queryFn: () => agentApi.getConversation(id!),
    enabled: !!id,
    staleTime: 0,
    retry: 1,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: agentApi.createConversation,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["agent", "conversations"] });
    },
  });
}

export function useChat(conversationId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => agentApi.chat(conversationId!, content),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["agent", "conversations", conversationId] });
    },
  });
}
