"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { recommendationsApi } from "@/lib/api/dashboard";

export function useActionRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      recommendationsApi.action(id, notes),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["recommendations"] });
      void qc.invalidateQueries({ queryKey: ["dashboard", "overview"] });
      toast.success("Recommendation marked as actioned");
    },
    onError: () => toast.error("Failed to action recommendation"),
  });
}

export function useDismissRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      recommendationsApi.dismiss(id, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["recommendations"] });
      void qc.invalidateQueries({ queryKey: ["dashboard", "overview"] });
      toast.success("Recommendation dismissed");
    },
    onError: () => toast.error("Failed to dismiss recommendation"),
  });
}
