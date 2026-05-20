import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { connectionsFullApi } from "@/lib/api/connections-api";
import { enrichConnectorCatalog } from "@/lib/connectors/catalog-enrich";

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
    queryFn: async () => enrichConnectorCatalog(await connectionsFullApi.catalog()),
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

export function useUploadConnection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: connectionsFullApi.upload,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["connections"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("File uploaded and connection created");
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    },
  });
}

export function useUploadConnectionsBatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      files,
      uploadEndpoint,
    }: {
      files: File[];
      uploadEndpoint: string;
    }) => connectionsFullApi.uploadBatch(files, uploadEndpoint),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: ["connections"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      const n = data.connections.length;
      if (n > 0) {
        toast.success(
          n === 1
            ? "File uploaded and connection created"
            : `${n} connections created from uploaded files`,
        );
      }
      if (data.errors.length > 0) {
        toast.warning(
          `${data.errors.length} file${data.errors.length === 1 ? "" : "s"} could not be uploaded`,
        );
      }
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Upload failed";
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
