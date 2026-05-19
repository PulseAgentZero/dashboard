"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { shouldDeferMutationToast } from "@/lib/validation/parse";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";

export function useLogin() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess(data) {
      tokens.set(data.access_token, data.refresh_token);
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Welcome back!");
      postAuthRedirect(data.org, router, data.user);
    },
    onError(err) {
      if (shouldDeferMutationToast(err)) return;
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      toast.error(message);
    },
  });
}
