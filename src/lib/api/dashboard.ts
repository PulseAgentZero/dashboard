import { api } from "./client";
import type {
  DashboardOverview,
  EntitiesResponse,
  RecommendationsResponse,
  Recommendation,
  Connection,
} from "@/types/dashboard";

export const dashboardApi = {
  overview: () => api.get<DashboardOverview>("/dashboard/overview"),
};

export const recommendationsApi = {
  get: (id: string) => api.get<Recommendation>(`/recommendations/${id}`),
  list: (params?: {
    status?: string;
    urgency?: string;
    limit?: number;
    page?: number;
  }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.urgency) qs.set("urgency", params.urgency);
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.page) qs.set("page", String(params.page));
    const q = qs.toString();
    return api.get<RecommendationsResponse>(
      `/recommendations${q ? `?${q}` : ""}`,
    );
  },
  action: (id: string, outcome_notes?: string) =>
    api.post<Recommendation>(`/recommendations/${id}/action`, {
      outcome_notes,
    }),
  dismiss: (id: string, reason?: string) =>
    api.post<Recommendation>(`/recommendations/${id}/dismiss`, { reason }),
  escalate: (id: string) =>
    api.post<Recommendation>(`/recommendations/${id}/escalate`, {}),
};

export const entitiesApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    risk_tier?: string;
    segment?: string;
    search?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.risk_tier) qs.set("risk_tier", params.risk_tier);
    if (params?.segment) qs.set("segment", params.segment);
    if (params?.search) qs.set("search", params.search);
    const q = qs.toString();
    return api.get<EntitiesResponse>(`/entities${q ? `?${q}` : ""}`);
  },
};

export const connectionsApi = {
  list: () => api.get<Connection[]>("/connections"),
};
