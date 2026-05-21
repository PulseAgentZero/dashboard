"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { shouldDeferMutationToast } from "@/lib/validation/parse";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";
import { isMfaRequired } from "@/types/auth";

export function useLogin() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess(data) {
      if (isMfaRequired(data)) {
        sessionStorage.setItem("mfa_token", data.mfa_token);
        sessionStorage.setItem("mfa_user_email", data.user.email);
        router.push("/auth/login/verify-2fa");
        return;
      }
      tokens.set(data.access_token, data.refresh_token);
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Welcome back!");
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
          return;
        }
      }
      if (shouldDeferMutationToast(err)) return;
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      toast.error(message);
    },
  });
}
