"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { shouldDeferMutationToast } from "@/lib/validation/parse";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
    onError(err) {
      if (shouldDeferMutationToast(err)) return;
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    },
  });
}
