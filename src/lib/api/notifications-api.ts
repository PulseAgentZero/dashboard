import { api } from "./client";
import type {
  Notification,
  NotificationsApiResponse,
  NotificationsResponse,
} from "@/types/notifications";

function normalizeNotification(row: NotificationsApiResponse["notifications"][number]): Notification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    message: row.body,
    is_read: !!row.read_at,
    created_at: row.created_at,
    action_url: row.action_url,
    source: row.source,
  };
}

export const notificationsApi = {
  list: async (params?: {
    unread_only?: boolean;
    page?: number;
    limit?: number;
  }): Promise<NotificationsResponse> => {
    const qs = new URLSearchParams();
    if (params?.unread_only) qs.set("unread_only", "true");
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const q = qs.toString();
    const data = await api.get<NotificationsApiResponse>(`/notifications${q ? `?${q}` : ""}`);
    const limit = params?.limit ?? data.limit ?? 20;
    const page = params?.page ?? data.page ?? 1;
    const total = data.total ?? data.notifications.length;
    return {
      notifications: data.notifications.map(normalizeNotification),
      unread_count: data.unread_count,
      total,
      page,
      limit,
    };
  },
  markRead: (id: string) => api.post<void>(`/notifications/${id}/read`, {}),
  markAllRead: () => api.post<{ marked_read: number }>("/notifications/read-all", {}),
};
