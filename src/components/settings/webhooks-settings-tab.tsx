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
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400";

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
      className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-700">New webhook endpoint</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-700"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Name</label>
          <input
            className={inputCls}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Production webhooks"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-slate-600">
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

      <div>
        <p className="mb-2 text-xs font-semibold text-slate-600">Events to receive</p>
        <div className="space-y-2">
          {WEBHOOK_EVENT_TYPES.map((ev) => (
            <label
              key={ev.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                events.includes(ev.id)
                  ? "border-blue-300 bg-white"
                  : "border-slate-200 bg-white/60"
              } ${!ev.available ? "opacity-70" : ""}`}
            >
              <input
                type="checkbox"
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={events.includes(ev.id)}
                disabled={!ev.available}
                onChange={() => toggleEvent(ev.id)}
              />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{ev.label}</span>
                  {!ev.available && (
                    <span className="rounded bg-slate-100 px-1.5 py-px text-[10px] font-semibold uppercase text-slate-500">
                      Coming soon
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-[11px] text-slate-500">{ev.description}</span>
                <span className="mt-1 block font-mono text-[10px] text-slate-400">{ev.id}</span>
              </span>
            </label>
          ))}
        </div>
        {events.length === 0 && (
          <p className="mt-2 text-xs text-rose-600">Select at least one event.</p>
        )}
      </div>

      <p className="text-[11px] text-slate-500">
        For <span className="font-medium">Alert triggered</span>, attach this webhook to alert rules
        under{" "}
        <Link href="/dashboard/alerts" className="font-semibold text-blue-600 hover:underline">
          Alerts
        </Link>
        .
      </p>

      <div className="flex justify-end border-t border-slate-200/80 pt-3">
        <button
          type="submit"
          disabled={isPending || atLimit || events.length === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending && <Loader2 size={13} className="animate-spin" />}
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
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-50">
          <Webhook size={15} className="text-indigo-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{channel.name}</p>
          {channel.url_hint && (
            <p className="truncate font-mono text-[11px] text-slate-500">{channel.url_hint}</p>
          )}
          <p className="mt-1 text-[11px] text-slate-500">
            {formatWebhookEvents(events)}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-1.5 sm:ml-auto">
        <button
          type="button"
          disabled={testing}
          onClick={onTest}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          {testing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />}
          Test
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
        >
          {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
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
    <div className="space-y-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Webhook endpoints
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Register HTTPS endpoints and choose which Pulse events they receive.
        </p>

        {slot && (
          <div className="mt-4">
            <UsageBar used={slot.used} limit={slot.limit} label="Webhook channels used" />
            {atLimit && isCloudDeployment() && (
              <p className="mt-2 text-xs text-slate-500">
                Free plan allows {slot.limit} webhook channel.{" "}
                <Link href="/dashboard/plan" className="font-semibold text-blue-600 hover:underline">
                  Upgrade to Pro
                </Link>{" "}
                for unlimited channels.
              </p>
            )}
          </div>
        )}

        {showForm && (
          <div className="mt-4">
            <CreateWebhookForm onClose={() => setShowForm(false)} atLimit={atLimit} />
          </div>
        )}

        <div className="mt-4 space-y-2">
          {loadingChannels &&
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />
            ))}

          {!loadingChannels && webhooks.length === 0 && !showForm && (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-10 text-center">
              <Webhook size={28} className="text-slate-200" />
              <p className="mt-2 text-sm font-medium text-slate-500">No webhooks yet</p>
              <p className="mt-0.5 max-w-sm text-xs text-slate-400">
                Add an endpoint to receive JSON payloads when events occur.
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
                  description: `Remove "${ch.name}"? Pulse will stop sending events to this endpoint.`,
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
            className="mt-3 flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={12} /> Add webhook
          </button>
        )}
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Delivery log
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Recent outbound deliveries and HTTP responses from your endpoints.
        </p>

        {loadingDeliveries &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mt-4 h-12 animate-pulse rounded-lg bg-slate-100" />
          ))}

        {!loadingDeliveries && deliveries.length === 0 && (
          <div className="mt-4 flex flex-col items-center rounded-xl border border-slate-100 py-8 text-center">
            <p className="text-sm text-slate-500">No deliveries yet</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Use Test on a webhook or trigger an alert to see activity here.
            </p>
          </div>
        )}

        {deliveries.length > 0 && (
          <div className="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {deliveries.map((d) => (
              <div key={d.id} className="flex items-center gap-4 px-4 py-3">
                <div className="shrink-0">
                  {d.status === "success" || d.status === "delivered" ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : d.status === "failed" ? (
                    <XCircle size={14} className="text-rose-500" />
                  ) : (
                    <Loader2 size={14} className="animate-spin text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-800">{d.event_type}</p>
                  <p className="truncate text-[10px] text-slate-400">channel: {d.channel_id}</p>
                </div>
                <div className="shrink-0 text-right">
                  {d.response_status != null && (
                    <span
                      className={`text-[11px] font-semibold ${
                        d.response_status < 300 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {d.response_status}
                    </span>
                  )}
                  <p className="text-[10px] text-slate-400">
                    {d.attempts} attempt{d.attempts !== 1 ? "s" : ""}
                  </p>
                </div>
                {d.status === "failed" && (
                  <button
                    type="button"
                    disabled={retrying && retryingId === d.id}
                    onClick={() => retry(d.id)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {retrying && retryingId === d.id ? (
                      <Loader2 size={11} className="animate-spin" />
                    ) : (
                      <RefreshCw size={11} />
                    )}
                    Retry
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={deliveriesPage}
          pageSize={WEBHOOK_DELIVERIES_PAGE_SIZE}
          total={deliveriesTotal}
          onPageChange={setDeliveriesPage}
        />
      </section>

      {deleteConfirmModal}
    </div>
  );
}
