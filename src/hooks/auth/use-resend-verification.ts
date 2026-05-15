"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function useResendVerification() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.resendVerification(),
    onSuccess(data) {
      toast.success(data.message);
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError(err) {
      toast.error(err instanceof ApiError ? err.message : "Could not resend email");
    },
  });
}
