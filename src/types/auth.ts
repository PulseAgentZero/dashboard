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
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  org: Org | null;
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
