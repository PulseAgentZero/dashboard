import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  logStreamsApi,
  type LogStreamBody,
} from "@/lib/api/log-streams-api";
import { isSelfHostedDeployment } from "@/lib/deployment";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";

export function useLogStreams() {
  const enabled = useAuthEnabled() && isSelfHostedDeployment();
  return useQuery({
    queryKey: ["log-streams"],
    queryFn: async () => {
      const res = await logStreamsApi.list();
      return res.streams ?? [];
    },
    enabled,
    staleTime: 30_000,
  });
}

export function useCreateLogStream() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: LogStreamBody) => logStreamsApi.create(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["log-streams"] });
      toast.success("Log stream created");
    },
    onError: () => toast.error("Failed to create log stream"),
  });
}

export function useUpdateLogStream() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: LogStreamBody }) =>
      logStreamsApi.update(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["log-streams"] });
      toast.success("Log stream updated");
    },
    onError: () => toast.error("Failed to update log stream"),
  });
}

export function useDeleteLogStream() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => logStreamsApi.remove(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["log-streams"] });
      toast.success("Log stream deleted");
    },
    onError: () => toast.error("Failed to delete log stream"),
  });
}

export function useTestLogStream() {
  return useMutation({
    mutationFn: (id: string) => logStreamsApi.test(id),
    onSuccess: (data) => {
      if (data.success) toast.success("Test event delivered");
      else toast.error(data.error ?? "Delivery failed");
    },
    onError: () => toast.error("Test failed"),
  });
}
