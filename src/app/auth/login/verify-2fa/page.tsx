"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { clearBannerDismissFlags, tokens } from "@/lib/auth-tokens";
import { postAuthRedirect } from "@/lib/auth-redirect";

export default function Verify2faPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const mfaToken =
    typeof window !== "undefined"
      ? sessionStorage.getItem("mfa_token")
      : null;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      if (!mfaToken) throw new Error("Session expired");
      return authApi.verify2fa({ mfa_token: mfaToken, code });
    },
    onSuccess(data) {
      sessionStorage.removeItem("mfa_token");
      sessionStorage.removeItem("mfa_user_email");
      tokens.set(data.access_token, data.refresh_token);
      void qc.resetQueries({ queryKey: ["me"] });
      clearBannerDismissFlags();
      toast.success("Signed in");
      postAuthRedirect(data.org, router, data.user);
    },
    onError(err) {
      toast.error(
        err instanceof ApiError ? err.message : "Invalid code. Try again.",
      );
    },
  });

  if (!mfaToken) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <p className="text-sm text-slate-600">
          Session expired.{" "}
          <Link href="/auth/login" className="text-blue-600 underline">
            Sign in again
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-8">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Two-factor authentication</h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter the 6-digit code from your authenticator app, or a recovery code.
          </p>
        </div>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-center text-lg tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
          placeholder="000000"
          maxLength={32}
          autoComplete="one-time-code"
        />
        <button
          type="button"
          disabled={isPending || code.length < 6}
          onClick={() => mutate()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          Verify
        </button>
        <Link href="/auth/login" className="block text-center text-sm text-slate-500 hover:text-slate-700">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
