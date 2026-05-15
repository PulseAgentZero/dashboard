"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, new_password }: { token: string; new_password: string }) =>
      authApi.resetPassword(token, new_password),
    onSuccess() {
      toast.success("Password updated. You can sign in now.");
      router.push("/auth/login");
    },
    onError(err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong");
    },
  });
}
