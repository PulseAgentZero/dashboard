import { api } from "./client";
import type { NotificationsResponse } from "@/types/notifications";

export const notificationsApi = {
  list: (params?: { unread_only?: boolean; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.unread_only) qs.set("unread_only", "true");
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    return api.get<NotificationsResponse>(`/notifications${q ? `?${q}` : ""}`);
  },
  markRead: (id: string) =>
    api.post<void>(`/notifications/${id}/read`, {}),
  markAllRead: () =>
    api.post<void>("/notifications/read-all", {}),
};
