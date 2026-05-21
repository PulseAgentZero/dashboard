import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  connectionSchemaApi,
  schemaMappingsApi,
} from "@/lib/api/schema-mappings-api";
import type {
  CreateSchemaMappingRequest,
  UpdateSchemaMappingRequest,
} from "@/types/schema-mapping";

export function useSchemaMappings() {
  return useQuery({
    queryKey: ["schema-mappings"],
    queryFn: schemaMappingsApi.list,
    staleTime: 30_000,
    retry: 1,
  });
}

export function useConnectionTables(
  connectionId: string | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ["connections", connectionId, "tables"],
    queryFn: () => connectionSchemaApi.listTables(connectionId!),
    enabled: Boolean(connectionId) && enabled,
    staleTime: 60_000,
    retry: 1,
  });
}

export function useCreateSchemaMapping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateSchemaMappingRequest) => schemaMappingsApi.create(body),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: ["schema-mappings"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      if (data.pipeline_triggered) {
        void qc.invalidateQueries({ queryKey: ["pipeline"] });
        toast.success("Mapping saved — your first pipeline run has started");
      } else {
        toast.success("Data mapping saved");
      }
    },
    onError: () => toast.error("Failed to save data mapping"),
  });
}

export function useUpdateSchemaMapping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateSchemaMappingRequest }) =>
      schemaMappingsApi.update(id, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["schema-mappings"] });
      toast.success("Data mapping updated");
    },
    onError: () => toast.error("Failed to update data mapping"),
  });
}

export function useDeleteSchemaMapping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => schemaMappingsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["schema-mappings"] });
      toast.success("Data mapping removed");
    },
    onError: () => toast.error("Failed to remove data mapping"),
  });
}
