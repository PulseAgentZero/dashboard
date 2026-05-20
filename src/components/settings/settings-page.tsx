"use client";

import { useMemo, useState } from "react";
import {
  Bot, Building2, Copy, Download, Eye, EyeOff,
  KeyRound, Loader2, Plus, ShieldCheck, Trash2, User, Webhook,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";
import {
  useOrganization,
  useRemoveOrgLogo,
  useUpdateOrganization,
  useUploadOrgLogo,
} from "@/hooks/org/use-organization";
import { usePatchMemberSettings } from "@/hooks/org/use-member-settings";
import {
  useRemoveAvatar,
  useUpdateMe,
  useUpdatePassword,
  useUploadAvatar,
} from "@/hooks/users/use-users";
import { ImageUploadField } from "@/components/settings/image-upload-field";
import Link from "next/link";
import { useApiKeys, useCreateApiKey, useRevokeApiKey, useLlmKeys, useUpdateLlmKeys } from "@/hooks/apikeys/use-apikeys";
import { useUsage } from "@/hooks/usage/use-usage";
import { UsageBar } from "@/components/shared/usage-bar";
import { isCloudDeployment } from "@/lib/deployment";
import { useLicense, useActivateLicense } from "@/hooks/webhooks/use-webhooks";
import { WebhooksSettingsTab } from "@/components/settings/webhooks-settings-tab";
import {
  changePasswordSchema,
  profileSchema,
  useFormValidation,
} from "@/lib/validation";
import { FieldError } from "@/components/ui/field-error";
import { api } from "@/lib/api/client";
import { RetakeTourButton } from "@/components/tour/retake-tour-button";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";

const ALL_TABS = [
  { id: "org", label: "Organization", icon: Building2 },
  { id: "account", label: "My account", icon: User },
  { id: "apikeys", label: "API keys", icon: KeyRound },
  { id: "llm", label: "LLM keys", icon: Bot, selfHostedOnly: true },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "license", label: "License", icon: ShieldCheck, selfHostedOnly: true },
] as const;

type Tab = (typeof ALL_TABS)[number]["id"];

function getVisibleTabs() {
  const cloud = isCloudDeployment();
  return ALL_TABS.filter((t) => !cloud || !("selfHostedOnly" in t && t.selfHostedOnly));
}

const INDUSTRIES = [
  "Telecom", "Healthcare", "Retail & FMCG", "Logistics & Supply Chain",
  "Financial Services", "Insurance", "Energy & Utilities", "Manufacturing",
  "Technology", "Education", "Other",
];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-[11px] leading-normal text-slate-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 transition-all";

// ─── Organization ────────────────────────────────────────────────────────────

