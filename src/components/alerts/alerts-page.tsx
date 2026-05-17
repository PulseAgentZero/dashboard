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
import type { AlertRule, AlertChannel, AlertEvent } from "@/lib/api/alerts-api";

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
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400";

function RuleCard({ rule, onDelete, deleting }: {
  rule: AlertRule; onDelete: () => void; deleting: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{rule.name}</p>
          {rule.description && <p className="mt-0.5 text-xs text-slate-400">{rule.description}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">
              {rule.metric} {OP_LABELS[rule.operator] ?? rule.operator} {rule.threshold ?? "—"}
            </span>
            {rule.cooldown_minutes > 0 && (
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
                cooldown {rule.cooldown_minutes}m
              </span>
            )}
          </div>
        </div>
        <button
          disabled={deleting}
          onClick={onDelete}
          className="flex shrink-0 items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
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
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50">
            <Icon size={15} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{channel.name}</p>
            <p className="text-[11px] capitalize text-slate-400">{channel.type.replace("_", " ")}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            disabled={testing}
            onClick={onTest}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {testing ? <Loader2 size={11} className="animate-spin" /> : <RefreshCw size={11} />} Test
          </button>
          <button
            disabled={deleting}
            onClick={onDelete}
            className="flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
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
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/40 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">New alert rule</p>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-700">Cancel</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
      <div className="flex justify-end border-t border-slate-200 pt-3">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
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
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/40 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">New notification channel</p>
        <button type="button" onClick={onClose} className="text-xs text-slate-400 hover:text-slate-700">Cancel</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
      <div className="flex justify-end border-t border-slate-200 pt-3">
        <button type="submit" disabled={isPending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {isPending && <Loader2 size={13} className="animate-spin" />}
          {isPending ? "Creating…" : "Create channel"}
        </button>
      </div>
    </form>
  );
}

function EmptyState({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <Icon size={28} className="text-slate-200" />
      <p className="mt-2 text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

const TABS = [
  { id: "rules", label: "Alert rules", icon: Bell },
  { id: "channels", label: "Channels", icon: MessageSquare },
  { id: "events", label: "Recent events", icon: Zap },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function AlertsPage() {
  const { data: rulesRaw, isLoading: loadingRules } = useAlertRules();
  const { data: channelsRaw, isLoading: loadingChannels } = useAlertChannels();
  const { data: eventsRaw, isLoading: loadingEvents } = useAlertEvents();
  const { mutate: deleteRule, isPending: deletingRule, variables: deletingRuleId } = useDeleteAlertRule();
  const { mutate: deleteChannel, isPending: deletingChannel, variables: deletingChannelId } = useDeleteAlertChannel();
  const { mutate: testChannel, isPending: testingChannel, variables: testingChannelId } = useTestAlertChannel();
  const [showRule, setShowRule] = useState(false);
  const [showChannel, setShowChannel] = useState(false);
  const [tab, setTab] = useState<Tab>("rules");

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
  const eventList = toArray<AlertEvent>(eventsRaw, "events", "data", "items");

  const counts: Record<Tab, number | null> = {
    rules: loadingRules ? null : rules.length,
    channels: loadingChannels ? null : channels.length,
    events: loadingEvents ? null : eventList.length,
  };

  return (
    <div className="mx-auto max-w-8xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Alerts</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Configure threshold rules and notification channels for operational events.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        {/* Tab bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 pt-4">
          <div className="flex gap-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={13} />
                {label}
                {counts[id] !== null && counts[id]! > 0 && (
                  <span className={`ml-0.5 rounded-full px-1.5 py-px text-[10px] font-semibold ${
                    tab === id ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                  }`}>
                    {counts[id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {tab === "rules" && (
            <button
              onClick={() => setShowRule(true)}
              disabled={showRule}
              className="mb-1 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={12} /> Add rule
            </button>
          )}
          {tab === "channels" && (
            <button
              onClick={() => setShowChannel(true)}
              disabled={showChannel}
              className="mb-1 flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={12} /> Add channel
            </button>
          )}
        </div>

        {/* Rules tab */}
        {tab === "rules" && (
          <div className="space-y-3 p-5">
            {showRule && <AddRuleForm onClose={() => setShowRule(false)} />}
            {loadingRules && Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
            ))}
            {!loadingRules && rules.length === 0 && !showRule && (
              <EmptyState icon={Bell} title="No alert rules configured" sub="Add a rule to get notified when metrics cross thresholds." />
            )}
            {rules.map((rule) => (
              <RuleCard
                key={rule.id}
                rule={rule}
                deleting={deletingRule && deletingRuleId === rule.id}
                onDelete={() => { if (confirm(`Delete "${rule.name}"?`)) deleteRule(rule.id); }}
              />
            ))}
          </div>
        )}

        {/* Channels tab */}
        {tab === "channels" && (
          <div className="space-y-3 p-5">
            {showChannel && <AddChannelForm onClose={() => setShowChannel(false)} />}
            {loadingChannels && Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
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
                onDelete={() => { if (confirm(`Remove "${ch.name}"?`)) deleteChannel(ch.id); }}
                onTest={() => testChannel(ch.id)}
              />
            ))}
          </div>
        )}

        {/* Events tab */}
        {tab === "events" && (
          <>
            {loadingEvents && (
              <div className="space-y-2 p-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />
                ))}
              </div>
            )}
            {!loadingEvents && eventList.length === 0 && (
              <div className="p-5">
                <EmptyState icon={CheckCircle2} title="No alert events fired" sub="Events appear here when a rule threshold is crossed." />
              </div>
            )}
            {eventList.length > 0 && (
              <div className="divide-y divide-slate-100">
                {eventList.slice(0, 20).map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 px-5 py-3">
                    <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-rose-50">
                      <Zap size={12} className="text-rose-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-800">
                        {ev.message ?? ev.rule_name ?? "Alert fired"}
                      </p>
                      {ev.entity_id && <p className="text-[10px] text-slate-400">Entity: {ev.entity_id}</p>}
                    </div>
                    <span className="shrink-0 text-[10px] text-slate-400">
                      {new Date(ev.fired_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
