export type Notification = {
  id: string;
  type: string | null;
  title: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  entity_id?: string | null;
  metadata?: Record<string, unknown>;
};

export type NotificationsResponse = {
  notifications: Notification[];
  unread_count: number;
  total: number;
};
