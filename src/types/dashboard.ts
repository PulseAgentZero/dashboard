export type RiskDistribution = {
  High: number;
  Medium: number;
  Low: number;
  Healthy: number;
};

export type TopAtRiskEntity = {
  entity_id: string;
  entity_name: string | null;
  risk_score: number;
  risk_tier: string | null;
  segment: string | null;
};

export type LastPipelineRun = {
  id: string;
  status: string;
  completed_at: string | null;
  entities_scored: number | null;
};

export type RiskTrendPoint = {
  date: string;
  avg_risk_score: number;
  count: number;
};

export type DashboardOverview = {
  total_entities: number;
  total_entities_change_pct: number | null;
  risk_distribution: RiskDistribution;
  risk_distribution_prev: RiskDistribution;
  high_risk_change_pct: number | null;
  top_at_risk: TopAtRiskEntity[];
  active_recommendations: number;
  critical_recommendations: number;
  last_pipeline_run: LastPipelineRun | null;
  risk_trend: RiskTrendPoint[];
};

export type Recommendation = {
  id: string;
  entity_id: string;
  entity_label: string | null;
  type: string | null;
  title: string | null;
  urgency: string | null;
  confidence_score: number | null;
  reasoning: string | null;
  suggested_action: string | null;
  expected_impact: string | null;
  status: string;
  expires_at: string | null;
  actioned_by: string | null;
  actioned_at: string | null;
  created_at: string;
};

export type RecommendationsResponse = {
  recommendations: Recommendation[];
  total: number;
  page: number;
  limit: number;
};

export type EntityListItem = {
  entity_id: string;
  entity_name: string | null;
  segment: string | null;
  risk_score: number;
  risk_tier: string | null;
  risk_narrative: string | null;
  open_recommendations: number;
  created_at: string;
};

export type EntitiesResponse = {
  entities: EntityListItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type Connection = {
  id: string;
  name: string | null;
  db_type: string;
  host: string | null;
  database_name: string | null;
  status: string;
  last_tested_at: string | null;
  created_at: string;
};
