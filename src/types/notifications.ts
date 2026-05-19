export type NotificationApiRow = {
  id: string;
  title: string | null;
  body: string | null;
  type: string | null;
  action_url: string | null;
  source: string | null;
  read_at: string | null;
  created_at: string;
};

export type NotificationsApiResponse = {
  notifications: NotificationApiRow[];
  unread_count: number;
  total?: number;
  page?: number;
  limit?: number;
};

export type Notification = {
  id: string;
  type: string | null;
  title: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
  action_url: string | null;
  source: string | null;
};

export type NotificationsResponse = {
  notifications: Notification[];
  unread_count: number;
  total: number;
  page: number;
  limit: number;
};