function OrgTab() {
  const { data: org, isLoading } = useOrganization();
  const { user } = useAuth();
  const { mutate: update, isPending: updating } = useUpdateOrganization();
  const { mutate: patchMember, isPending: patching } = usePatchMemberSettings();
  const isPending = updating || patching;
  const { mutate: uploadLogo, isPending: uploadingLogo } = useUploadOrgLogo();
  const { mutate: removeLogo, isPending: removingLogo } = useRemoveOrgLogo();
  const isAdmin = user?.role === "admin";

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const contextFields = {
      industry: (d.get("industry") as string) || undefined,
      business_context: (d.get("business_context") as string) || undefined,
      entity_label: (d.get("entity_label") as string) || undefined,
      goal_label: (d.get("goal_label") as string) || undefined,
    };
    if (isAdmin) {
      update({
        name: (d.get("name") as string) || undefined,
        ...contextFields,
        timezone: (d.get("timezone") as string) || undefined,
      });
    } else {
      patchMember(contextFields);
    }
  }

  async function handleExport() {
    try {
      const data = await api.get<unknown>("/organization/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "organization-export.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Export failed");
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form key={org?.id} onSubmit={handleSubmit} className="space-y-6">
      <ImageUploadField
        label="Business logo"
        hint={
          isAdmin
            ? "Shown in the sidebar and shared exports. Square images work best."
            : "Only organization admins can change the business logo."
        }
        imageUrl={org?.logo_url}
        fallbackLabel={org?.name ?? "Org"}
        shape="square"
        disabled={!isAdmin}
        uploading={uploadingLogo || removingLogo}
        onUpload={(file) => uploadLogo(file)}
        onRemove={() => removeLogo()}
      />

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <Field label="Organization name">
          <input
            name="name"
            className={inputCls}
            defaultValue={org?.name ?? ""}
            placeholder="Acme Corp"
            disabled={!isAdmin}
          />
        </Field>
        <Field label="Industry">
          <div className="relative">
            <select name="industry" className={`${inputCls} appearance-none pr-8`} defaultValue={org?.industry ?? ""}>
              <option value="">Select industry…</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </Field>
      </div>

      <Field label="Business context" hint="Describe your business so Entivia can generate context-aware recommendations.">
        <textarea
          name="business_context"
          className={`${inputCls} min-h-[100px] resize-y`}
          defaultValue={org?.business_context ?? ""}
          placeholder="We are a telecom operator managing enterprise accounts across 12 regions…"
        />
      </Field>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <Field label="Entity label" hint="What you call the primary entities Entivia profiles (e.g. Customer, Account, Supplier).">
          <input name="entity_label" className={inputCls} defaultValue={org?.entity_label ?? ""} placeholder="Customer" />
        </Field>
        <Field label="Goal label" hint="The primary outcome Entivia optimises for (e.g. Reduce churn, Increase ARPU).">
          <input name="goal_label" className={inputCls} defaultValue={org?.goal_label ?? ""} placeholder="Reduce churn" />
        </Field>
      </div>

      <Field label="Timezone">
        <input
          name="timezone"
          className={inputCls}
          defaultValue={org?.timezone ?? ""}
          placeholder="UTC"
          disabled={!isAdmin}
        />
      </Field>

      {org && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Plan: <span className="font-semibold capitalize text-slate-700">{org.plan ?? "free"}</span>
          {" · "}Slug: <span className="font-mono text-slate-700">{org.slug ?? "—"}</span>
          {" · "}Created: <span className="text-slate-700">{new Date(org.created_at).toLocaleDateString()}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <RetakeTourButton />
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Download size={15} className="text-slate-400" /> Export org data
          </button>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

// ─── Account ─────────────────────────────────────────────────────────────────

function AccountTab() {
  const { user } = useAuth();
  const { mutate: updateMe, isPending: updatingMe } = useUpdateMe();
  const { mutate: uploadAvatar, isPending: uploadingAvatar } = useUploadAvatar();
  const { mutate: removeAvatar, isPending: removingAvatar } = useRemoveAvatar();
  const { mutate: updatePwd, isPending: updatingPwd } = useUpdatePassword();
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const {
    fieldErrors: profileErrors,
    clearErrors: clearProfileErrors,
    validateFormData: validateProfile,
    handleApiError: handleProfileApiError,
  } = useFormValidation();
  const {
    fieldErrors: pwdErrors,
    clearErrors: clearPwdErrors,
    validate: validatePassword,
    handleApiError: handlePasswordApiError,
  } = useFormValidation();

  function handleProfile(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    clearProfileErrors();
    const data = validateProfile(profileSchema, new FormData(e.currentTarget));
    if (!data) return;
    updateMe(
      { full_name: data.full_name },
      { onError: handleProfileApiError },
    );
  }

  function handlePassword(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    clearPwdErrors();
    const data = validatePassword(changePasswordSchema, {
      current_password: pwd.current,
      new_password: pwd.next,
      confirm: pwd.confirm,
    });
    if (!data) return;
    updatePwd(
      { current_password: data.current_password, new_password: data.new_password },
      {
        onSuccess: () => setPwd({ current: "", next: "", confirm: "" }),
        onError: handlePasswordApiError,
      },
    );
  }

  const pwdInputCls = (key: keyof typeof pwd) =>
    `${inputCls}${pwdErrors[key] ? " border-rose-300 focus:border-rose-500 focus:ring-rose-100" : ""}`;

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile</p>
        <form onSubmit={handleProfile} className="space-y-5">
          <ImageUploadField
            label="Profile photo"
            hint="Your photo appears in the sidebar and team member list."
            imageUrl={user?.profile_image_url}
            fallbackLabel={user?.full_name || user?.email || "User"}
            shape="circle"
            uploading={uploadingAvatar || removingAvatar}
            onUpload={(file) => uploadAvatar(file)}
            onRemove={() => removeAvatar()}
          />

          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
            <Field label="Full name">
              <input
                key={user?.id}
                name="full_name"
                className={profileErrors.full_name ? `${inputCls} border-rose-300 focus:border-rose-500 focus:ring-rose-100` : inputCls}
                defaultValue={user?.full_name ?? ""}
                placeholder="Your name"
                aria-invalid={Boolean(profileErrors.full_name)}
              />
              <FieldError message={profileErrors.full_name} />
            </Field>
            <Field label="Email">
              <input className={inputCls} value={user?.email ?? ""} disabled readOnly />
            </Field>
          </div>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
            <Field label="Role">
              <input className={inputCls} value={user?.role ?? ""} disabled readOnly />
            </Field>
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button type="submit" disabled={updatingMe}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm">
              {updatingMe && <Loader2 size={15} className="animate-spin" />}
              {updatingMe ? "Saving…" : "Update profile"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Product tour</p>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <p className="text-sm text-slate-600 leading-normal">
            Walk through the dashboard layout, connections, and system modules again anytime.
          </p>
          <RetakeTourButton />
        </div>
      </section>

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Change password</p>
        <form onSubmit={handlePassword} className="space-y-5">
          <Field label="Current password">
            <input type="password" className={pwdInputCls("current")} value={pwd.current}
              onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
              placeholder="••••••••" autoComplete="current-password"
              aria-invalid={Boolean(pwdErrors.current)} />
            <FieldError message={pwdErrors.current} />
          </Field>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
            <Field label="New password">
              <input type="password" className={pwdInputCls("next")} value={pwd.next}
                onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))}
                placeholder="••••••••" autoComplete="new-password"
                aria-invalid={Boolean(pwdErrors.next)} />
              <FieldError message={pwdErrors.next} />
            </Field>
            <Field label="Confirm new password">
              <input type="password" className={pwdInputCls("confirm")} value={pwd.confirm}
                onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
                placeholder="••••••••" autoComplete="new-password"
                aria-invalid={Boolean(pwdErrors.confirm)} />
              <FieldError message={pwdErrors.confirm} />
            </Field>
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button type="submit" disabled={updatingPwd || !pwd.current || !pwd.next}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm">
              {updatingPwd && <Loader2 size={15} className="animate-spin" />}
              <KeyRound size={15} className="text-slate-400" />
              {updatingPwd ? "Updating…" : "Change password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

function ApiKeysTab() {
  const { data: keys, isLoading } = useApiKeys();
  const { data: usage } = useUsage();
  const { mutate: create, isPending: creating, data: newKey } = useCreateApiKey();
  const { mutate: revoke, isPending: revoking, variables: revokingId } = useRevokeApiKey();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", scope: "read" });
  const [revealed, setRevealed] = useState<string | null>(null);
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();

  const slot = usage?.limits?.api_keys;
  const atLimit = slot ? slot.limit !== null && slot.used >= slot.limit : false;

  function handleCreate(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    create({ name: form.name, scope: form.scope }, {
      onSuccess: () => { setForm({ name: "", scope: "read" }); setShowForm(false); },
    });
  }

  const keyList = keys ?? [];

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">API keys</p>
          <p className="mt-0.5 text-xs text-slate-500">Use these keys to authenticate programmatic access to the Entivia API.</p>
        </div>

        {slot && (
          <div className="space-y-2">
            <UsageBar used={slot.used} limit={slot.limit} label="API keys used" />
            {atLimit && isCloudDeployment() && (
              <p className="text-xs text-slate-500">
                Your plan allows {slot.limit} API key.{" "}
                <Link href="/dashboard/plan" className="font-semibold text-orange-600 hover:underline">
                  Upgrade plan
                </Link>{" "}
                for unlimited keys.
              </p>
            )}
          </div>
        )}

        {newKey?.key && (
          <div className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Key created — copy it now, it won&apos;t be shown again.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800">
                {revealed === newKey.id ? newKey.key : `${newKey.key.slice(0, 12)}${"•".repeat(24)}`}
              </code>
              <button onClick={() => setRevealed(revealed === newKey.id ? null : newKey.id)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
                {revealed === newKey.id ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button onClick={() => { void navigator.clipboard.writeText(newKey.key); toast.success("Copied!"); }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
                <Copy size={15} />
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">New API key</p>
              <button type="button" onClick={() => setShowForm(false)} className="text-xs font-semibold text-slate-400 hover:text-slate-700">Cancel</button>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <Field label="Name">
                <input className={inputCls} required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="CI pipeline key" />
              </Field>
              <Field label="Scope">
                <div className="relative">
                  <select className={`${inputCls} appearance-none pr-8`} value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}>
                    <option value="read">read</option>
                    <option value="write">write</option>
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </Field>
            </div>
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button type="submit" disabled={creating} className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm">
                {creating && <Loader2 size={14} className="animate-spin" />}
                {creating ? "Creating…" : "Create key"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {isLoading && Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
          {!isLoading && keyList.length === 0 && !showForm && <p className="py-6 text-center text-xs text-slate-400 rounded-xl border border-dashed border-slate-200">No generated API keys found.</p>}
          {keyList.map((key) => (
            <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-slate-900">{key.name}</p>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">{key.scope}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  Code: <span className="font-mono text-slate-700">{key.key_prefix}••••</span>
                  {key.last_used_at && ` · Last active ${new Date(key.last_used_at).toLocaleDateString()}`}
                  {key.expires_at && ` · Expires ${new Date(key.expires_at).toLocaleDateString()}`}
                </p>
              </div>
              <button disabled={revoking && revokingId === key.id}
                onClick={() =>
                  requestDeleteConfirm({
                    title: "Revoke API key",
                    description: `Revoke "${key.name}"? Applications using this key will lose access immediately.`,
                    confirmLabel: "Revoke",
                    onConfirm: () => revoke(key.id),
                  })
                }
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 disabled:opacity-50 shadow-sm transition-colors self-start sm:self-center">
                {revoking && revokingId === key.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Revoke
              </button>
            </div>
          ))}
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            disabled={atLimit}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <Plus size={16} className="text-slate-400" /> Generate new key
          </button>
        )}
      </section>

      {deleteConfirmModal}
    </div>
  );
}

// ─── LLM Keys ────────────────────────────────────────────────────────────────

function LlmKeysTab() {
  const { data: llm, isLoading } = useLlmKeys();
  const { mutate: update, isPending } = useUpdateLlmKeys();
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [showGroq, setShowGroq] = useState(false);

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    update({
      anthropic: (d.get("anthropic") as string) || null,
      groq: (d.get("groq") as string) || null,
    });
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <form key={`${llm?.anthropic}-${llm?.groq}`} onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm text-xs text-amber-800 leading-normal">
        LLM keys are stored encrypted and used only for AI pipeline runs on self-hosted deployments.
      </div>
      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Provider keys</p>
        <div className="space-y-4">
          {([
            { name: "anthropic", label: "Anthropic (Claude)", placeholder: "sk-ant-…", show: showAnthropic, toggle: () => setShowAnthropic((s) => !s), configured: !!llm?.anthropic },
            { name: "groq", label: "Groq", placeholder: "gsk_…", show: showGroq, toggle: () => setShowGroq((s) => !s), configured: !!llm?.groq },
          ] as const).map(({ name, label, placeholder, show, toggle, configured }) => (
            <div key={name} className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">{label}</label>
              <div className="relative">
                <input
                  name={name}
                  type={show ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  defaultValue={name === "anthropic" ? (llm?.anthropic ?? "") : (llm?.groq ?? "")}
                  placeholder={placeholder}
                  autoComplete="off"
                />
                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {configured && <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">✓ Key active</p>}
            </div>
          ))}
        </div>
      </section>
      <div className="flex justify-end border-t border-slate-100 pt-4">
        <button type="submit" disabled={isPending} className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm">
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? "Saving…" : "Save keys"}
        </button>
      </div>
    </form>
  );
}


// ─── License ─────────────────────────────────────────────────────────────────

function LicenseTab() {
  const { data: license, isLoading, isError } = useLicense();
  const { mutate: activate, isPending } = useActivateLicense();
  const [key, setKey] = useState("");

  function handleActivate(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    activate(key, { onSuccess: () => setKey("") });
  }

  return (
    <div className="space-y-6">
      {isLoading && <div className="h-28 animate-pulse rounded-xl bg-slate-100" />}

      {!isLoading && !isError && license && (
        <div className={`rounded-xl border p-5 shadow-sm bg-white ${license.is_valid ? "border-emerald-200" : "border-rose-200"}`}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={18} className={license.is_valid ? "text-emerald-600" : "text-rose-600"} />
            <p className={`text-sm font-bold ${license.is_valid ? "text-emerald-800" : "text-rose-800"}`}>
              {license.is_valid ? "License verification successful" : "License invalid or expired"}
            </p>
          </div>
          <div className="grid gap-3 text-xs grid-cols-1 sm:grid-cols-2 border-t border-slate-50 pt-3">
            <div>
              <span className="text-slate-400">Plan</span>
              <span className="ml-2 font-semibold capitalize text-slate-800">{license.plan}</span>
            </div>
            {license.seats != null && (
              <div>
                <span className="text-slate-400">Seats</span>
                <span className="ml-2 font-semibold text-slate-800">{license.seats}</span>
              </div>
            )}
            {license.expires_at && (
              <div>
                <span className="text-slate-400">Expires</span>
                <span className="ml-2 font-semibold text-slate-800">{new Date(license.expires_at).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
              </div>
            )}
            {license.issued_to && (
              <div>
                <span className="text-slate-400">Issued to</span>
                <span className="ml-2 font-semibold text-slate-800">{license.issued_to}</span>
              </div>
            )}
          </div>
          {license.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-50 pt-3">
              {license.features.map((f) => (
                <span key={f} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 border border-slate-200">{f}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {(isError || (!isLoading && !license)) && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">No enterprise license found</p>
          <p className="mt-0.5 text-xs text-slate-400">Activate a product license key to unlock additional workspace limits.</p>
        </div>
      )}

      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Activate core license</p>
        <form onSubmit={handleActivate} className="flex flex-col sm:flex-row gap-3">
          <input
            className={`${inputCls} flex-1 font-mono`}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="ENTIVIA-XXXX-XXXX-XXXX"
            required
          />
          <button type="submit" disabled={isPending || !key.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm sm:shrink-0">
            {isPending && <Loader2 size={14} className="animate-spin" />}
            {isPending ? "Activating…" : "Activate"}
          </button>
        </form>
      </section>
    </div>
  );
}

// ─── Settings page ────────────────────────────────────────────────────────────

export function SettingsPage() {
  const visibleTabs = useMemo(() => getVisibleTabs(), []);
  const [tab, setTab] = useState<Tab>("org");

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage your organization profile, security configurations, and token keys.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b border-slate-100 bg-slate-50/50 px-5 pt-3">
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                tab === id
                  ? "border-orange-600 text-orange-600 bg-white rounded-t-xl border-t border-x border-slate-200 -mb-[1px] shadow-sm"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={15} className={tab === id ? "text-orange-600" : "text-slate-400"} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8">
          {tab === "org" && <OrgTab />}
          {tab === "account" && <AccountTab />}
          {tab === "apikeys" && <ApiKeysTab />}
          {tab === "llm" && <LlmKeysTab />}
          {tab === "webhooks" && <WebhooksSettingsTab />}
          {tab === "license" && <LicenseTab />}
        </div>
      </div>
    </div>
  );
}