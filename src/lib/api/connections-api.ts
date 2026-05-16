import { api } from "./client";
import type {
  ConnectorCatalogItem,
  ConnectionResponse,
  TestConnectionResponse,
  EntityDetail,
  EntityRiskHistory,
} from "@/types/connections";

export const connectionsFullApi = {
  list: () => api.get<ConnectionResponse[]>("/connections"),
  catalog: () => api.get<ConnectorCatalogItem[]>("/connections/catalog"),
  create: (body: Record<string, unknown>) =>
    api.post<ConnectionResponse>("/connections", body),
  test: (id: string) =>
    api.post<TestConnectionResponse>(`/connections/${id}/test`, {}),
  delete: (id: string) => api.delete<void>(`/connections/${id}`),
};

export const entitiesFullApi = {
  get: (entityId: string) =>
    api.get<EntityDetail>(`/entities/${encodeURIComponent(entityId)}`),
  riskHistory: (entityId: string, period = "30d") =>
    api.get<EntityRiskHistory>(
      `/entities/${encodeURIComponent(entityId)}/risk-history?period=${period}`,
    ),
};
