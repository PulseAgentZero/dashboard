"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";
import { isMfaRequired } from "@/types/auth";

export function useAcceptInvite() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authApi.acceptInvite,
    onSuccess(data) {
      if (isMfaRequired(data)) {
        sessionStorage.setItem("mfa_token", data.mfa_token);
        sessionStorage.setItem("mfa_user_email", data.user.email);
        router.push("/auth/login/verify-2fa");
        return;
      }
      tokens.set(data.access_token, data.refresh_token);
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Welcome to Entivia!");
      postAuthRedirect(data.org, router, data.user);
    },
    onError(err) {
      if (err instanceof ApiError && err.code === "TWO_FACTOR_SETUP_REQUIRED") {
        const setupToken =
          typeof err.fields?.setup_token === "string"
            ? err.fields.setup_token
            : undefined;
        if (setupToken) {
          sessionStorage.setItem("setup_2fa_token", setupToken);
          router.push("/auth/setup-2fa");
        }
      }
    },
  });
}

export function handleAcceptInviteApiError(
  err: unknown,
  setError: (msg: string) => void,
): boolean {
  if (err instanceof ApiError) {
    if (err.code === "TWO_FACTOR_SETUP_REQUIRED") {
      const setupToken =
        typeof err.fields?.setup_token === "string"
          ? err.fields.setup_token
          : undefined;
      if (setupToken) {
        sessionStorage.setItem("setup_2fa_token", setupToken);
        window.location.href = "/auth/setup-2fa";
        return true;
      }
    }
    const msg = err.message ?? "";
    const isExists =
      err.status === 409 ||
      msg.toLowerCase().includes("already exists") ||
      msg.toLowerCase().includes("already registered") ||
      err.code === "ALREADY_IN_ORG" ||
      err.code === "USER_EXISTS";
    if (isExists) {
      setError("__exists__");
      return true;
    }
    setError(msg || "Something went wrong. Please try again.");
    return true;
  }
  setError("Something went wrong. Please try again.");
  return true;
}
