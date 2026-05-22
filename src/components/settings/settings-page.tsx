"use client";

import { useMemo, useState } from "react";
import {
  Bot, Building2, Copy, Download, Eye, EyeOff,
  KeyRound, Loader2, LogIn, Plus, Radio, Server, ShieldCheck, Trash2, User, Webhook,
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
import { LogStreamsSettingsTab } from "@/components/settings/log-streams-settings-tab";
import { SsoSettingsTab } from "@/components/settings/sso-settings-tab";
import { LdapSettingsTab } from "@/components/settings/ldap-settings-tab";
import {
  changePasswordSchema,
  profileSchema,
  useFormValidation,
} from "@/lib/validation";
import { FieldError } from "@/components/ui/field-error";
import { api } from "@/lib/api/client";
import { hasMinRole } from "@/lib/permissions";
import { RetakeTourButton } from "@/components/tour/retake-tour-button";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import {
  DeleteAccountSection,
  DeleteOrgSection,
  OrgSecuritySection,
  TwoFactorAccountSection,
} from "@/components/settings/security-settings-section";

const ALL_TABS = [
  { id: "org", label: "Organization", icon: Building2 },
  { id: "account", label: "My account", icon: User },
  { id: "apikeys", label: "API keys", icon: KeyRound },
  { id: "llm", label: "LLM keys", icon: Bot, selfHostedOnly: true },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "log-streams", label: "Log streams", icon: Radio, selfHostedOnly: true },
  { id: "sso", label: "SSO", icon: LogIn, selfHostedOnly: true },
  { id: "ldap", label: "LDAP", icon: Server, selfHostedOnly: true },
  { id: "license", label: "License", icon: ShieldCheck, selfHostedOnly: true },
] as const;

type Tab = (typeof ALL_TABS)[number]["id"];

