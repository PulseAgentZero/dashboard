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
      qc.setQueryData(["me"], data);
      toast.success("Account created! Welcome to Pulse.");
      router.push("/onboarding");
    },
    onError(err) {
      const message =
        err instanceof ApiError ? err.message : "Something went wrong";
      toast.error(message);
    },
  });
}
