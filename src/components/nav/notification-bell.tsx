"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  AlertTriangle,
  TrendingUp,
  Zap,
  Info,
  X,
} from "lucide-react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/notifications/use-notifications";
import type { Notification } from "@/types/notifications";

function typeIcon(type: string | null) {
  if (!type) return <Info size={13} className="text-slate-400" />;
  if (type.includes("risk") || type.includes("alert"))
    return <AlertTriangle size={13} className="text-rose-500" />;
  if (type.includes("pipeline") || type.includes("run"))
    return <Zap size={13} className="text-blue-500" />;
  if (type.includes("recommendation"))
    return <TrendingUp size={13} className="text-emerald-500" />;
  return <Info size={13} className="text-slate-400" />;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NotificationItem({
  n,
  onRead,
}: {
  n: Notification;
  onRead: (id: string) => void;
}) {
  return (
    <button
      onClick={() => !n.is_read && onRead(n.id)}
      className={`w-full px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
        n.is_read ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
            n.is_read ? "bg-slate-100" : "bg-blue-50"
          }`}
        >
          {typeIcon(n.type)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-xs font-semibold leading-snug text-slate-800 ${
                !n.is_read ? "font-semibold" : "font-medium"
              }`}
            >
              {n.title ?? n.type ?? "Notification"}
            </p>
            {!n.is_read && (
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
            )}
          </div>
          {n.message && (
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
              {n.message}
            </p>
          )}
          <p className="mt-1 text-[10px] text-slate-400">{timeAgo(n.created_at)}</p>
        </div>
      </div>
    </button>
  );
}

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
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.75} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white leading-none">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
          {/* Header */}
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
                  onClick={() => markAll()}
                  disabled={markingAll}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                >
                  <CheckCheck size={12} />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Body */}
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
                  />
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-slate-100 px-4 py-2.5 text-center">
              <p className="text-[11px] text-slate-400">
                {data?.total ?? 0} total · showing last {notifications.length}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
