"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { tokens } from "@/lib/auth-tokens";
import { postAuthRedirect } from "@/lib/auth-redirect";

export default function Setup2faPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const setupToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("setup_2fa_token")
      : null;
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const { data: setup, isLoading } = useQuery({
    queryKey: ["2fa-setup", setupToken],
    queryFn: () => authApi.setup2fa(setupToken ?? undefined),
    enabled: !!setupToken && !recoveryCodes,
  });

  const { mutate: enable, isPending } = useMutation({
    mutationFn: () =>
      authApi.enable2fa({ code }, setupToken ?? undefined),
    onSuccess(data) {
      setRecoveryCodes(data.recovery_codes);
      if (data.access_token && data.refresh_token) {
        sessionStorage.removeItem("setup_2fa_token");
        tokens.set(data.access_token, data.refresh_token);
        void qc.invalidateQueries({ queryKey: ["me"] });
      }
      toast.success("Two-factor authentication enabled");
    },
    onError(err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not enable 2FA",
      );
    },
  });

  useEffect(() => {
    if (!setupToken && !tokens.getAccess()) {
      router.replace("/auth/login");
    }
  }, [setupToken, router]);

  if (!setupToken && !tokens.getAccess()) {
    return null;
  }

  if (recoveryCodes) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-4">
          <h1 className="text-xl font-bold text-slate-900">Save your recovery codes</h1>
          <p className="text-sm text-slate-600">
            Store these codes somewhere safe. Each can be used once if you lose your authenticator.
          </p>
          <ul className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm">
            {recoveryCodes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(recoveryCodes.join("\n"));
              toast.success("Copied");
            }}
            className="flex items-center gap-2 text-sm text-blue-600"
          >
            <Copy size={14} /> Copy all
          </button>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("setup_2fa_token");
              router.push("/dashboard");
            }}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white"
          >
            Continue to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Set up two-factor authentication</h1>
          <p className="mt-2 text-sm text-slate-600">
            Your organization requires 2FA. Add this account to your authenticator app, then enter a code to confirm.
          </p>
        </div>
        {isLoading ? (
          <Loader2 className="mx-auto animate-spin text-blue-600" />
        ) : setup ? (
          <>
            <p className="text-xs text-slate-500 break-all">{setup.otpauth_uri}</p>
            <p className="text-xs font-mono text-slate-700">Secret: {setup.secret}</p>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center tracking-widest"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
              placeholder="6-digit code"
              maxLength={8}
            />
            <button
              type="button"
              disabled={isPending || code.length < 6}
              onClick={() => enable()}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {isPending ? "Enabling…" : "Enable 2FA"}
            </button>
          </>
        ) : null}
        <Link href="/auth/login" className="block text-center text-sm text-slate-500">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
