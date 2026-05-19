import { api } from "./client";
import type {
  CreateSchemaMappingRequest,
  IntrospectTablesResponse,
  SchemaMapping,
  UpdateSchemaMappingRequest,
} from "@/types/schema-mapping";

export const schemaMappingsApi = {
  list: () => api.get<SchemaMapping[]>("/schema-mappings"),

  get: (id: string) => api.get<SchemaMapping>(`/schema-mappings/${id}`),

  create: (body: CreateSchemaMappingRequest) =>
    api.post<SchemaMapping>("/schema-mappings", body),

  update: (id: string, body: UpdateSchemaMappingRequest) =>
    api.patch<SchemaMapping>(`/schema-mappings/${id}`, body),

  delete: (id: string) => api.delete<void>(`/schema-mappings/${id}`),
};

export const connectionSchemaApi = {
  listTables: (connectionId: string) =>
    api.get<IntrospectTablesResponse>(`/connections/${connectionId}/tables`),
};
