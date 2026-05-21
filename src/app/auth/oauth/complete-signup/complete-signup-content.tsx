"use client";

import Link from "next/link";
import { Building2, PersonStanding } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/auth-layout";
import FormField from "@/components/ui/form-field";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";
import { completeGoogleSignupSchema, useFormValidation } from "@/lib/validation";
import { shouldDeferMutationToast } from "@/lib/validation/parse";

export default function CompleteSignupContent() {
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const pendingToken = params.get("pending_token");

  const { fieldErrors, clearErrors, validate, handleApiError } = useFormValidation();

  const signupMutation = useMutation({
    mutationFn: (body: { org_name: string; full_name: string }) => {
      if (!pendingToken) throw new Error("Missing signup token");
      return authApi.completeGoogleSignup({
        pending_token: pendingToken,
        org_name: body.org_name,
        full_name: body.full_name,
      });
    },
    onSuccess: async (data) => {
      tokens.set(data.access_token, data.refresh_token);
      await qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Welcome to Entivia!");
      postAuthRedirect(data.org, router, data.user);
    },
    onError: (err) => {
      if (shouldDeferMutationToast(err)) return;
      const message =
        err instanceof ApiError ? err.message : "Could not finish sign up.";
      toast.error(message);
    },
  });

  if (!pendingToken) {
    return (
      <AuthLayout
        title="Sign up unavailable"
        subtitle="Your Google sign-up session is invalid or has expired."
      >
        <Link
          href="/auth/signup"
          className="text-[13px] font-medium text-blue-600 hover:text-blue-500"
        >
          Start again
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Finish setting up"
      subtitle="Your Google account is connected. Tell us your company name to create your workspace."
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          clearErrors();
          const raw = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
            string,
            string
          >;
          const payload = validate(completeGoogleSignupSchema, {
            org_name: raw.org_name,
            full_name: raw.full_name || "",
          });
          if (!payload) return;
          signupMutation.mutate(
            { org_name: payload.org_name, full_name: payload.full_name ?? "" },
            { onError: handleApiError },
          );
        }}
      >
        <div className="space-y-4">
          <FormField
            id="org_name"
            label="Company name"
            type="text"
            placeholder="Acme Inc."
            icon={Building2}
            required
            error={fieldErrors.org_name}
          />
          <FormField
            id="full_name"
            label="Full name (optional)"
            type="text"
            placeholder="Jane Doe"
            icon={PersonStanding}
            error={fieldErrors.full_name}
          />
        </div>

        <button
          type="submit"
          disabled={signupMutation.isPending}
          className="w-full flex justify-center py-3 px-4 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {signupMutation.isPending ? "Creating workspace…" : "Create workspace"}
        </button>

        <p className="text-center text-[13px] text-slate-600">
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
