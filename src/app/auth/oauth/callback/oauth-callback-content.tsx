"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  account_deactivated: "This account has been deactivated.",
  oauth_account_conflict:
    "This email is linked to a different Google account. Sign in with the original Google account or use email and password.",
  oauth_failed: "Google sign-in failed. Please try again.",
  NOT_CONFIGURED: "Google sign-in is not configured.",
  REDIS_REQUIRED: "Google sign-in is temporarily unavailable.",
  INVALID_STATE: "Your sign-in session expired. Please try again.",
  instance_org_exists:
    "This Entivia instance already has an organization. Sign in or ask your admin for an invite.",
};

export default function OAuthCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const error = params.get("error");
    if (error) {
      const code = params.get("code");
      const message =
        OAUTH_ERROR_MESSAGES[error] ??
        (code ? OAUTH_ERROR_MESSAGES[code] : undefined) ??
        "Google sign-in failed. Please try again.";
      toast.error(message);
      router.replace("/auth/login");
      return;
    }

    const oauthAction = params.get("oauth_action");
    const linkToken = params.get("link_token");
    const pendingToken = params.get("pending_token");
    const email = params.get("email");

    if (oauthAction === "link_account" && linkToken) {
      const qs = new URLSearchParams({ link_token: linkToken });
      if (email) qs.set("email", email);
      router.replace(`/auth/oauth/link-account?${qs.toString()}`);
      return;
    }

    if (oauthAction === "complete_signup" && pendingToken) {
      router.replace(
        `/auth/oauth/complete-signup?pending_token=${encodeURIComponent(pendingToken)}`,
      );
      return;
    }

    const access = params.get("access_token");
    const refresh = params.get("refresh_token");

    if (!access || !refresh) {
      toast.error("Google sign-in failed. Please try again.");
      router.replace("/auth/login");
      return;
    }

    tokens.set(access, refresh);

    authApi
      .me()
      .then((me) => {
        qc.setQueryData(["me"], me);
        postAuthRedirect(me.org, router, me.user);
      })
      .catch(() => {
        tokens.clear();
        toast.error("Sign-in failed. Please try again.");
        router.replace("/auth/login");
      });
  }, [params, router, qc]);

  return <OAuthLoadingScreen />;
}

function OAuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center space-y-3">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />
        <p className="text-[13px] text-slate-600">Signing you in…</p>
      </div>
    </div>
  );
}
