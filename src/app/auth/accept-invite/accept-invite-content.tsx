"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertTriangle, PersonStanding } from "lucide-react";
import { Google } from "../../../../public/icon/google";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { authApi, initiateGoogleSignIn } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useAuthInstance } from "@/hooks/auth/use-auth-instance";
import { acceptInviteSchema, useFormValidation } from "@/lib/validation";
import {
  handleAcceptInviteApiError,
  useAcceptInvite,
} from "@/hooks/auth/use-accept-invite";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  invite_email_mismatch: "Use the Google account for the email that received the invitation.",
  invite_invalid: "This invitation link is invalid or expired.",
  account_exists: "An account with this email already exists. Sign in instead.",
};

function InviteErrorPanel({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <AuthSplitLayout title={title} subtitle={message}>
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-white">
          <AlertTriangle size={22} className="text-rose-500" />
        </div>
        {action}
      </div>
    </AuthSplitLayout>
  );
}

export function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const oauthError = searchParams.get("oauth_error") ?? "";

  const [error, setError] = useState("");
  const { fieldErrors, clearErrors, validate, applyApiErrors } = useFormValidation();
  const { mutate: acceptInvite, isPending } = useAcceptInvite();
  const { data: instance } = useAuthInstance();
  const googleOAuthEnabled = instance?.google_oauth_enabled ?? false;
  const oauthErrorMessage = oauthError
    ? OAUTH_ERROR_MESSAGES[oauthError] ?? "Google sign-in failed. Please try again."
    : "";
  const displayError = error || oauthErrorMessage;

  const { data: preview, isLoading: previewLoading } = useQuery({
    queryKey: ["invite-preview", token],
    queryFn: () => authApi.invitePreview(token),
    enabled: Boolean(token),
    retry: false,
  });

  if (!token) {
    return (
      <InviteErrorPanel
        title="Invalid invite link"
        message="This invitation link is missing a token. Please use the link from your invitation email."
        action={
          <Link
            href="/auth/login"
            className="inline-block rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Back to login
          </Link>
        }
      />
    );
  }

  const subtitle = preview
    ? `You're joining ${preview.org_name} as ${preview.role}. Set up your account to get started.`
    : "Set up your account to join your team";

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    clearErrors();
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
      string,
      string
    >;
    const payload = validate(acceptInviteSchema, {
      full_name: raw.full_name,
      password: raw.password,
      confirm: raw.confirm,
    });
    if (!payload) return;

    acceptInvite(
      { token, full_name: payload.full_name, password: payload.password },
      {
        onError: (err) => {
          if (applyApiErrors(err)) {
            if (err instanceof ApiError) setError(err.message);
            return;
          }
          handleAcceptInviteApiError(err, setError);
        },
      },
    );
  }

  return (
    <AuthSplitLayout
      title="Accept your invitation"
      subtitle={subtitle}
      footer={
        <p className="text-center text-[13px] text-slate-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      }
    >
      {previewLoading ? (
        <p className="text-[13px] text-slate-500">Loading invitation…</p>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField
            id="full_name"
            name="full_name"
            label="Full name"
            type="text"
            placeholder="Your full name"
            icon={PersonStanding}
            required
            error={fieldErrors.full_name}
          />
          <PasswordField
            id="password"
            name="password"
            label="Password"
            placeholder="At least 8 characters"
            required
            error={fieldErrors.password}
          />
          <PasswordField
            id="confirm"
            name="confirm"
            label="Confirm password"
            placeholder="Repeat your password"
            required
            error={fieldErrors.confirm}
          />
        </div>

        {displayError === "__exists__" ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
            <p className="font-semibold text-amber-800">Account already exists</p>
            <p className="mt-0.5 text-amber-700">
              This email is already registered. Please{" "}
              <Link href="/auth/login" className="font-semibold underline">
                sign in
              </Link>
              .
            </p>
          </div>
        ) : displayError ? (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertTriangle size={15} className="shrink-0" />
            {displayError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? "Creating account…" : "Create account & join"}
        </button>
      </form>

      {googleOAuthEnabled ? (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => initiateGoogleSignIn("invite", { inviteToken: token })}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Google />
            Continue with Google
          </button>
        </>
      ) : null}
    </AuthSplitLayout>
  );
}
