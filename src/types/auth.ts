export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_verified: boolean;
  org_id: string;
}

export interface Org {
  id: string;
  name: string;
  slug: string;
  onboarding_done: boolean;
}

export interface UserOut {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  profile_image_url?: string | null;
  totp_enabled?: boolean;
  is_org_owner?: boolean;
}

export interface OrgOut {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  plan: string;
  onboarding_done: boolean;
  created_at: string;
  logo_url?: string | null;
  tour_guide?: { completed?: boolean; version?: number; completed_at?: string | null };
  require_2fa?: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  org: Org | null;
}

export interface MfaRequiredResponse {
  status: "mfa_required";
  mfa_token: string;
  user: UserOut;
}

export type LoginResult = TokenResponse | MfaRequiredResponse;

export function isMfaRequired(
  data: LoginResult,
): data is MfaRequiredResponse {
  return "status" in data && data.status === "mfa_required";
}

export interface TotpSetupResponse {
  secret: string;
  otpauth_uri: string;
}

export interface MfaVerifyRequest {
  mfa_token: string;
  code: string;
}

export interface TotpEnableRequest {
  code: string;
}

export interface TotpDisableRequest {
  code: string;
  password?: string;
}

export interface TotpEnableResponse {
  message: string;
  recovery_codes: string[];
  totp_enabled: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: UserOut;
  org?: OrgOut | null;
}

export interface MeResponse {
  user: UserOut;
  org: OrgOut;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  org_name: string;
}
