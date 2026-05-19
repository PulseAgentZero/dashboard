"use client";

import { useState } from "react";
import { RefreshCw, Webhook } from "lucide-react";
import { Pagination } from "@/components/shared/pagination";
import { useWebhookDeliveries, useRetryWebhook } from "@/hooks/webhooks/use-webhooks";
import { useUsage } from "@/hooks/usage/use-usage";
import { WEBHOOK_DELIVERIES_PAGE_SIZE } from "@/lib/pagination";
import { parsePagedList } from "@/lib/parse-paged-list";
import type { WebhookDelivery } from "@/lib/api/webhooks-api";

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700",
  failed: "bg-rose-50 text-rose-700",
  pending: "bg-amber-50 text-amber-700",
};

export function WebhooksPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useWebhookDeliveries({
    page,
    limit: WEBHOOK_DELIVERIES_PAGE_SIZE,
  });
  const { data: usage } = useUsage();
  const { mutate: retry, isPending: isRetrying } = useRetryWebhook();

  const { items: deliveries, total } = parsePagedList<WebhookDelivery>(data, "deliveries");

  const slot = usage?.limits?.webhook_channels;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Webhook Deliveries</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor outbound webhook events and retry failed deliveries.
          </p>
        </div>
        {slot && slot.limit !== null && (
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-center">
            <p className="text-xs text-slate-500">Webhook channels</p>
            <p className={`text-lg font-bold ${slot.used >= slot.limit ? "text-rose-600" : "text-slate-900"}`}>
              {slot.used} / {slot.limit}
            </p>
          </div>
        )}
      </div>

      {slot && slot.limit !== null && slot.used >= slot.limit && (
        <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
          Webhook channel limit reached. Upgrade to Pro for unlimited channels.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center">
          <Webhook size={24} className="mx-auto mb-2 text-slate-300" />
          <p className="text-sm text-slate-500">No webhook deliveries yet</p>
          <p className="mt-1 text-xs text-slate-400">
            Create a webhook channel in Alerts → Channels to start receiving events.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-medium text-slate-500">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">HTTP</th>
                <th className="px-4 py-3">Attempts</th>
                <th className="px-4 py-3">Last attempt</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deliveries.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-mono text-xs text-slate-700">{d.event_type}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                        STATUS_STYLES[d.status] ?? "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {d.response_status ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{d.attempts}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {d.last_attempt_at
                      ? new Date(d.last_attempt_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {d.status === "failed" && (
                      <button
                        onClick={() => retry(d.id)}
                        disabled={isRetrying}
                        className="flex items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
                      >
                        <RefreshCw size={11} />
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            page={page}
            pageSize={WEBHOOK_DELIVERIES_PAGE_SIZE}
            total={total}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
