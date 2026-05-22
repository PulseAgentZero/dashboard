"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  billingApi,
  licensePortalApi,
  type CloudPlanTier,
} from "@/lib/api/billing-api";
import { useAuthEnabled } from "@/hooks/use-auth-enabled";
import { isCloudDeployment } from "@/lib/deployment";
import { planDisplayName } from "@/lib/plan-utils";
import { ApiError } from "@/lib/api/client";

export const PORTAL_TOKEN_STORAGE_KEY = "pulse_license_portal_token";
export const PORTAL_EMAIL_STORAGE_KEY = "pulse_license_portal_email";

export function useSubscription() {
  const enabled = useAuthEnabled() && isCloudDeployment();

  return useQuery({
    queryKey: ["billing", "subscription"],
    queryFn: billingApi.getSubscription,
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function useOpenManagePaymentLink() {
  return useMutation({
    mutationFn: () => billingApi.getManageLink(),
    onSuccess: (data) => {
      if (data.link) window.open(data.link, "_blank", "noopener,noreferrer");
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not open payment update page";
      toast.error(msg);
    },
  });
}

export function useInitializeCloudCheckout() {
  return useMutation({
    mutationFn: (args: { callbackUrl: string; plan?: CloudPlanTier }) =>
      billingApi.initializeCloud({
        callback_url: args.callbackUrl,
        plan: args.plan ?? "pro",
      }),
    onSuccess: (data) => {
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not start checkout";
      toast.error(msg);
    },
  });
}

export function useVerifyCloudPayment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reference: string) => billingApi.verifyCloud(reference),
    onSuccess: (data) => {
      qc.setQueryData(["billing", "subscription"], data);
      void qc.invalidateQueries({ queryKey: ["me"] });
      void qc.invalidateQueries({ queryKey: ["usage"] });
      void qc.invalidateQueries({ queryKey: ["billing", "subscription"] });
      void qc.invalidateQueries({ queryKey: ["organization"] });
      const tier = data.effective_plan ?? data.plan;
      toast.success(
        tier && tier !== "free"
          ? `${planDisplayName(tier)} plan activated. Thank you!`
          : "Payment verified.",
      );
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Payment verification failed";
      toast.error(msg);
    },
  });
}

export function useInitializeSelfHostedCheckout() {
  return useMutation({
    mutationFn: (body: { email: string; callback_url: string }) =>
      billingApi.initializeSelfHosted(body),
    onSuccess: (data) => {
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not start license checkout";
      toast.error(msg);
    },
  });
}

export function useVerifySelfHostedPayment() {
  return useMutation({
    mutationFn: (reference: string) => billingApi.verifySelfHosted(reference),
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "License verification failed";
      toast.error(msg);
    },
  });
}

// ── License customer portal ─────────────────────────────────────────────────

export function useRequestPortalLink() {
  return useMutation({
    mutationFn: (body: { email: string; callback_url: string }) =>
      licensePortalApi.requestLink(body),
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not send sign-in link";
      toast.error(msg);
    },
  });
}

export function useExchangePortalToken() {
  return useMutation({
    mutationFn: (token: string) => licensePortalApi.exchange(token),
    onSuccess: (data) => {
      if (typeof window === "undefined") return;
      sessionStorage.setItem(PORTAL_TOKEN_STORAGE_KEY, data.portal_token);
      sessionStorage.setItem(PORTAL_EMAIL_STORAGE_KEY, data.email);
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not sign in to the portal";
      toast.error(msg);
    },
  });
}

export function usePortalLicenses(portalToken: string | null) {
  return useQuery({
    queryKey: ["license-portal", "licenses", portalToken],
    queryFn: () => {
      if (!portalToken) throw new Error("No portal session");
      return licensePortalApi.listLicenses(portalToken);
    },
    enabled: Boolean(portalToken),
    staleTime: 30_000,
    retry: false,
  });
}

export function useResendLicense(portalToken: string | null) {
  return useMutation({
    mutationFn: (jti: string) => {
      if (!portalToken) throw new Error("No portal session");
      return licensePortalApi.resend(portalToken, jti);
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (e: unknown) => {
      const msg =
        e instanceof ApiError ? e.message : "Could not resend license key";
      toast.error(msg);
    },
  });
}

export function clearPortalSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PORTAL_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(PORTAL_EMAIL_STORAGE_KEY);
}

export function useCancelSubscription() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => billingApi.cancelSubscription(),
    onSuccess: (data) => {
      qc.setQueryData(["billing", "subscription"], data);
      void qc.invalidateQueries({ queryKey: ["me"] });
      void qc.invalidateQueries({ queryKey: ["usage"] });
      void qc.invalidateQueries({ queryKey: ["billing", "subscription"] });
      void qc.invalidateQueries({ queryKey: ["organization"] });
      const planLabel = planDisplayName(data.effective_plan ?? data.plan);
      if (data.next_payment_date) {
        const end = new Date(data.next_payment_date).toLocaleDateString(undefined, {
          dateStyle: "medium",
        });
        toast.success(
          `Subscription cancelled. ${planLabel} access continues until ${end}.`,
        );
      } else {
        toast.success("Subscription cancelled.");
      }
    },
    onError: (e: unknown) => {
      if (e instanceof ApiError && e.code === "NO_ACTIVE_SUBSCRIPTION") {
        toast.error(
          "Subscription not linked to Paystack yet. Please wait a minute after payment and try again, or contact support.",
        );
        return;
      }
      const msg =
        e instanceof ApiError ? e.message : "Could not cancel subscription";
      toast.error(msg);
    },
  });
}
