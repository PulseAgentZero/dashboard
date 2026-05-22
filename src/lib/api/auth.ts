import { api } from "./client";
import type {
  LoginRequest,
  LoginResult,
  MeResponse,
  MfaVerifyRequest,
  SignupRequest,
  TokenResponse,
  TotpDisableRequest,
  TotpEnableRequest,
  TotpEnableResponse,
  TotpSetupResponse,
} from "@/types/auth";

export interface InvitePreview {
  email: string;
  org_name: string;
  role: string;
  expires_at: string;
}

const _apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = _apiUrl !== undefined ? _apiUrl : "http://localhost:8000";

export interface AuthInstanceStatus {
  deployment_mode: string;
  registration_open: boolean;
  can_create_organization: boolean;
  google_oauth_enabled: boolean;
}

export function initiateGoogleSignIn(
  intent: "login" | "signup" | "invite" = "login",
  options?: { inviteToken?: string },
) {
  const callbackUrl = `${window.location.origin}/auth/oauth/callback`;
  const params = new URLSearchParams({
    redirect_uri: callbackUrl,
    intent,
  });
  if (intent === "invite" && options?.inviteToken) {
    params.set("invite_token", options.inviteToken);
  }
  window.location.href = `${BASE_URL}/api/v1/auth/oauth/google?${params.toString()}`;
}

export function initiateSsoSignIn(orgSlug: string) {
  window.location.href = `${BASE_URL}/api/v1/auth/sso/${encodeURIComponent(orgSlug)}/login`;
}

export const authApi = {
  instance: () => api.get<AuthInstanceStatus>("/auth/instance"),

  login: (body: LoginRequest) =>
    api.post<LoginResult>("/auth/login", body),

  verify2fa: (body: MfaVerifyRequest) =>
    api.post<TokenResponse>("/auth/2fa/verify", body),

  setup2fa: (setupToken?: string) =>
    api.post<TotpSetupResponse>(
      "/auth/2fa/setup",
      {},
      setupToken ? { headers: { "X-Setup-Token": setupToken } } : undefined,
    ),

  enable2fa: (body: TotpEnableRequest, setupToken?: string) =>
    api.post<TotpEnableResponse>(
      "/auth/2fa/enable",
      body,
      setupToken ? { headers: { "X-Setup-Token": setupToken } } : undefined,
    ),

  disable2fa: (body: TotpDisableRequest) =>
    api.post<{ message: string }>("/auth/2fa/disable", body),

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

  invitePreview: (token: string) =>
    api.get<InvitePreview>(
      `/auth/invite/preview?token=${encodeURIComponent(token)}`,
    ),

  acceptInvite: (body: { token: string; full_name: string; password: string }) =>
    api.post<LoginResult>("/auth/accept-invite", body),

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
