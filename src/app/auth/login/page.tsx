"use client";

import { Mails } from "lucide-react";
import { Google } from "../../../../public/icon/google";
import Link from "next/link";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { useLogin } from "@/hooks/auth/use-login";
import { initiateGoogleSignIn } from "@/lib/api/auth";
import { loginSchema, useFormValidation } from "@/lib/validation";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const { fieldErrors, clearErrors, validateFormData, handleApiError } =
    useFormValidation();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    clearErrors();
    const data = validateFormData(loginSchema, new FormData(e.currentTarget));
    if (!data) return;
    login(data, { onError: handleApiError });
  }

  return (
    <AuthSplitLayout
      title="Welcome Back"
      subtitle="Please enter your Entivia account details to sign in."
      footer={
        <p className="text-center text-[13px] text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Create an account
          </Link>
        </p>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
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

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="remember-me" className="ml-2 block text-[13px] text-slate-700">
              Remember me
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-[13px] font-medium text-blue-600 hover:text-blue-500"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full justify-center rounded-xl border border-transparent bg-blue-600 px-4 py-3 text-[13px] font-semibold text-white transition duration-150 hover:bg-blue-700 focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Signing in…" : "Sign in"}
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
          onClick={() => initiateGoogleSignIn("login")}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] font-medium text-slate-700 transition duration-150 hover:bg-slate-50"
        >
          <Google />
          Sign in with Google
        </button>
      </form>
    </AuthSplitLayout>
  );
}
