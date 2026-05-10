import { Mails, PersonStanding } from "lucide-react";
import { Google } from "../../../../public/icon/google";
import Image from "next/image";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import PulseFanRotate from "@/components/auth/rotating-logo";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side: Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1777223127802-f800a32cddc5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDI3fHx8ZW58MHx8fHx8"
          alt="Login Visual"
          fill
          priority
          className="object-cover"
        />
        <div
          className="absolute top-0 left-0 z-20 animate-spin"
          style={{ animationDuration: "20s" }}
        >
          <PulseFanRotate text="PULSE" radius={40} iconSize={60} />
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
            <p className="mt-2 text-slate-600">
              Get started with Pulse in minutes.
            </p>
          </div>

          <form className="space-y-6">
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition duration-150"
            >
              Create account
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
