"use client";

import { Mails, PersonStanding, Building2 } from "lucide-react";
import { Google } from "../../../../public/icon/google";
import Image from "next/image";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import { BladeFan } from "../../../../public/icon/bladeFan";
import { useSignup } from "@/hooks/auth/use-signup";

export default function SignupPage() {
  const { mutate: signup, isPending } = useSignup();

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    signup({
      full_name: data.get("name") as string,
      email: data.get("email") as string,
      password: data.get("password") as string,
      org_name: data.get("org_name") as string,
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
            <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
            <p className="mt-2 text-slate-600">Get started with Pulse in minutes.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FormField
                id="name"
                label="Full Name"
                type="text"
                placeholder="Jane Doe"
                icon={PersonStanding}
                required
              />
              <FormField
                id="org_name"
                label="Company Name"
                type="text"
                placeholder="Acme Inc."
                icon={Building2}
                required
              />
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Creating account…" : "Create account"}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 hover:bg-slate-50 transition duration-150"
            >
              <Google />
              Sign up with Google
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-600">
            Already have an account?{" "}
            <a href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
