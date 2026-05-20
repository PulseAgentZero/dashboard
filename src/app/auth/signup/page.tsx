"use client";

import { useState } from "react";
import Link from "next/link";
import { Mails, PersonStanding, Building2 } from "lucide-react";
import { toast } from "sonner";
import { Google } from "../../../../public/icon/google";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { useSignup } from "@/hooks/auth/use-signup";
import { useAuthInstance } from "@/hooks/auth/use-auth-instance";
import { initiateGoogleSignIn } from "@/lib/api/auth";
import { isSelfHostedDeployment } from "@/lib/deployment";
import { signupSchema, useFormValidation } from "@/lib/validation";

export default function SignupPage() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { mutate: signup, isPending } = useSignup();
  const { fieldErrors, clearErrors, validate, handleApiError } = useFormValidation();
  const { data: instance, isLoading } = useAuthInstance();
  const registrationOpen = instance?.registration_open ?? true;

  function requireTermsAccepted(): boolean {
    if (termsAccepted) return true;
    toast.error("Please accept the Terms of Service and Privacy Policy to continue.");
    return false;
  }

  const closedMessage = isSelfHostedDeployment()
    ? "This Entivia instance is already set up. Sign in with your account or ask an admin for an invite."
    : "New organization registration is not available on this instance.";

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!requireTermsAccepted()) return;
    clearErrors();
    const raw = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
      string,
      string
    >;
    const payload = validate(signupSchema, {
      full_name: raw.name,
      email: raw.email,
      password: raw.password,
      org_name: raw.org_name,
    });
    if (!payload) return;
    signup(payload, { onError: handleApiError });
  }

  return (
    <AuthSplitLayout
      title="Create an account"
      subtitle="Get started with Entivia in minutes."
      footer={
        <p className="text-center text-[13px] text-slate-600">
          Already have an account?{" "}
          <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </a>
        </p>
      }
    >
      {isLoading ? <p className="text-[13px] text-slate-500">Loading…</p> : null}

      {registrationOpen && !isLoading ? (
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormField
              id="name"
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              icon={PersonStanding}
              required
              error={fieldErrors.full_name ?? fieldErrors.name}
            />
            <FormField
              id="org_name"
              label="Company Name"
              type="text"
              placeholder="Acme Inc."
              icon={Building2}
              required
              error={fieldErrors.org_name}
            />
            <FormField
              id="email"
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={Mails}
              required
              error={fieldErrors.email}
            />
            <PasswordField
              id="password"
              label="Password"
              required
              error={fieldErrors.password}
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="accept-terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="accept-terms" className="text-[13px] leading-snug text-slate-600">
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending || !termsAccepted}
            className="flex w-full justify-center rounded-xl border border-transparent bg-blue-600 px-4 py-3 text-[13px] font-semibold text-white shadow-sm transition duration-150 hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Creating account…" : "Create account"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[13px]">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!requireTermsAccepted()) return;
              initiateGoogleSignIn("signup");
            }}
            disabled={!termsAccepted}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] font-medium text-slate-700 transition duration-150 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Google />
            Sign up with Google
          </button>
        </form>
      ) : null}

      {!registrationOpen && !isLoading ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
          {closedMessage}
        </div>
      ) : null}
    </AuthSplitLayout>
  );
}
