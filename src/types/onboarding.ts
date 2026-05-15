export interface OnboardingContextRequest {
  industry?: string;
  business_context: string;
  entity_label: string;
  goal_label: string;
}

export interface OnboardingConnectionRequest {
  name?: string;
  db_type: "postgresql" | "mysql";
  host: string;
  port: number;
  database_name: string;
  username: string;
  password: string;
  sslmode?: string;
}

export interface OnboardingConnectionResponse {
  connection: {
    id: string;
    name: string;
    db_type: string;
    host: string;
    port: number;
    database_name: string;
    status: string;
  };
  success: boolean;
  message: string;
  db_version?: string;
}

export interface ColumnInfo {
  name: string;
  data_type: string;
  nullable: boolean;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
}

export interface IntrospectResponse {
  tables: TableInfo[];
}

export interface SchemaMappingRequest {
  connection_id: string;
  entity_table: string;
  entity_id_col: string;
  entity_name_col?: string;
  timestamp_col?: string;
  target_column?: string;
  signal_columns?: Record<string, string>;
  raw_schema?: Record<string, unknown>;
}

export interface CompleteOnboardingResponse {
  message: string;
  onboarding_done: boolean;
  generated_recommendations: number;
}
