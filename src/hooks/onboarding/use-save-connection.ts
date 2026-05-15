"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { onboardingApi } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";

export function useSaveConnection() {
  return useMutation({
    mutationFn: onboardingApi.saveConnection,
    onError(err) {
      toast.error(err instanceof ApiError ? err.message : "Connection failed");
    },
  });
}
