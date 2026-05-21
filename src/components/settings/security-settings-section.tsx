"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { securityApi } from "@/lib/api/security";
import { ApiError } from "@/lib/api/client";
import { tokens } from "@/lib/auth-tokens";
import { useAuth } from "@/providers/auth-provider";
import { useOrganization } from "@/hooks/org/use-organization";

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400 disabled:bg-slate-50 transition-all";

export function TwoFactorAccountSection() {
  const { user, refetch } = useAuth();
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [setupUri, setSetupUri] = useState<string | null>(null);

  const { mutate: setup, isPending: settingUp } = useMutation({
    mutationFn: () => authApi.setup2fa(),
    onSuccess: (data) => {
      setSetupUri(data.otpauth_uri);
      toast.success("Scan the URI in your authenticator app, then enter a code below");
    },
    onError: () => toast.error("Could not start 2FA setup"),
  });

  const { mutate: enable, isPending: enabling } = useMutation({
    mutationFn: () => authApi.enable2fa({ code }),
    onSuccess: (data) => {
      setRecoveryCodes(data.recovery_codes);
      setSetupUri(null);
      setCode("");
      void refetch();
      toast.success("Two-factor authentication enabled");
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Invalid code"),
  });

  const { mutate: disable, isPending: disabling } = useMutation({
    mutationFn: () => authApi.disable2fa({ code, password: password || undefined }),
    onSuccess: () => {
      setCode("");
      setPassword("");
      void refetch();
      toast.success("Two-factor authentication disabled");
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not disable 2FA"),
  });

  const enabled = user?.totp_enabled;

  return (
    <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
        <Shield size={14} className="text-slate-400" /> Two-factor authentication
      </p>
      {recoveryCodes ? (
        <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-semibold text-amber-900">Save these recovery codes</p>
          <ul className="font-mono text-xs text-amber-800 space-y-1">
            {recoveryCodes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ) : enabled ? (
        <div className="space-y-3.5">
          <p className="text-sm text-slate-600">2FA is enabled on your account.</p>
          <div className="space-y-3">
            <input
              className={inputCls}
              placeholder="Authenticator or recovery code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <input
              type="password"
              className={inputCls}
              placeholder="Password (if you use email sign-in)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={disabling || !code}
            onClick={() => disable()}
            className="w-full sm:w-auto rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50 transition-colors"
          >
            {disabling ? "Disabling…" : "Disable 2FA"}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          <p className="text-sm text-slate-600 leading-normal">
            Protect your account with an authenticator app (Google Authenticator, 1Password, etc.).
          </p>
          {setupUri && (
            <p className="break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-500">
              {setupUri}
            </p>
          )}
          {!setupUri ? (
            <button
              type="button"
              disabled={settingUp}
              onClick={() => setup()}
              className="w-full sm:w-auto rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {settingUp ? "Starting…" : "Set up 2FA"}
            </button>
          ) : (
            <div className="space-y-3.5">
              <input
                className={inputCls}
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                type="button"
                disabled={enabling || code.length < 6}
                onClick={() => enable()}
                className="w-full sm:w-auto rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {enabling ? "Enabling…" : "Confirm and enable"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function DeleteAccountSection() {
  const router = useRouter();
  const { user } = useAuth();
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [confirm, setConfirm] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      securityApi.deleteMyAccount({
        password: password || undefined,
        totp_code: totpCode || undefined,
      }),
    onSuccess: () => {
      tokens.clear();
      toast.success("Account deleted");
      router.replace("/auth/login");
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Could not delete account"),
  });

  if (user?.is_org_owner) return null;

  return (
    <section className="space-y-4 py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl">
  <div>
    <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Delete account</p>
    <p className="mt-0.5 text-xs text-slate-500 leading-normal">
      Permanently delete your account and remove your personal data. This cannot be undone. Type DELETE to confirm.
    </p>
  </div>

  <div className="space-y-3">
    <input
      className={inputCls}
      placeholder="Type DELETE"
      value={confirm}
      onChange={(e) => setConfirm(e.target.value)}
    />
    <input
      type="password"
      className={inputCls}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    {user?.totp_enabled && (
      <input
        className={inputCls}
        placeholder="2FA code"
        value={totpCode}
        onChange={(e) => setTotpCode(e.target.value)}
      />
    )}
    <button
      type="button"
      disabled={isPending || confirm !== "DELETE"}
      onClick={() => mutate()}
      className="w-full sm:w-auto rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
    >
      {isPending ? "Deleting…" : "Delete account"}
    </button>
  </div>
</section>
  );
}

export function OrgSecuritySection() {
  const { user } = useAuth();
  const { data: org, refetch } = useOrganization();
  const qc = useQueryClient();
  const canManage = user?.is_org_owner || user?.role === "admin";

  const { mutate, isPending } = useMutation({
    mutationFn: (require_2fa: boolean) => securityApi.patchOrgSecurity(require_2fa),
    onSuccess: () => {
      void refetch();
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Security settings updated");
    },
    onError: () => toast.error("Failed to update security settings"),
  });

  if (!canManage) return null;

  return (
    <div className="py-4 sm:p-5 sm:bg-white sm:border sm:border-slate-200 sm:rounded-xl">
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 focus:ring-offset-0 transition-colors"
          checked={Boolean(org?.require_2fa)}
          disabled={isPending}
          onChange={(e) => mutate(e.target.checked)}
        />
        <span className="min-w-0 flex-1">
          <span className="text-sm font-semibold text-slate-800 block">
            Require two-factor authentication
          </span>
          <span className="mt-1 block text-xs text-slate-500 leading-normal">
            All members must set up an authenticator app before they can sign in.
          </span>
        </span>
      </label>
      {isPending && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <Loader2 size={14} className="animate-spin text-orange-500" />
          <span>Updating settings...</span>
        </div>
      )}
    </div>
  );
}

export function DeleteOrgSection() {
  const router = useRouter();
  const { data: org } = useOrganization();
  const [step, setStep] = useState<"idle" | "code">("idle");
  const [code, setCode] = useState("");

  const { mutate: requestCode, isPending: requesting } = useMutation({
    mutationFn: () => securityApi.requestOrgDeleteCode(),
    onSuccess: () => {
      setStep("code");
      toast.success("Confirmation code sent to your email");
    },
    onError: () => toast.error("Could not send confirmation code"),
  });

  const { mutate: confirm, isPending: confirming } = useMutation({
    mutationFn: () => securityApi.confirmOrgDelete(code),
    onSuccess: () => {
      tokens.clear();
      toast.success("Organization deleted");
      router.replace("/auth/login");
    },
    onError: (err) =>
      toast.error(err instanceof ApiError ? err.message : "Invalid code"),
  });

  if (!org?.is_org_owner) return null;

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
      <p className="text-sm font-semibold text-rose-950">Delete organization</p>
      <p className="mt-0.5 text-xs text-rose-800 leading-normal">
        Permanently deletes {org.name} and deactivates all members. This cannot be undone.
      </p>
      {step === "idle" ? (
        <button
          type="button"
          disabled={requesting}
          onClick={() => requestCode()}
          className="w-full sm:w-auto mt-4 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-50 transition-colors"
        >
          {requesting ? "Sending code…" : "Email me a confirmation code"}
        </button>
      ) : (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            className={`${inputCls} sm:max-w-[160px]`}
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            disabled={confirming || code.length < 6}
            onClick={() => confirm()}
            className="w-full sm:w-auto rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {confirming ? "Deleting…" : "Confirm delete"}
          </button>
        </div>
      )}
    </div>
  );
}