export type OrgProfile = {
  id: string;
  name: string;
  slug: string | null;
  industry: string | null;
  business_context: string | null;
  entity_label: string | null;
  goal_label: string | null;
  plan: string | null;
  timezone: string | null;
  logo_url: string | null;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
};

export type UpdateOrgRequest = {
  name?: string | null;
  industry?: string | null;
  business_context?: string | null;
  entity_label?: string | null;
  goal_label?: string | null;
  timezone?: string | null;
  logo_url?: string | null;
};

export type AssetUploadResponse = {
  url: string;
  category: string;
  object_key?: string | null;
};
