import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectionsFullApi } from "@/lib/api/connections-api";

export function useConnections() {
  return useQuery({
    queryKey: ["connections"],
    queryFn: connectionsFullApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useConnectionCatalog() {
  return useQuery({
    queryKey: ["connections", "catalog"],
    queryFn: connectionsFullApi.catalog,
    staleTime: Infinity,
  });
}

export function useCreateConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      connectionsFullApi.create(body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["connections"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Connection created and verified");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Connection failed";
      toast.error(msg);
    },
  });
}

export function useTestConnection() {
  return useMutation({
    mutationFn: (id: string) => connectionsFullApi.test(id),
    onSuccess: (data) => {
      toast.success(data.message || "Connection test passed");
    },
    onError: () => toast.error("Connection test failed"),
  });
}

export function useDeleteConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectionsFullApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["connections"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Connection removed");
    },
    onError: () => toast.error("Failed to remove connection"),
  });
}
