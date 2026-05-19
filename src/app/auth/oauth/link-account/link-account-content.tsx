"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/auth-layout";
import PasswordField from "@/components/ui/password-field";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { postAuthRedirect } from "@/lib/auth-redirect";
import { tokens } from "@/lib/auth-tokens";
import { linkGoogleAccountSchema, useFormValidation } from "@/lib/validation";
import { shouldDeferMutationToast } from "@/lib/validation/parse";

export default function LinkAccountContent() {
  const params = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();
  const linkToken = params.get("link_token");
  const email = params.get("email") ?? "your account";

  const { fieldErrors, clearErrors, validateFormData, handleApiError } =
    useFormValidation();

  const linkMutation = useMutation({
    mutationFn: (password: string) => {
      if (!linkToken) throw new Error("Missing link token");
      return authApi.confirmGoogleLink({
        link_token: linkToken,
        password: password || undefined,
      });
    },
    onSuccess: async (data) => {
      tokens.set(data.access_token, data.refresh_token);
      await qc.invalidateQueries({ queryKey: ["me"] });
      toast.success("Google account linked successfully.");
      postAuthRedirect(data.org, router, data.user);
    },
    onError: (err) => {
      if (shouldDeferMutationToast(err)) return;
      const message =
        err instanceof ApiError ? err.message : "Could not link your Google account.";
      toast.error(message);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (linkToken) {
        await authApi.cancelGoogleLink(linkToken);
      }
    },
    onSettled: () => {
      router.replace("/auth/login?oauth_link_cancelled=1");
    },
  });

  if (!linkToken) {
    return (
      <AuthLayout
        title="Link unavailable"
        subtitle="This link request is invalid or has expired."
      >
        <Link
          href="/auth/login"
          className="text-[13px] font-medium text-blue-600 hover:text-blue-500"
        >
          Back to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Link Google account"
      subtitle={`An account already exists for ${email} with email and password. Link Google to sign in with either method.`}
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          clearErrors();
          const data = validateFormData(
            linkGoogleAccountSchema,
            new FormData(e.currentTarget),
          );
          if (!data) return;
          linkMutation.mutate(data.password, { onError: handleApiError });
        }}
      >
        <PasswordField
          id="password"
          label="Confirm your password"
          required
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={linkMutation.isPending}
          className="w-full flex justify-center py-3 px-4 rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60"
        >
          {linkMutation.isPending ? "Linking…" : "Link Google account"}
        </button>

        <button
          type="button"
          disabled={cancelMutation.isPending}
          onClick={() => cancelMutation.mutate()}
          className="w-full flex justify-center py-3 px-4 rounded-xl text-[13px] font-medium text-slate-700 border border-slate-200 hover:bg-slate-50"
        >
          Cancel
        </button>
      </form>

      <p className="text-center text-[13px] text-slate-600">
        <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
