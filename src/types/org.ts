export type TourGuideState = {
  setup_shown?: boolean;
  completed?: boolean;
  version?: number;
  completed_at?: string | null;
};

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
  tour_guide: TourGuideState;
  onboarding_done: boolean;
  require_2fa?: boolean;
  is_org_owner?: boolean;
  created_at: string;
  updated_at: string;
};

export type MemberSettingsRequest = {
  industry?: string | null;
  business_context?: string | null;
  entity_label?: string | null;
  goal_label?: string | null;
  tour_guide?: TourGuideState | null;
};

export type CompleteSetupResponse = {
  message: string;
  onboarding_done: boolean;
  generated_recommendations: number;
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
