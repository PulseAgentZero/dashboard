"use client";

import { useState } from "react";
import {
  Bell, CheckCircle2, Loader2, Mail, MessageSquare,
  Plus, RefreshCw, Trash2, Webhook, Zap,
} from "lucide-react";
import {
  useAlertRules, useAlertChannels, useAlertEvents,
  useCreateAlertRule, useDeleteAlertRule,
  useCreateAlertChannel, useDeleteAlertChannel, useTestAlertChannel,
} from "@/hooks/alerts/use-alerts";
import type {
  AlertRule,
  AlertChannel,
  AlertEvent,
} from "@/lib/api/alerts-api";
import { Pagination } from "@/components/shared/pagination";
import { ALERT_EVENTS_PAGE_SIZE } from "@/lib/pagination";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";

const CHANNEL_ICONS: Record<string, React.ElementType> = {
  email: Mail, slack: MessageSquare, webhook: Webhook, in_app: Bell,
};

const OPERATORS = ["gt", "lt", "gte", "lte", "eq"] as const;
const OP_LABELS: Record<string, string> = {
  gt: "> greater than", lt: "< less than",
  gte: "≥ at least", lte: "≤ at most", eq: "= equals",
};
const CHANNEL_TYPES = ["email", "slack", "webhook", "in_app"] as const;

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 placeholder:text-slate-400 transition-colors";

