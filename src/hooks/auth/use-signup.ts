"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { tokens } from "@/lib/auth-tokens";

export function useSignup() {
  const router = useRouter();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess(data) {
      tokens.set(data.access_token, data.refresh_token);
      void qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Account created! Check your email to verify.");
      router.push("/auth/verify-email?notice=1");
    },
    onError(err) {
      if (err instanceof ApiError && err.code === "INSTANCE_ORG_EXISTS") {
        toast.error(err.message);
        return;
      }
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      toast.error(message);
    },
  });
}
