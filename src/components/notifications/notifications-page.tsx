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
    <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-2 sm:px-6">
      {/* Title Header Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Notifications</h1>
          <p className="mt-0.5 max-w-2xl text-xs sm:text-sm text-slate-500 leading-relaxed">
            Pipeline runs, recommendations, and operational alerts for your organization.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <StatPill label="Unread" value={unread} accent={unread > 0} />
          <StatPill label="Total" value={total} />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        {/* Inbox Control Box Header */}
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-3.5 sm:px-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-white border border-slate-100 shadow-xs">
              <Inbox size={15} className="text-slate-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Inbox</p>
              <p className="text-[11px] text-slate-400">
                {filter === "unread" ? "Unread only" : "All activity"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Swapped default blue/slate highlights with targeted orange profiles */}
            <div className="flex rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setFilter(f);
                    setPage(1);
                  }}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                    filter === f
                      ? "bg-orange-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-orange-500 disabled:opacity-50 transition-colors"
              >
                {markingAll ? (
                  <Loader2 size={13} className="animate-spin text-orange-600" />
                ) : (
                  <CheckCheck size={13} className="text-slate-500" />
                )}
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* Height floor preserves space layout during live filtering shifts */}
        <div className="relative min-h-[26rem] flex flex-col justify-between">
          {isLoading && (
            <div className="divide-y divide-slate-100 flex-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 px-5 py-4.5 animate-pulse">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-20 rounded bg-slate-100" />
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
                <Bell size={20} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">No notifications</p>
              <p className="mt-1 max-w-sm text-[14px] text-slate-400 leading-relaxed">
                {filter === "unread"
                  ? "You're completely caught up! Toggle over to all items to browse your historical activity list."
                  : "When pipeline runs complete or recommendations need attention, they'll show up right here."}
              </p>
              {filter === "unread" && (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="mt-4 text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  View all notifications
                </button>
              )}
            </div>
          )}

          {!isLoading && notifications.length > 0 && (
            <div className="divide-y divide-slate-100 flex-1">
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

          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/30">
            <Pagination
              page={page}
              pageSize={NOTIFICATIONS_PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          </div>
        </div>
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
      className={`min-w-0 flex-1 rounded-xl border px-3.5 py-2 transition-colors sm:min-w-[96px] sm:flex-none ${
        accent
          ? "border-orange-100 bg-orange-50/60"
          : "border-slate-200 bg-white"
      }`}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p
        className={`mt-0.5 text-xl font-bold tracking-tight tabular-nums ${
          accent ? "text-orange-700" : "text-slate-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}