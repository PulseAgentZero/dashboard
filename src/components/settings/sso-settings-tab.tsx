"use client";

import { useState } from "react";
import {
  ExternalLink,
  Loader2,
  LogIn,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  useDeleteSsoConfig,
  useSaveSsoConfig,
  useSsoConfig,
} from "@/hooks/sso/use-sso";
import { useLicense } from "@/hooks/webhooks/use-webhooks";
import { hasLicenseFeature } from "@/lib/feature-access";
import { useOrganization } from "@/hooks/org/use-organization";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 transition-all";

const labelCls = "block text-xs font-semibold text-slate-600";

function LockedState() {
  return (
    <div className="flex flex-col items-center py-12 text-center bg-transparent sm:bg-white sm:border sm:border-dashed sm:border-amber-200 sm:rounded-xl sm:shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 mb-3">
        <ShieldCheck size={20} className="text-amber-600" />
      </div>
      <p className="text-sm font-semibold text-slate-700">SSO requires a valid self-hosted license</p>
      <p className="mt-0.5 max-w-xs text-xs text-slate-400 px-4 leading-normal">
        Your license must include the{" "}
        <code className="font-mono text-[10px] bg-slate-100 px-1 rounded">sso</code> feature to enable OIDC or SAML single sign-on.
      </p>
    </div>
  );
}

export function SsoSettingsTab() {
  const { data: license } = useLicense();
  const { data } = useSsoConfig();
  const { data: org } = useOrganization();
  const { mutate: save, isPending } = useSaveSsoConfig();
  const { mutate: remove, isPending: deleting } = useDeleteSsoConfig();
  const { requestDeleteConfirm, deleteConfirmModal } = useDeleteConfirm();
  const cfg = data?.config;
  const [provider, setProvider] = useState<"oidc" | "saml">(cfg?.provider ?? "oidc");

  if (!hasLicenseFeature(license, "sso")) return <LockedState />;

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const domains = String(form.get("allowed_email_domains") ?? "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    save({
      provider,
      is_active: form.get("is_active") === "on",
      client_id: String(form.get("client_id") ?? "") || null,
      client_secret: String(form.get("client_secret") ?? "") || null,
      discovery_url: String(form.get("discovery_url") ?? "") || null,
      scopes: String(form.get("scopes") ?? "openid email profile"),
      email_claim: String(form.get("email_claim") ?? "email"),
      name_claim: String(form.get("name_claim") ?? "name"),
      entity_id: String(form.get("entity_id") ?? "") || null,
      metadata_url: String(form.get("metadata_url") ?? "") || null,
      metadata_xml: String(form.get("metadata_xml") ?? "") || null,
      default_role: String(form.get("default_role") ?? "viewer"),
      auto_provision_users: form.get("auto_provision_users") === "on",
      allowed_email_domains: domains,
    });
  }

  const slug = org?.slug;

  return (
    <form
      onSubmit={submit}
      className="space-y-6"
    >
      <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Single sign-on</p>
            <p className="mt-0.5 text-xs text-slate-500">Configure OIDC or SAML for your organization.</p>
          </div>
          {slug && cfg?.is_active && (
            <a
              href={`/api/v1/auth/sso/${slug}/login`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-orange-600 shadow-sm hover:bg-orange-50 transition-colors"
            >
              <LogIn size={12} /> Test SSO <ExternalLink size={10} />
            </a>
          )}
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 cursor-pointer">
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={cfg?.is_active ?? false}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-800">Enable SSO</span>
            <span className="block text-xs text-slate-500 mt-0.5">
              Users in your org will be able to sign in through the configured identity provider.
            </span>
          </span>
        </label>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelCls}>Provider</label>
            <select
              className={inputCls}
              value={provider}
              onChange={(e) => setProvider(e.target.value as "oidc" | "saml")}
            >
              <option value="oidc">OIDC</option>
              <option value="saml">SAML 2.0</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Default role for new users</label>
            <select name="default_role" className={inputCls} defaultValue={cfg?.default_role ?? "viewer"}>
              <option value="viewer">Viewer</option>
              <option value="analyst">Analyst</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>
      </section>

      {provider === "oidc" ? (
        <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">OIDC configuration</p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={labelCls}>Client ID</label>
              <input
                name="client_id"
                className={inputCls}
                placeholder="e.g. pulse-prod"
                defaultValue={cfg?.client_id ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Client secret</label>
              <input
                name="client_secret"
                className={inputCls}
                type="password"
                placeholder={cfg?.client_secret_set ? "•••••• (already set)" : "Paste client secret"}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className={labelCls}>Discovery URL</label>
              <input
                name="discovery_url"
                className={inputCls}
                placeholder="https://idp.example/.well-known/openid-configuration"
                defaultValue={cfg?.discovery_url ?? ""}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className={labelCls}>Scopes</label>
              <input
                name="scopes"
                className={inputCls}
                defaultValue={cfg?.scopes ?? "openid email profile"}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Email claim</label>
              <input name="email_claim" className={inputCls} defaultValue={cfg?.email_claim ?? "email"} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Name claim</label>
              <input name="name_claim" className={inputCls} defaultValue={cfg?.name_claim ?? "name"} />
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">SAML configuration</p>
          <div className="grid gap-4 grid-cols-1">
            <div className="space-y-1.5">
              <label className={labelCls}>SP entity ID</label>
              <input
                name="entity_id"
                className={inputCls}
                placeholder="https://pulse.example.com"
                defaultValue={cfg?.entity_id ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>IdP metadata URL</label>
              <input
                name="metadata_url"
                className={inputCls}
                placeholder="https://idp.example/saml/metadata"
                defaultValue={cfg?.metadata_url ?? ""}
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>
                IdP metadata XML
                {cfg?.metadata_xml_set && (
                  <span className="ml-2 text-[10px] font-medium text-emerald-600 normal-case tracking-normal">
                    (already saved)
                  </span>
                )}
              </label>
              <textarea
                name="metadata_xml"
                rows={6}
                className={`${inputCls} font-mono text-xs leading-relaxed`}
                placeholder="<EntityDescriptor xmlns=&quot;urn:oasis:names:tc:SAML:2.0:metadata&quot; ..."
              />
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">User provisioning</p>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelCls}>Allowed email domains</label>
            <input
              name="allowed_email_domains"
              className={inputCls}
              placeholder="example.com, partner.io"
              defaultValue={(cfg?.allowed_email_domains ?? []).join(", ")}
            />
            <p className="text-[11px] text-slate-400">Comma-separated. Leave empty to allow all domains.</p>
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 cursor-pointer">
            <input
              name="auto_provision_users"
              type="checkbox"
              defaultChecked={cfg?.auto_provision_users ?? true}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-slate-800">Auto-provision users on first login</span>
              <span className="block text-xs text-slate-500 mt-0.5">
                Create a new Pulse user when an unknown email signs in through SSO.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:border-t sm:border-slate-100 sm:pt-4">
        {cfg && (
          <button
            type="button"
            disabled={deleting}
            onClick={() =>
              requestDeleteConfirm({
                title: "Remove SSO configuration",
                description: "Existing SSO sessions will keep working, but new SSO logins will fail until you set it up again.",
                confirmLabel: "Remove",
                onConfirm: () => remove(),
              })
            }
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 disabled:opacity-50 shadow-sm transition-colors w-full sm:w-auto"
          >
            {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Remove SSO
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm w-full sm:w-auto"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isPending ? "Saving…" : "Save SSO"}
        </button>
      </div>

      {deleteConfirmModal}
    </form>
  );
}
