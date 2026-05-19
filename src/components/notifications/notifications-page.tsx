"use client";

import { useState } from "react";
import { Bell, CheckCheck, Inbox, Loader2 } from "lucide-react";
import { NotificationItem } from "@/components/notifications/notification-item";
import { Pagination } from "@/components/shared/pagination";
import { NOTIFICATIONS_PAGE_SIZE } from "@/lib/pagination";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/notifications/use-notifications";

export function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const unreadOnly = filter === "unread";

  const { data, isLoading } = useNotifications(unreadOnly, {
    page,
    limit: NOTIFICATIONS_PAGE_SIZE,
  });
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead();

  const notifications = data?.notifications ?? [];
  const unread = data?.unread_count ?? 0;
  const total = data?.total ?? notifications.length;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Notifications</h1>
          <p className="mt-0.5 max-w-2xl text-sm text-slate-500">
            Pipeline runs, recommendations, and operational alerts for your organization.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatPill label="Unread" value={unread} accent={unread > 0} />
          <StatPill label="Total" value={total} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
              <Inbox size={16} className="text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Inbox</p>
              <p className="text-[11px] text-slate-500">
                {filter === "unread" ? "Unread only" : "All activity"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFilter(f);
                    setPage(1);
                  }}
                  className={`rounded-md px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    filter === f
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f}
                  {f === "unread" && unread > 0 ? ` · ${unread}` : ""}
                </button>
              ))}
            </div>

            {unread > 0 && (
              <button
                type="button"
                onClick={() => markAll()}
                disabled={markingAll}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              >
                {markingAll ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCheck size={14} />
                )}
                Mark all read
              </button>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-5 py-4">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center px-6 py-20 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100">
              <Bell size={28} className="text-slate-300" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-700">No notifications</p>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              {filter === "unread"
                ? "You're all caught up. Switch to All to browse earlier activity."
                : "When pipeline runs complete or recommendations need attention, they'll show up here."}
            </p>
            {filter === "unread" && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View all notifications
              </button>
            )}
          </div>
        )}

        {!isLoading && notifications.length > 0 && (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                variant="inbox"
                onRead={(id) => markRead(id)}
              />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageSize={NOTIFICATIONS_PAGE_SIZE}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`min-w-[88px] rounded-xl border px-4 py-2.5 ${
        accent
          ? "border-blue-200 bg-blue-50/80"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-0.5 text-2xl font-semibold tabular-nums ${
          accent ? "text-blue-700" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
