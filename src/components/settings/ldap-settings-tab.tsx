"use client";

import { CheckCircle2, Loader2, Play, RefreshCw, Save, ShieldCheck, XCircle } from "lucide-react";
import {
  useLdapConfig,
  useSaveLdapConfig,
  useSyncLdapNow,
  useTestLdapConnection,
} from "@/hooks/ldap/use-ldap";
import { useLicense } from "@/hooks/webhooks/use-webhooks";
import { hasLicenseFeature } from "@/lib/feature-access";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 transition-all";

const labelCls = "block text-xs font-semibold text-slate-600";

function LockedState() {
  return (
    <div className="flex flex-col items-center py-12 text-center bg-transparent sm:bg-white sm:border sm:border-dashed sm:border-amber-200 sm:rounded-xl sm:shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 mb-3">
        <ShieldCheck size={20} className="text-amber-600" />
      </div>
      <p className="text-sm font-semibold text-slate-700">LDAP sync requires a self-hosted license</p>
      <p className="mt-0.5 max-w-xs text-xs text-slate-400 px-4 leading-normal">
        Your license must include the{" "}
        <code className="font-mono text-[10px] bg-slate-100 px-1 rounded">ldap_sync</code> feature to provision users from LDAP or Active Directory.
      </p>
    </div>
  );
}

function StatusPill({ status }: { status: string | null | undefined }) {
  if (!status) return null;
  const ok = status === "ok";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
        ok ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
      }`}
    >
      {ok ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
      {status}
    </span>
  );
}

export function LdapSettingsTab() {
  const { data: license } = useLicense();
  const { data } = useLdapConfig();
  const { mutate: save, isPending } = useSaveLdapConfig();
  const { mutate: test, isPending: testing } = useTestLdapConnection();
  const { mutate: syncNow, isPending: syncing } = useSyncLdapNow();
  const cfg = data?.config;

  if (!hasLicenseFeature(license, "ldap_sync")) return <LockedState />;

  function submit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    let roleMapping: Record<string, string> = {};
    try {
      roleMapping = JSON.parse(String(form.get("role_mapping") || "{}"));
    } catch {
      roleMapping = {};
    }
    save({
      is_active: form.get("is_active") === "on",
      server_url: String(form.get("server_url") ?? ""),
      bind_dn: String(form.get("bind_dn") ?? ""),
      bind_password: String(form.get("bind_password") ?? "") || null,
      user_search_base: String(form.get("user_search_base") ?? ""),
      user_search_filter: String(form.get("user_search_filter") ?? "(objectClass=person)"),
      email_attr: String(form.get("email_attr") ?? "mail"),
      name_attr: String(form.get("name_attr") ?? "cn"),
      group_attr: String(form.get("group_attr") ?? "") || null,
      default_role: String(form.get("default_role") ?? "viewer"),
      role_mapping: roleMapping,
      sync_schedule_cron: String(form.get("sync_schedule_cron") ?? "0 */6 * * *"),
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            LDAP / Active Directory
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Provision users and map directory groups to Entivia roles.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 cursor-pointer">
          <input
            name="is_active"
            type="checkbox"
            defaultChecked={cfg?.is_active ?? false}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
          />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-slate-800">Enable scheduled sync</span>
            <span className="block text-xs text-slate-500 mt-0.5">
              When enabled, Entivia will sync users from your directory on the cron schedule below.
            </span>
          </span>
        </label>
      </section>

      <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Connection</p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelCls}>Server URL</label>
            <input
              name="server_url"
              className={inputCls}
              placeholder="ldaps://ad.example.com"
              defaultValue={cfg?.server_url ?? ""}
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelCls}>Bind DN</label>
            <input
              name="bind_dn"
              className={inputCls}
              placeholder="CN=pulse,OU=Service Accounts,DC=example,DC=com"
              defaultValue={cfg?.bind_dn ?? ""}
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelCls}>Bind password</label>
            <input
              name="bind_password"
              type="password"
              className={inputCls}
              placeholder={cfg?.bind_password_set ? "•••••• (already set)" : "Enter bind password"}
              autoComplete="new-password"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">User search</p>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelCls}>Search base</label>
            <input
              name="user_search_base"
              className={inputCls}
              placeholder="OU=Users,DC=example,DC=com"
              defaultValue={cfg?.user_search_base ?? ""}
              required
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelCls}>Search filter</label>
            <input
              name="user_search_filter"
              className={inputCls}
              defaultValue={cfg?.user_search_filter ?? "(objectClass=person)"}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Email attribute</label>
            <input name="email_attr" className={inputCls} defaultValue={cfg?.email_attr ?? "mail"} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Name attribute</label>
            <input name="name_attr" className={inputCls} defaultValue={cfg?.name_attr ?? "cn"} />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Group attribute</label>
            <input
              name="group_attr"
              className={inputCls}
              placeholder="memberOf"
              defaultValue={cfg?.group_attr ?? ""}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Default role</label>
            <select name="default_role" className={inputCls} defaultValue={cfg?.default_role ?? "viewer"}>
              <option value="viewer">Viewer</option>
              <option value="analyst">Analyst</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>
      </section>

      <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Role mapping</p>
        <p className="text-xs text-slate-500 -mt-2">
          Map directory groups (DN strings) to Entivia roles. Users not in any mapped group get the default role.
        </p>
        <textarea
          name="role_mapping"
          rows={5}
          className={`${inputCls} font-mono text-xs leading-relaxed`}
          defaultValue={JSON.stringify(cfg?.role_mapping ?? {}, null, 2)}
        />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelCls}>Sync schedule (cron)</label>
            <input
              name="sync_schedule_cron"
              className={inputCls}
              defaultValue={cfg?.sync_schedule_cron ?? "0 */6 * * *"}
            />
            <p className="text-[11px] text-slate-400">
              Defaults to every 6 hours. Uses standard 5-field cron syntax.
            </p>
          </div>
        </div>
      </section>

      {cfg?.last_sync_at && (
        <section className="flex flex-wrap items-center gap-3 py-4 sm:px-5 sm:py-4 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl sm:shadow-sm">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-700">Last sync</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {new Date(cfg.last_sync_at).toLocaleString()}
            </p>
          </div>
          <StatusPill status={cfg.last_sync_status} />
        </section>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end sm:border-t sm:border-slate-100 sm:pt-4">
        <button
          type="button"
          disabled={testing}
          onClick={() => test()}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-colors w-full sm:w-auto"
        >
          {testing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="text-slate-400" />}
          Test connection
        </button>
        <button
          type="button"
          disabled={syncing}
          onClick={() => syncNow()}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-colors w-full sm:w-auto"
        >
          {syncing ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} className="text-slate-400" />}
          Sync now
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm w-full sm:w-auto"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isPending ? "Saving…" : "Save LDAP"}
        </button>
      </div>
    </form>
  );
}
