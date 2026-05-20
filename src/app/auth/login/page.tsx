"use client";

import { Mails } from "lucide-react";
import { Google } from "../../../../public/icon/google";
import Link from "next/link";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import AuthLayout from "@/components/auth/auth-layout";
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
    <AuthLayout
      title="Welcome Back"
      subtitle="Please enter your Entivia account details to sign in."
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-[13px] text-slate-700">
              Remember me
            </label>
          </div>
          <Link
            href="/auth/forgot-password"
            className="text-[13px] font-medium text-orange-600 hover:text-orange-500"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-[13px] font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-orange-500 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>

        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="px-2 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => initiateGoogleSignIn("login")}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition duration-150"
        >
          <Google />
          Sign in with Google
        </button>
      </form>

      <p className="text-center text-[13px] text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-orange-600 hover:text-orange-500">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
