import { api } from "./client";
import type {
  LoginRequest,
  MeResponse,
  SignupRequest,
  TokenResponse,
} from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AuthInstanceStatus {
  deployment_mode: string;
  registration_open: boolean;
  can_create_organization: boolean;
}

export function initiateGoogleSignIn(intent: "login" | "signup" = "login") {
  const callbackUrl = `${window.location.origin}/auth/oauth/callback`;
  const params = new URLSearchParams({
    redirect_uri: callbackUrl,
    intent,
  });
  window.location.href = `${BASE_URL}/api/v1/auth/oauth/google?${params.toString()}`;
}

export const authApi = {
  instance: () => api.get<AuthInstanceStatus>("/auth/instance"),

  login: (body: LoginRequest) =>
    api.post<TokenResponse>("/auth/login", body),

  signup: (body: SignupRequest) =>
    api.post<TokenResponse>("/auth/signup", body),

  me: () => api.get<MeResponse>("/auth/me"),

  refresh: (refresh_token: string) =>
    api.post<TokenResponse>("/auth/refresh", { refresh_token }),

  logout: (refresh_token: string) =>
    api.post<void>("/auth/logout", { refresh_token }),

  verifyEmail: (token: string) =>
    api.get<{ message: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`,
    ),

  resendVerification: () =>
    api.post<{ message: string }>("/auth/resend-verification", {}),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>("/auth/forgot-password", { email }),

  resetPassword: (token: string, new_password: string) =>
    api.post<{ message: string }>("/auth/reset-password", {
      token,
      new_password,
    }),

  acceptInvite: (body: { token: string; full_name: string; password: string }) =>
    api.post<TokenResponse>("/auth/accept-invite", body),

  confirmGoogleLink: (body: { link_token: string; password?: string }) =>
    api.post<TokenResponse>("/auth/oauth/google/link", body),

  cancelGoogleLink: (link_token: string) =>
    api.post<void>("/auth/oauth/google/link/cancel", { link_token }),

  completeGoogleSignup: (body: {
    pending_token: string;
    org_name: string;
    full_name?: string;
  }) => api.post<TokenResponse>("/auth/oauth/google/complete-signup", body),
};
