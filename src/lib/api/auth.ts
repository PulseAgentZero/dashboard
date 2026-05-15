import { api } from "./client";
import type {
  LoginRequest,
  MeResponse,
  SignupRequest,
  TokenResponse,
} from "@/types/auth";

export const authApi = {
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
};
