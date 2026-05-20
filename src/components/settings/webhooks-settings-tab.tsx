"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  Webhook,
  XCircle,
} from "lucide-react";
import {
  useAlertChannels,
  useCreateAlertChannel,
  useDeleteAlertChannel,
  useTestAlertChannel,
} from "@/hooks/alerts/use-alerts";
import { useWebhookDeliveries, useRetryWebhook } from "@/hooks/webhooks/use-webhooks";
import { useUsage } from "@/hooks/usage/use-usage";
import { UsageBar } from "@/components/shared/usage-bar";
import { isCloudDeployment } from "@/lib/deployment";
import {
  DEFAULT_WEBHOOK_EVENTS,
  WEBHOOK_EVENT_TYPES,
  formatWebhookEvents,
  type WebhookEventId,
} from "@/lib/webhook-events";
import type { AlertChannel } from "@/lib/api/alerts-api";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { Pagination } from "@/components/shared/pagination";
import { WEBHOOK_DELIVERIES_PAGE_SIZE } from "@/lib/pagination";
import { parsePagedList } from "@/lib/parse-paged-list";
import type { WebhookDelivery } from "@/lib/api/webhooks-api";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 transition-all";

function toArray<T>(raw: unknown, ...keys: string[]): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    for (const k of keys) {
      const v = (raw as Record<string, unknown>)[k];
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
}

type WebhookChannel = AlertChannel & {
  events?: string[];
  url_hint?: string | null;
};

