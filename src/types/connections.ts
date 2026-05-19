export type ConnectionResponse = {
  id: string;
  org_id: string;
  name: string;
  connector_type: string;
  db_type: string | null;
  host: string | null;
  port: number | null;
  database_name: string | null;
  username: string | null;
  sslmode: string | null;
  status: string;
  last_tested_at: string | null;
  last_test_error: string | null;
  config: Record<string, unknown>;
  connection_meta: Record<string, unknown>;
  created_at: string;
};

export type TestConnectionResponse = {
  success: boolean;
  message: string;
  db_version: string | null;
};

export type CatalogField = {
  key: string;
  label: string;
  type: "string" | "integer" | "password" | "select" | "textarea" | "file";
  required: boolean;
  placeholder?: string;
  default?: string | number;
  options?: string[];
  /** Show this field only when form values match (e.g. auth method). */
  when?: Record<string, string>;
  help?: string;
};

export type ConnectorCatalogItem = {
  connector_type: string;
  display_name: string;
  category: string;
  description: string;
  fields: CatalogField[];
  upload_endpoint?: string;
  notes?: string;
};

export type EntityDetail = {
  entity_id: string;
  entity_name: string | null;
  segment: string | null;
  risk_score: number;
  risk_tier: string | null;
  risk_narrative: string | null;
  profile_data: Record<string, unknown>;
  recommendations: Array<{
    id: string;
    title: string | null;
    urgency: string | null;
    status: string | null;
    created_at: string;
  }>;
  last_pipeline_run_at: string;
};

export type RiskHistoryPoint = {
  risk_score: number;
  risk_tier: string | null;
  recorded_at: string;
};

export type EntityRiskHistory = {
  entity_id: string;
  period: string;
  points: RiskHistoryPoint[];
};