function RuleCard({ rule, onDelete, deleting }: {
  rule: AlertRule; onDelete: () => void; deleting: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{rule.name}</p>
          {rule.description && <p className="mt-0.5 text-xs text-slate-500">{rule.description}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[10px] sm:text-[11px] text-slate-700">
              {rule.metric} {OP_LABELS[rule.operator] ?? rule.operator} {rule.threshold ?? "—"}
            </span>
            {rule.cooldown_minutes > 0 && (
              <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-orange-700 border border-orange-100/40">
                cooldown {rule.cooldown_minutes}m
              </span>
            )}
          </div>
        </div>
        <button
          disabled={deleting}
          onClick={onDelete}
          className="flex items-center justify-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors w-full sm:w-auto shrink-0"
        >
          {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
          Remove
        </button>
      </div>
    </div>
  );
}

function ChannelCard({ channel, onDelete, onTest, deleting, testing }: {
  channel: AlertChannel; onDelete: () => void; onTest: () => void;
  deleting: boolean; testing: boolean;
}) {
  const Icon = CHANNEL_ICONS[channel.type] ?? Bell;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 shrink-0 border border-orange-100/50">
            <Icon size={15} className="text-orange-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{channel.name}</p>
            <p className="text-[11px] capitalize text-slate-400">{channel.type.replace("_", " ")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 border-t border-slate-100/80 pt-3 sm:border-t-0 sm:pt-0 w-full sm:w-auto">
          <button
            disabled={testing}
            onClick={onTest}
            className="flex flex-1 sm:flex-initial justify-center items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            {testing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Test
          </button>
          <button
            disabled={deleting}
            onClick={onDelete}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors shrink-0"
          >
            {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddRuleForm({ onClose }: { onClose: () => void }) {
  const { mutate: create, isPending } = useCreateAlertRule();
  const [f, setF] = useState({
    name: "", description: "", metric: "risk_score",
    operator: "gt", threshold: "70", cooldown_minutes: "60",
  });
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    create(
      {
        name: f.name, description: f.description || null, metric: f.metric,
        operator: f.operator, threshold: Number(f.threshold),
        channel_ids: [], cooldown_minutes: Number(f.cooldown_minutes),
      },
      { onSuccess: onClose },
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">New alert rule</p>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Rule name</label>
          <input className={inputCls} required value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="High risk alert" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Metric</label>
          <input className={inputCls} required value={f.metric} onChange={(e) => set("metric", e.target.value)} placeholder="risk_score" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Operator</label>
          <select className={inputCls} value={f.operator} onChange={(e) => set("operator", e.target.value)}>
            {OPERATORS.map((op) => <option key={op} value={op}>{OP_LABELS[op]}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Threshold</label>
          <input className={inputCls} type="number" required value={f.threshold} onChange={(e) => set("threshold", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Cooldown (minutes)</label>
          <input className={inputCls} type="number" value={f.cooldown_minutes} onChange={(e) => set("cooldown_minutes", e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Description</label>
          <input className={inputCls} value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional…" />
        </div>
      </div>
      <div className="flex justify-end border-t border-slate-200/60 pt-3">
        <button type="submit" disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition-colors disabled:opacity-50">
          {isPending && <Loader2 size={13} className="animate-spin" />}
          {isPending ? "Creating…" : "Create rule"}
        </button>
      </div>
    </form>
  );
}

function AddChannelForm({ onClose }: { onClose: () => void }) {
  const { mutate: create, isPending } = useCreateAlertChannel();
  const [name, setName] = useState("");
  const [type, setType] = useState("email");
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const config: Record<string, unknown> = {};
    if (type === "webhook") config.url = url;
    if (type === "email") config.email = email;
    if (type === "slack") config.webhook_url = url;
    create({ name, type, config }, { onSuccess: onClose });
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">New notification channel</p>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-600">Cancel</button>
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Channel name</label>
          <input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ops team" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600">Type</label>
          <select className={inputCls} value={type} onChange={(e) => setType(e.target.value)}>
            {CHANNEL_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
          </select>
        </div>
        {type === "email" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Email address</label>
            <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ops@company.com" />
          </div>
        )}
        {(type === "webhook" || type === "slack") && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              {type === "slack" ? "Slack webhook URL" : "Webhook URL"}
            </label>
            <input className={inputCls} type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </div>
        )}
      </div>
      <div className="flex justify-end border-t border-slate-200/60 pt-3">
        <button type="submit" disabled={isPending}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition-colors disabled:opacity-50">
          {isPending && <Loader2 size={13} className="animate-spin" />}
          {isPending ? "Creating…" : "Create channel"}
        </button>
      </div>
    </form>
  );
}

function EmptyState({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center py-10 px-4 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
        <Icon size={22} />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-slate-400 leading-relaxed">{sub}</p>
    </div>
  );
}

const TABS = [
  { id: "rules", label: "Alert rules", icon: Bell },
  { id: "channels", label: "Channels", icon: MessageSquare },
  { id: "events", label: "Recent events", icon: Zap },
] as const;
type Tab = (typeof TABS)[number]["id"];

function parseAlertEvents(raw: unknown): { events: AlertEvent[]; total: number } {
  if (Array.isArray(raw)) {
    return { events: raw as AlertEvent[], total: raw.length };
  }
  if (raw && typeof raw === "object") {
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r.events) && typeof r.total === "number") {
      return { events: r.events as AlertEvent[], total: r.total };
    }
    for (const k of ["events", "data", "items"]) {
      if (Array.isArray(r[k])) {
        const events = r[k] as AlertEvent[];
        return { events, total: events.length };
      }
    }
  }
  return { events: [], total: 0 };
}

export function AlertsPage() {
  const { data: rulesRaw, isLoading: loadingRules } = useAlertRules();
  const { data: channelsRaw, isLoading: loadingChannels } = useAlertChannels();
  const [eventsPage, setEventsPage] = useState(1);
  const { data: eventsRaw, isLoading: loadingEvents } = useAlertEvents(undefined, {
    page: eventsPage,
    limit: ALERT_EVENTS_PAGE_SIZE,
  });
  const { mutate: deleteRule, isPending: deletingRule, variables: deletingRuleId } = useDeleteAlertRule();
  const { mutate: deleteChannel, isPending: deletingChannel, variables: deletingChannelId } = useDeleteAlertChannel();
  const { mutate: testChannel, isPending: testingChannel, variables: testingChannelId } = useTestAlertChannel();
  const [showRule, setShowRule] = useState(false);
  const [showChannel, setShowChannel] = useState(false);
  const [tab, setTab] = useState<Tab>("rules");
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();

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

  const rules = toArray<AlertRule>(rulesRaw, "rules", "data", "items");
  const channels = toArray<AlertChannel>(channelsRaw, "channels", "data", "items");
  const { events: eventList, total: eventsTotal } = parseAlertEvents(eventsRaw);

  const counts: Record<Tab, number | null> = {
    rules: loadingRules ? null : rules.length,
    channels: loadingChannels ? null : channels.length,
    events: loadingEvents ? null : eventList.length,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Alerts</h1>
        <p className="mt-0.5 text-sm text-slate-500 leading-relaxed">
          Configure threshold rules and notification channels for operational events.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Tab bar header layout panel */}
        <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50/50 px-4 pt-4 sm:px-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex space-x-1 overflow-x-auto no-scrollbar scroll-smooth">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-t-xl px-3.5 py-2.5 text-xs font-semibold transition-colors shrink-0 ${
                  tab === id
                    ? "border-b-2 border-orange-600 text-orange-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={13} />
                {label}
                {counts[id] !== null && counts[id]! > 0 && (
                  <span className={`ml-1 rounded-full px-1.5 py-px text-[10px] font-bold ${
                    tab === id ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {counts[id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pb-3 sm:pb-0 shrink-0">
            {tab === "rules" && (
              <button
                onClick={() => setShowRule(true)}
                disabled={showRule}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <Plus size={13} /> Add rule
              </button>
            )}
            {tab === "channels" && (
              <button
                onClick={() => setShowChannel(true)}
                disabled={showChannel}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <Plus size={13} /> Add channel
              </button>
            )}
          </div>
        </div>

        {/* Rules tab */}
        {tab === "rules" && (
          <div className="space-y-3 p-4 sm:p-5">
            {showRule && <AddRuleForm onClose={() => setShowRule(false)} />}
            {loadingRules && Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
            {!loadingRules && rules.length === 0 && !showRule && (
              <EmptyState icon={Bell} title="No alert rules configured" sub="Add a rule to get notified when metrics cross thresholds." />
            )}
            {rules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                deleting={deletingRule && deletingRuleId === rule.id}
                onDelete={() =>
                  requestDeleteConfirm({
                    title: "Delete alert rule",
                    description: `Delete "${rule.name}"? This rule will stop firing immediately.`,
                    confirmLabel: "Delete",
                    onConfirm: () => deleteRule(rule.id),
                  })
                }
              />
            ))}
          </div>
        )}

        {/* Channels tab */}
        {tab === "channels" && (
          <div className="space-y-3 p-4 sm:p-5">
            {showChannel && <AddChannelForm onClose={() => setShowChannel(false)} />}
            {loadingChannels && Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-100" />
            ))}
            {!loadingChannels && channels.length === 0 && !showChannel && (
              <EmptyState icon={MessageSquare} title="No channels configured" sub="Add email, Slack, or webhook to receive alert notifications." />
            )}
            {channels.map((ch) => (
              <ChannelCard
                key={ch.id}
                channel={ch}
                deleting={deletingChannel && deletingChannelId === ch.id}
                testing={testingChannel && testingChannelId === ch.id}
                onDelete={() =>
                  requestDeleteConfirm({
                    title: "Remove channel",
                    description: `Remove "${ch.name}"? Alerts will no longer be sent to this channel.`,
                    confirmLabel: "Remove",
                    onConfirm: () => deleteChannel(ch.id),
                  })
                }
                onTest={() => testChannel(ch.id)}
              />
            ))}
          </div>
        )}

        {/* Events tab */}
        {tab === "events" && (
          <>
            {loadingEvents && (
              <div className="space-y-2 p-4 sm:p-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            )}
            {!loadingEvents && eventList.length === 0 && (
              <div className="p-4 sm:p-5">
                <EmptyState icon={CheckCircle2} title="No alert events fired" sub="Events appear here when a rule threshold is crossed." />
              </div>
            )}
            {eventList.length > 0 && (
              <div className="divide-y divide-slate-100">
                {eventList.map((ev) => (
                  <div key={ev.id} className="flex flex-col gap-1 px-4 py-3 sm:px-5 sm:flex-row sm:items-start sm:gap-3">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-rose-50 text-rose-500 border border-rose-100/50">
                        <Zap size={12} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 break-words leading-relaxed">
                          {ev.message ?? ev.rule_name ?? "Alert fired"}
                        </p>
                        {ev.entity_id && (
                          <p className="text-[10px] text-slate-500 mt-0.5 font-medium bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md w-fit">
                            Entity: {ev.entity_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400 pl-8 sm:pl-0 font-medium mt-0.5">
                      {new Date(ev.fired_at ?? ev.created_at ?? Date.now()).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="px-4 py-3 border-t border-slate-100">
              <Pagination
                page={eventsPage}
                pageSize={ALERT_EVENTS_PAGE_SIZE}
                total={eventsTotal}
                onPageChange={setEventsPage}
              />
            </div>
          </>
        )}
      </div>

      {deleteConfirmModal}
    </div>
  );
}