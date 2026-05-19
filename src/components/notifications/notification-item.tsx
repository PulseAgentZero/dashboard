"use client";

import Link from "next/link";
import { AlertTriangle, ChevronRight, Info, TrendingUp, Zap } from "lucide-react";
import type { Notification } from "@/types/notifications";

export function typeIcon(type: string | null, size = 15) {
  if (!type) return <Info size={size} className="text-slate-400" />;
  if (type.includes("risk") || type.includes("alert"))
    return <AlertTriangle size={size} className="text-rose-500" />;
  if (type.includes("pipeline") || type.includes("run"))
    return <Zap size={size} className="text-blue-500" />;
  if (type.includes("recommendation"))
    return <TrendingUp size={size} className="text-emerald-500" />;
  return <Info size={size} className="text-slate-400" />;
}

export function typeLabel(type: string | null): string {
  if (!type) return "Update";
  if (type.includes("risk") || type.includes("alert")) return "Alert";
  if (type.includes("pipeline") || type.includes("run")) return "Pipeline";
  if (type.includes("recommendation")) return "Recommendation";
  return type.replace(/_/g, " ");
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTimestamp(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type NotificationItemProps = {
  n: Notification;
  onRead?: (id: string) => void;
  compact?: boolean;
  variant?: "card" | "inbox";
};

const TYPE_BADGE: Record<string, string> = {
  Alert: "bg-rose-50 text-rose-700 ring-rose-100",
  Pipeline: "bg-blue-50 text-blue-700 ring-blue-100",
  Recommendation: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Update: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function NotificationItem({
  n,
  onRead,
  compact,
  variant = compact ? "card" : "inbox",
}: NotificationItemProps) {
  if (variant === "inbox") {
    return <InboxRow n={n} onRead={onRead} />;
  }

  const className = `w-full text-left transition-colors hover:bg-slate-50 ${
    n.is_read ? "opacity-60" : ""
  } ${compact ? "px-4 py-3" : "rounded-xl border border-slate-100 bg-white px-4 py-4 shadow-sm"}`;

  const body = <CompactBody n={n} />;

  if (n.action_url) {
    return (
      <Link
        href={n.action_url}
        onClick={() => !n.is_read && onRead?.(n.id)}
        className={className}
      >
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={() => !n.is_read && onRead?.(n.id)} className={className}>
      {body}
    </button>
  );
}

function CompactBody({ n }: { n: Notification }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
          n.is_read ? "bg-slate-100" : "bg-blue-50"
        }`}
      >
        {typeIcon(n.type, 13)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-xs leading-snug text-slate-800 ${
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
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
            {n.message}
          </p>
        )}
        <p className="mt-1 text-[10px] text-slate-400">{timeAgo(n.created_at)}</p>
      </div>
    </div>
  );
}

function InboxRow({ n, onRead }: { n: Notification; onRead?: (id: string) => void }) {
  const label = typeLabel(n.type);
  const badgeCls = TYPE_BADGE[label] ?? TYPE_BADGE.Update;

  const row = (
    <div
      className={`group flex w-full items-stretch gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/90 ${
        n.is_read ? "bg-white" : "bg-blue-50/30"
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${
          n.is_read
            ? "bg-slate-50 ring-slate-100"
            : "bg-white ring-blue-100 shadow-sm"
        }`}
      >
        {typeIcon(n.type, 18)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${badgeCls}`}
          >
            {label}
          </span>
          {n.source && (
            <span className="text-[11px] text-slate-400">{n.source}</span>
          )}
          {!n.is_read && (
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden />
          )}
        </div>

        <p
          className={`mt-1.5 text-sm leading-snug text-slate-900 ${
            !n.is_read ? "font-semibold" : "font-medium"
          }`}
        >
          {n.title ?? "Notification"}
        </p>

        {n.message && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {n.message}
          </p>
        )}
      </div>

      <div className="hidden shrink-0 flex-col items-end justify-between gap-2 sm:flex">
        <p className="text-xs font-medium text-slate-500">{timeAgo(n.created_at)}</p>
        <p className="text-[11px] text-slate-400">{formatTimestamp(n.created_at)}</p>
        {n.action_url && (
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
            View
            <ChevronRight size={12} />
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center sm:hidden">
        {!n.is_read && (
          <span className="h-2 w-2 rounded-full bg-blue-500" aria-label="Unread" />
        )}
      </div>
    </div>
  );

  if (n.action_url) {
    return (
      <Link
        href={n.action_url}
        onClick={() => !n.is_read && onRead?.(n.id)}
        className="block border-b border-slate-100 last:border-b-0"
      >
        {row}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => !n.is_read && onRead?.(n.id)}
      className="block w-full border-b border-slate-100 last:border-b-0"
    >
      {row}
    </button>
  );
}
