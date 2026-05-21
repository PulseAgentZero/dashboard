export type OrgUser = {
  id: string;
  org_id: string;
  email: string;
  full_name: string;
  profile_image_url: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at: string | null;
  created_at: string;
};

export type Invitation = {
  invitation_id: string;
  email: string;
  role: string;
  expires_at: string;
};

export type InvitationsResponse = {
  invitations: Invitation[];
  total?: number;
};
