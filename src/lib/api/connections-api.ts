import { api } from "./client";
import { uploadMultipart } from "./upload";
import type {
  ConnectorCatalogItem,
  ConnectionResponse,
  FileUploadBatchResponse,
  TestConnectionResponse,
  EntityDetail,
  EntityRiskHistory,
} from "@/types/connections";

const API_V1_PREFIX = "/api/v1";

/** Catalog returns full paths like `/api/v1/connections/upload`; uploadMultipart adds `/api/v1` again. */
export function resolveConnectionUploadPath(uploadEndpoint: string): string {
  const trimmed = uploadEndpoint.trim();
  if (trimmed.startsWith(API_V1_PREFIX)) {
    return trimmed.slice(API_V1_PREFIX.length) || "/connections/upload";
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export type UploadConnectionParams = {
  file: File;
  name: string;
  connectorType: string;
  uploadEndpoint: string;
};

export const connectionsFullApi = {
  list: () => api.get<ConnectionResponse[]>("/connections"),
  catalog: () => api.get<ConnectorCatalogItem[]>("/connections/catalog"),
  create: (body: Record<string, unknown>) =>
    api.post<ConnectionResponse>("/connections", body),
  upload: ({ file, name, connectorType, uploadEndpoint }: UploadConnectionParams) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("name", name);
    fd.append("connector_type", connectorType);
    return uploadMultipart<ConnectionResponse>(
      resolveConnectionUploadPath(uploadEndpoint),
      fd,
    );
  },
  uploadBatch: (files: File[], uploadEndpoint: string) => {
    const base = resolveConnectionUploadPath(uploadEndpoint);
    const batchPath = base.endsWith("/upload") ? `${base}/batch` : "/connections/upload/batch";
    const fd = new FormData();
    for (const file of files) {
      fd.append("files", file);
    }
    return uploadMultipart<FileUploadBatchResponse>(batchPath, fd);
  },
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
