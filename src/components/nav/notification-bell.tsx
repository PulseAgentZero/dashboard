"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, X } from "lucide-react";
import { NotificationItem } from "@/components/notifications/notification-item";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/notifications/use-notifications";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAll, isPending: markingAll } = useMarkAllNotificationsRead();

  const unread = data?.unread_count ?? 0;
  const notifications = data?.notifications ?? [];

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-orange-50 hover:text-orange-700"
        aria-label="Notifications"
        data-tour="notifications-bell"
      >
        <Bell size={18} strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-800">Notifications</p>
              {unread > 0 && (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => markAll()}
                  disabled={markingAll}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="space-y-0 divide-y divide-slate-100">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                      <div className="h-2.5 w-full animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && notifications.length === 0 && (
              <div className="flex flex-col items-center py-10 text-center">
                <Bell size={28} className="text-slate-200" />
                <p className="mt-2 text-xs font-medium text-slate-500">No notifications yet</p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Pipeline runs and risk events will appear here.
                </p>
              </div>
            )}

            {!isLoading && notifications.length > 0 && (
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    n={n}
                    onRead={(id) => markRead(id)}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-2.5 text-center">
            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
