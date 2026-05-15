"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { onboardingApi } from "@/lib/api/onboarding";
import { ApiError } from "@/lib/api/client";

export function useCompleteOnboarding() {
  const router = useRouter();

  return useMutation({
    mutationFn: onboardingApi.complete,
    onSuccess() {
      toast.success("Onboarding complete! Welcome to Pulse.");
      router.push("/dashboard");
    },
    onError(err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to complete onboarding");
    },
  });
}
