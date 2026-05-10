import { Mails } from "lucide-react";
import { Google } from "../../../../public/icon/google";
import Image from "next/image";
import FormField from "@/components/ui/form-field";
import PasswordField from "@/components/ui/password-field";
import PulseFanRotate from "@/components/auth/rotating-logo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side: Visual/Image Section */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1777223128400-d436f348b3ea?q=80&w=1036&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="mt-2 text-slate-600">
              Please enter your pulse details to sign in.
            </p>
          </div>

          <form className="mt-8 space-y-6">
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
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-[13px] text-slate-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-[13px]">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500 transition duration-150"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="px-2 bg-white text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl bg-white text-[12px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-slate-200 transition duration-150"
            >
              <Google />
              Sign in with Google
            </button>
          </form>

          <p className="text-center text-[13px] text-slate-600">
            Dont have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