function CreateWebhookForm({ onClose, atLimit }: { onClose: () => void; atLimit: boolean }) {
  const { mutate: create, isPending } = useCreateAlertChannel();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<WebhookEventId[]>([...DEFAULT_WEBHOOK_EVENTS]);

  function toggleEvent(id: WebhookEventId) {
    setEvents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (atLimit) return;
    if (events.length === 0) return;
    create(
      {
        name: name.trim(),
        type: "webhook",
        config: { url: url.trim(), events },
      },
      { onSuccess: onClose },
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-700">New webhook endpoint</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">Name</label>
          <input
            className={inputCls}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Production webhooks"
          />
        </div>
        <div className="sm:col-span-2 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-600">
            Endpoint URL
          </label>
          <input
            className={inputCls}
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/webhooks/pulse"
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Events to receive</p>
        <div className="space-y-2.5">
          {WEBHOOK_EVENT_TYPES.map((ev) => {
            const isChecked = events.includes(ev.id);
            return (
              <label
                key={ev.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-all ${
                  isChecked
                    ? "border-orange-500 ring-2 ring-orange-100 bg-white"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                } ${!ev.available ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0 transition-colors"
                  checked={isChecked}
                  disabled={!ev.available}
                  onChange={() => toggleEvent(ev.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{ev.label}</span>
                    {!ev.available && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200">
                        Coming soon
                    </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs leading-normal text-slate-500">{ev.description}</span>
                  <span className="mt-1.5 block font-mono text-[10px] text-slate-400">{ev.id}</span>
                </span>
              </label>
            );
          })}
        </div>
        {events.length === 0 && (
          <p className="text-xs font-medium text-rose-600">Select at least one event payload type.</p>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 leading-normal">
        For <span className="font-semibold text-slate-800">Alert triggered</span>, attach this webhook to system rules under{" "}
        <Link href="/dashboard/alerts" className="font-semibold text-orange-600 hover:underline">
          Alerts
        </Link>
        .
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-4">
        <button
          type="submit"
          disabled={isPending || atLimit || events.length === 0}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? "Creating…" : "Create webhook"}
        </button>
      </div>
    </form>
  );
}

function WebhookChannelRow({
  channel,
  onDelete,
  onTest,
  deleting,
  testing,
}: {
  channel: WebhookChannel;
  onDelete: () => void;
  onTest: () => void;
  deleting: boolean;
  testing: boolean;
}) {
  const events = channel.events ?? DEFAULT_WEBHOOK_EVENTS;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center shadow-sm">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-50 border border-orange-100">
          <Webhook size={16} className="text-orange-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{channel.name}</p>
          {channel.url_hint && (
            <p className="truncate font-mono text-[11px] text-slate-500 mt-0.5">{channel.url_hint}</p>
          )}
          <p className="mt-1 text-[11px] text-slate-400 leading-normal">
            {formatWebhookEvents(events)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2 sm:ml-auto self-end sm:self-center">
        <button
          type="button"
          disabled={testing}
          onClick={onTest}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-colors"
        >
          {testing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} className="text-slate-400" />}
          Test
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 disabled:opacity-50 shadow-sm transition-colors"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Remove
        </button>
      </div>
    </div>
  );
}

export function WebhooksSettingsTab() {
  const [deliveriesPage, setDeliveriesPage] = useState(1);
  const { data: channelsRaw, isLoading: loadingChannels } = useAlertChannels();
  const { data: deliveriesRaw, isLoading: loadingDeliveries } = useWebhookDeliveries({
    page: deliveriesPage,
    limit: WEBHOOK_DELIVERIES_PAGE_SIZE,
  });
  const { data: usage } = useUsage();
  const { mutate: deleteChannel, isPending: deleting, variables: deletingId } =
    useDeleteAlertChannel();
  const { mutate: testChannel, isPending: testing, variables: testingId } = useTestAlertChannel();
  const { mutate: retry, isPending: retrying, variables: retryingId } = useRetryWebhook();
  const [showForm, setShowForm] = useState(false);
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();

  const slot = usage?.limits?.webhook_channels;
  const atLimit = slot ? slot.limit !== null && slot.used >= slot.limit : false;

  const allChannels = toArray<WebhookChannel>(channelsRaw, "channels", "data", "items");
  const webhooks = allChannels.filter((c) => c.type === "webhook");
  const { items: deliveries, total: deliveriesTotal } = parsePagedList<WebhookDelivery>(
    deliveriesRaw,
    "deliveries",
  );

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Webhook endpoints
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Register HTTPS endpoints and choose which Entivia events they receive.
          </p>
        </div>

        {slot && (
          <div className="space-y-2">
            <UsageBar used={slot.used} limit={slot.limit} label="Webhook channels used" />
            {atLimit && isCloudDeployment() && (
              <p className="text-xs text-slate-500">
                Your plan allows {slot.limit} webhook channel.{" "}
                <Link href="/dashboard/plan" className="font-semibold text-orange-600 hover:underline">
                  Upgrade to Pro
                </Link>{" "}
                for unlimited channels.
              </p>
            )}
          </div>
        )}

        {showForm && <CreateWebhookForm onClose={() => setShowForm(false)} atLimit={atLimit} />}

        <div className="space-y-3">
          {loadingChannels &&
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}

          {!loadingChannels && webhooks.length === 0 && !showForm && (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-12 text-center bg-white shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 mb-3">
                <Webhook size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No endpoints defined</p>
              <p className="mt-0.5 max-w-xs text-xs text-slate-400 px-4 leading-normal">
                Add an endpoint connection to capture automated pipeline events.
              </p>
            </div>
          )}

          {webhooks.map((ch) => (
            <WebhookChannelRow
              key={ch.id}
              channel={ch}
              deleting={deleting && deletingId === ch.id}
              testing={testing && testingId === ch.id}
              onDelete={() =>
                requestDeleteConfirm({
                  title: "Remove webhook",
                  description: `Remove "${ch.name}"? Entivia will stop sending events to this endpoint.`,
                  confirmLabel: "Remove",
                  onConfirm: () => deleteChannel(ch.id),
                })
              }
              onTest={() => testChannel(ch.id)}
            />
          ))}
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={atLimit}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <Plus size={16} className="text-slate-400" /> Add webhook endpoint
          </button>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Delivery log
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Recent outbound deliveries and HTTP response operations from your endpoints.
          </p>
        </div>

        {loadingDeliveries &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
          ))}

        {!loadingDeliveries && deliveries.length === 0 && (
          <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-white py-10 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-600">No logs found</p>
            <p className="mt-0.5 text-xs text-slate-400 px-4 leading-normal">
              Execute a Test sequence or process automated runs to generate live telemetry logs.
            </p>
          </div>
        )}

        {deliveries.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-100">
            {deliveries.map((d) => (
              <div key={d.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3.5 transition-colors hover:bg-slate-50/50">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="shrink-0 mt-0.5 sm:mt-0">
                    {d.status === "success" || d.status === "delivered" ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : d.status === "failed" ? (
                      <XCircle size={16} className="text-rose-500" />
                    ) : (
                      <Loader2 size={16} className="animate-spin text-slate-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-slate-800">{d.event_type}</p>
                    <p className="truncate text-[10px] text-slate-400 mt-0.5 font-mono">channel: {d.channel_id}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t border-slate-100 pt-2 sm:border-none sm:pt-0 pl-7 sm:pl-0">
                  <div className="text-left sm:text-right">
                    {d.response_status != null && (
                      <span
                        className={`text-xs font-mono font-bold ${
                          d.response_status < 300 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        HTTP {d.response_status}
                      </span>
                    )}
                    <p className="text-[10px] text-slate-400 sm:mt-0.5">
                      {d.attempts} attempt{d.attempts !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {d.status === "failed" && (
                    <button
                      type="button"
                      disabled={retrying && retryingId === d.id}
                      onClick={() => retry(d.id)}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm disabled:opacity-50 transition-colors"
                    >
                      {retrying && retryingId === d.id ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <RefreshCw size={11} className="text-slate-400" />
                      )}
                      Retry
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {deliveries.length > 0 && (
          <div className="pt-2">
            <Pagination
              page={deliveriesPage}
              pageSize={WEBHOOK_DELIVERIES_PAGE_SIZE}
              total={deliveriesTotal}
              onPageChange={setDeliveriesPage}
            />
          </div>
        )}
      </section>

      {deleteConfirmModal}
    </div>
  );
}