import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studioApi } from "@/lib/api/studio-api";

export function useStudioSchema(connectionId?: string) {
  return useQuery({
    queryKey: ["studio", "schema", connectionId ?? "default"],
    queryFn: () => studioApi.getSchema(connectionId),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}

export function useRefreshStudioSchema() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (connectionId?: string) => studioApi.refreshSchema(connectionId),
    onSuccess: (_data, connectionId) => {
      void qc.invalidateQueries({ queryKey: ["studio", "schema", connectionId ?? "default"] });
      toast.success("Schema refreshed");
    },
    onError: () => toast.error("Failed to refresh schema"),
  });
}
