"use client";

import { Mails } from "lucide-react";
import { Google } from "../../../../public/icon/google";
import Image from "next/image";
import Link from "next/link";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import { BladeFan } from "../../../../public/icon/bladeFan";
import { useLogin } from "@/hooks/auth/use-login";
import { initiateGoogleSignIn } from "@/lib/api/auth";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    login({
      email: data.get("email") as string,
      password: data.get("password") as string,
    });
  }

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-black">
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
          alt="Pulse Intelligence Network"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/20 to-black/90 z-10" />
        <div
          className="absolute top-12 left-12 z-20 animate-spin"
          style={{ animationDuration: "60s" }}
        >
          <BladeFan color="white" size={64} />
        </div>
        <div className="absolute bottom-12 left-12 z-20">
          <h1 className="text-white text-4xl font-black italic tracking-tighter">PULSE</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em] mt-2">
            Intelligence Layer v1.0
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-slate-600">
              Please enter your pulse details to sign in.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField
                id="email"
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                icon={Mails}
                required
              />
              <PasswordField id="password" label="Password" required />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[13px] text-slate-700">
                  Remember me
                </label>
              </div>
              <div className="text-[13px]">
                <Link
                  href="/auth/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
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
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-slate-200 transition duration-150"
            >
              <Google />
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-600">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
