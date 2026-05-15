"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { onboardingApi } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";

export function useSaveContext() {
  return useMutation({
    mutationFn: onboardingApi.saveContext,
    onError(err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to save context");
    },
  });
}
