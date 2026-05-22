"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";

const SSO_ERROR_MESSAGES: Record<string, string> = {
  sso_unavailable: "SSO is temporarily unavailable. Try again in a moment.",
  invalid_state: "Your sign-in session expired. Please try again.",
  sso_misconfigured: "SSO is not configured correctly. Contact your administrator.",
  sso_exchange_failed: "We could not exchange the SSO token. Please try again.",
  sso_user_resolution_failed: "We could not resolve your SSO account. Contact your administrator.",
  saml_failed: "SAML sign-in failed. Please try again.",
  email_missing: "Your identity provider did not return an email address.",
  EMAIL_NOT_ALLOWED: "Your email domain is not allowed for this organization.",
  USER_NOT_PROVISIONED: "No Pulse account exists for this email. Ask your admin to invite you.",
  EMAIL_TAKEN: "This email is already used in another organization.",
  sso_failed: "SSO sign-in failed. Please try again.",
};

export default function SsoCallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const error = params.get("error");
    if (error) {
      const message = SSO_ERROR_MESSAGES[error] ?? "SSO sign-in failed. Please try again.";
      toast.error(message);
      router.replace("/auth/login");
      return;
    }

    const access = params.get("access_token");
    const refresh = params.get("refresh_token");
    if (!access || !refresh) {
      toast.error("SSO sign-in failed. Please try again.");
      router.replace("/auth/login");
      return;
    }

    tokens.set(access, refresh);

    if (typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", window.location.pathname);
      } catch {
        /* ignore */
      }
    }

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center space-y-3">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-600" />
        <p className="text-[13px] text-slate-600">Completing SSO sign-in…</p>
      </div>
    </div>
  );
}
