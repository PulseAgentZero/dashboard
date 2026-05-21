export type SchemaColumnInfo = {
  name: string;
  data_type: string;
  nullable: boolean;
};

export type SchemaTableInfo = {
  name: string;
  columns: SchemaColumnInfo[];
};

export type IntrospectTablesResponse = {
  tables: SchemaTableInfo[];
};

export type SchemaMapping = {
  id: string;
  org_id: string;
  connection_id: string;
  entity_table: string | null;
  entity_id_col: string | null;
  entity_name_col: string | null;
  signal_columns: Record<string, string> | null;
  timestamp_col: string | null;
  target_column: string | null;
  risk_config: Record<string, unknown> | null;
  raw_schema: { tables?: SchemaTableInfo[] } | null;
  created_at: string;
  pipeline_triggered?: boolean;
  pipeline_run_id?: string | null;
};

export type CreateSchemaMappingRequest = {
  connection_id: string;
  entity_table: string;
  entity_id_col: string;
  entity_name_col?: string | null;
  signal_columns?: Record<string, string> | null;
  timestamp_col?: string | null;
  target_column?: string | null;
  raw_schema?: { tables: SchemaTableInfo[] } | null;
};

export type UpdateSchemaMappingRequest = Partial<
  Omit<CreateSchemaMappingRequest, "connection_id">
>;