function getVisibleTabs(role: string | undefined) {
  const cloud = isCloudDeployment();
  return ALL_TABS.filter((t) => {
    if (cloud && "selfHostedOnly" in t && t.selfHostedOnly) return false;
    if (t.id === "apikeys") return hasMinRole(role, "manager");
    if (t.id === "webhooks" || t.id === "llm" || t.id === "license" || t.id === "log-streams" || t.id === "sso" || t.id === "ldap") {
      return hasMinRole(role, "admin");
    }
    return true;
  });
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
      {hint && <p className="text-xs leading-normal text-slate-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-400 transition-all";

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
  const canManageOrgSettings = hasMinRole(user?.role, "manager");

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canManageOrgSettings) {
      toast.error("Only admins and managers can update organization settings.");
      return;
    }
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
          <div key={i} className="space-y-1">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-slate-100" />
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

      <div className="grid gap-5 sm:grid-cols-2">
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
          <select
            name="industry"
            className={inputCls}
            defaultValue={org?.industry ?? ""}
            disabled={!canManageOrgSettings}
          >
            <option value="">Select industry…</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Business context" hint="Describe your business so Entivia can generate context-aware recommendations.">
        <textarea
          name="business_context"
          className={`${inputCls} min-h-[100px] resize-y`}
          defaultValue={org?.business_context ?? ""}
          placeholder="We are a telecom operator managing enterprise accounts across 12 regions…"
          disabled={!canManageOrgSettings}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Entity label" hint="What you call the primary entities Entivia profiles (e.g. Customer, Account, Supplier).">
          <input name="entity_label" className={inputCls} defaultValue={org?.entity_label ?? ""} placeholder="Customer" disabled={!canManageOrgSettings} />
        </Field>
        <Field label="Goal label" hint="The primary outcome Entivia optimises for (e.g. Reduce churn, Increase ARPU).">
          <input name="goal_label" className={inputCls} defaultValue={org?.goal_label ?? ""} placeholder="Reduce churn" disabled={!canManageOrgSettings} />
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

      <OrgSecuritySection />
      <DeleteOrgSection />

      {org && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-500 leading-relaxed">
          Plan: <span className="font-semibold capitalize text-slate-700">{org.plan ?? "free"}</span>
          {" · "}Slug: <span className="font-mono text-slate-700">{org.slug ?? "—"}</span>
          {" · "}Created: <span className="text-slate-700">{new Date(org.created_at).toLocaleDateString()}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <RetakeTourButton />
          {isAdmin && (
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <Download size={13} /> Export org data
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending || !canManageOrgSettings}
          className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
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
      <section className="space-y-4">
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name">
              <input
                key={user?.id}
                name="full_name"
                className={profileErrors.full_name ? `${inputCls} border-rose-300` : inputCls}
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
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Role">
              <input className={inputCls} value={user?.role ?? ""} disabled readOnly />
            </Field>
          </div>
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button type="submit" disabled={updatingMe}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors">
              {updatingMe && <Loader2 size={14} className="animate-spin" />}
              {updatingMe ? "Saving…" : "Update profile"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Product tour</p>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <p className="text-xs leading-normal text-slate-500">
            Walk through the dashboard layout, connections, and notifications again anytime.
          </p>
          <div className="mt-3">
            <RetakeTourButton />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Change password</p>
        <form onSubmit={handlePassword} className="space-y-5">
          <Field label="Current password">
            <input type="password" className={pwdInputCls("current")} value={pwd.current}
              onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))}
              placeholder="••••••••" autoComplete="current-password"
              aria-invalid={Boolean(pwdErrors.current)} />
            <FieldError message={pwdErrors.current} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
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
              className="flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50 transition-colors">
              {updatingPwd && <Loader2 size={14} className="animate-spin" />}
              <KeyRound size={13} />
              {updatingPwd ? "Updating…" : "Change password"}
            </button>
          </div>
        </form>
      </section>

      <TwoFactorAccountSection />
      <DeleteAccountSection />
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
    <div className="space-y-5">
      <section className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">API keys</p>
          <p className="mt-0.5 text-xs text-slate-400">Use these keys to authenticate programmatic access to the Entivia API.</p>
        </div>

        {slot && (
          <div className="space-y-1.5">
            <UsageBar used={slot.used} limit={slot.limit} label="API keys used" />
            {atLimit && isCloudDeployment() && (
              <p className="text-xs text-slate-400 leading-normal">
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
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-2">
            <p className="text-xs font-semibold text-emerald-800">Key created — copy it now, it won&apos;t be shown again.</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg border border-emerald-200 bg-white px-3 py-2 font-mono text-xs text-slate-800 select-all">
                {revealed === newKey.id ? newKey.key : `${newKey.key.slice(0, 12)}${"•".repeat(24)}`}
              </code>
              <button onClick={() => setRevealed(revealed === newKey.id ? null : newKey.id)} className="shrink-0 rounded-lg p-2 text-emerald-600 hover:bg-emerald-100/60 hover:text-emerald-800 transition-colors">
                {revealed === newKey.id ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
              <button onClick={() => { void navigator.clipboard.writeText(newKey.key); toast.success("Copied!"); }} className="shrink-0 rounded-lg p-2 text-emerald-600 hover:bg-emerald-100/60 hover:text-emerald-800 transition-colors">
                <Copy size={15} />
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="space-y-4 rounded-xl border border-orange-200 bg-orange-50/20 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700">New API key</p>
              <button type="button" onClick={() => setShowForm(false)} className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors">Cancel</button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input className={inputCls} required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="CI pipeline key" />
              </Field>
              <Field label="Scope">
                <select className={inputCls} value={form.scope} onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}>
                  <option value="read">read</option>
                  <option value="write">write</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end pt-1">
              <button type="submit" disabled={creating} className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors">
                {creating && <Loader2 size={13} className="animate-spin" />}
                {creating ? "Creating…" : "Create key"}
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {isLoading && Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
          {!isLoading && keyList.length === 0 && !showForm && <p className="py-6 text-center text-xs text-slate-400">No API keys generated yet.</p>}
          {keyList.map((key) => (
            <div key={key.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/40 px-4 py-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">{key.name}</p>
                <p className="text-xs text-slate-400 flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 font-bold uppercase tracking-wide">{key.scope}</span>
                  <span>·</span>
                  <span className="font-mono">{key.key_prefix}••••</span>
                  {key.last_used_at && (
                    <>
                      <span>·</span>
                      <span>Last used {new Date(key.last_used_at).toLocaleDateString()}</span>
                    </>
                  )}
                  {key.expires_at && (
                    <>
                      <span>·</span>
                      <span>Expires {new Date(key.expires_at).toLocaleDateString()}</span>
                    </>
                  )}
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
                className="flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50 transition-colors">
                {revoking && revokingId === key.id ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
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
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <Plus size={13} /> Generate new key
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
          <div key={i} className="space-y-1">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  const providers = [
    {
      name: "anthropic" as const,
      label: "Anthropic (Claude)",
      placeholder: "sk-ant-…",
      show: showAnthropic,
      toggle: () => setShowAnthropic((s) => !s),
      state: llm?.anthropic,
    },
    {
      name: "groq" as const,
      label: "Groq",
      placeholder: "gsk_…",
      show: showGroq,
      toggle: () => setShowGroq((s) => !s),
      state: llm?.groq,
    },
  ];

  return (
    <form
      key={`${llm?.anthropic?.source}-${llm?.groq?.source}`}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-xl border border-orange-100 bg-orange-50/30 px-4 py-3 text-xs text-orange-800 leading-normal">
        LLM keys are stored securely using symmetric encryption and are referenced exclusively for context-rich AI processing blocks on your self-hosted instance.
      </div>
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Provider keys</p>
        <div className="space-y-4">
          {providers.map(({ name, label, placeholder, show, toggle, state }) => {
            const fromEnv = state?.source === "env";
            const fromDb = state?.source === "db";
            const configured = !!state?.configured;
            return (
              <div key={name} className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">{label}</label>
                <div className="relative">
                  <input
                    name={name}
                    type={show ? "text" : "password"}
                    className={`${inputCls} pr-10 ${fromEnv ? "bg-slate-50 text-slate-400" : ""}`}
                    defaultValue=""
                    placeholder={fromEnv ? "Configured via .env (read-only)" : placeholder}
                    autoComplete="off"
                    disabled={fromEnv}
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    disabled={fromEnv}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-40"
                  >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {fromEnv && (
                  <p className="text-[11px] font-medium text-blue-600 flex items-center gap-1">
                    ✓ Set in environment ({name === "anthropic" ? "ANTHROPIC_API_KEY" : "GROQ_API_KEY"}).
                    Edit your <code className="font-mono text-[10px]">.env</code> to change it, or
                    paste a key below to override for this org.
                  </p>
                )}
                {fromDb && (
                  <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                    ✓ Saved (overrides environment)
                  </p>
                )}
                {!configured && (
                  <p className="text-[11px] text-slate-400">
                    No key configured. Pipelines using this provider will fail.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <div className="flex justify-end border-t border-slate-100 pt-4">
        <button type="submit" disabled={isPending} className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors">
          {isPending && <Loader2 size={14} className="animate-spin" />}
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

  const envProvisioned = !!license?.env_provisioned;
  const envProvisionError = license?.env_provision_error;

  return (
    <div className="space-y-6">
      {isLoading && <div className="h-24 animate-pulse rounded-xl bg-slate-100" />}

      {!isLoading && envProvisionError && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold">PULSE_LICENSE_KEY could not be activated</p>
          <p className="mt-1">{envProvisionError}</p>
          <p className="mt-2 text-amber-800">
            Verify the value in your <code className="font-mono">.env</code> and restart the
            instance, or paste a fresh key below.
          </p>
        </div>
      )}

      {!isLoading && !isError && license && (
        <div className={`rounded-xl border p-5 ${license.is_valid ? "border-emerald-200 bg-emerald-50/40" : "border-rose-200 bg-rose-50/40"}`}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className={license.is_valid ? "text-emerald-600" : "text-rose-600"} />
            <p className={`text-sm font-semibold ${license.is_valid ? "text-emerald-800" : "text-rose-800"}`}>
              {license.is_valid ? "License active" : "License invalid or expired"}
            </p>
            {envProvisioned && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                Provisioned via .env
              </span>
            )}
          </div>
          <div className="grid gap-3 text-xs sm:grid-cols-2">
            <div>
              <span className="text-slate-400">Plan</span>
              <span className="ml-2 font-semibold capitalize text-slate-700">{license.plan}</span>
            </div>
            {license.seats != null && (
              <div>
                <span className="text-slate-400">Seats</span>
                <span className="ml-2 font-semibold text-slate-700">{license.seats}</span>
              </div>
            )}
            {license.expires_at && (
              <div>
                <span className="text-slate-400">Expires</span>
                <span className="ml-2 font-semibold text-slate-700">{new Date(license.expires_at).toLocaleDateString()}</span>
              </div>
            )}
            {license.issued_to && (
              <div>
                <span className="text-slate-400">Issued to</span>
                <span className="ml-2 font-semibold text-slate-700">{license.issued_to}</span>
              </div>
            )}
            {license.effective_limits?.concurrent_pipeline_runs && (
              <div>
                <span className="text-slate-400">Concurrent pipelines</span>
                <span className="ml-2 font-semibold text-slate-700">{license.effective_limits.concurrent_pipeline_runs}</span>
              </div>
            )}
          </div>
          {license.features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100/80 pt-3">
              {license.features.map((f) => (
                <span key={f} className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">{f}</span>
              ))}
            </div>
          )}
        </div>
      )}

      {(isError || (!isLoading && !license)) && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/40 px-5 py-6 text-center">
          <p className="text-sm font-medium text-slate-600">No active instance license found</p>
          <p className="mt-0.5 text-xs text-slate-400">Activate a Pro bundle to unlock SSO, LDAP, audit log, and high-concurrency pipelines.</p>
        </div>
      )}

      <section className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {envProvisioned ? "Replace license" : "Activate license"}
        </p>
        {envProvisioned && (
          <p className="text-xs text-slate-500 leading-relaxed">
            This instance is using a key set via <code className="font-mono">PULSE_LICENSE_KEY</code> in your
            environment. Pasting a new key below will override it for this org until the next restart.
          </p>
        )}
        <form onSubmit={handleActivate} className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <input
            className={`${inputCls} font-mono sm:flex-1`}
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="plc_…"
            required
          />
          <button type="submit" disabled={isPending || !key.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors sm:w-auto shrink-0">
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {isPending ? "Activating…" : "Activate"}
          </button>
        </form>
      </section>
    </div>
  );
}

// ─── Settings page ────────────────────────────────────────────────────────────

export function SettingsPage() {
  const { user } = useAuth();
  const visibleTabs = useMemo(() => getVisibleTabs(user?.role), [user?.role]);
  const [tab, setTab] = useState<Tab>("org");

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage your organization profile and account preferences.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-4 no-scrollbar lg:flex-wrap lg:overflow-visible lg:px-5 bg-slate-50/50">
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
                tab === id
                  ? "border-orange-600 text-orange-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 md:p-6">
          {tab === "org" && <OrgTab />}
          {tab === "account" && <AccountTab />}
          {tab === "apikeys" && <ApiKeysTab />}
          {tab === "llm" && <LlmKeysTab />}
          {tab === "webhooks" && <WebhooksSettingsTab />}
          {tab === "log-streams" && <LogStreamsSettingsTab />}
          {tab === "sso" && <SsoSettingsTab />}
          {tab === "ldap" && <LdapSettingsTab />}
          {tab === "license" && <LicenseTab />}
        </div>
      </div>
    </div>
  );
}