import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications-api";

export function useNotifications(
  unread_only = false,
  params?: { page?: number; limit?: number },
) {
  return useQuery({
    queryKey: ["notifications", { unread_only, ...params }],
    queryFn: () =>
      notificationsApi.list({
        unread_only,
        page: params?.page,
        limit: params?.limit,
      }),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
