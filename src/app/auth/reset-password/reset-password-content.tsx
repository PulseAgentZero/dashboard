"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/auth-layout";
import PasswordField from "@/components/ui/password-field";
import { useResetPassword } from "@/hooks/auth/use-reset-password";

export default function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { mutate, isPending } = useResetPassword();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const data = new FormData(e.currentTarget);
    mutate({
      token,
      new_password: data.get("password") as string,
    });
  }

  if (!token) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="This password reset link is missing or expired"
      >
        <p className="text-[13px] text-slate-600">
          Request a new link from the forgot password page.
        </p>
        <Link
          href="/auth/forgot-password"
          className="mt-4 inline-block text-[13px] font-medium text-blue-600"
        >
          Request reset link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Enter a strong password for your account"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <PasswordField id="password" label="New password" required />
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-blue-600 py-3 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {isPending ? "Updating…" : "Update password"}
        </button>
      </form>
    </AuthLayout>
  );
}
