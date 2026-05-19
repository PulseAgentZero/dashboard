/**
 * Connectors that support live schema introspection (tables + columns) and
 * entity-table mapping for the core pipeline. Excludes file/API sources
 * (CSV, S3, Airtable, Google Sheets, etc.).
 */
const ENTITY_MAPPING_CONNECTORS = new Set([
  "postgresql",
  "mysql",
  "mssql",
  "sqlite",
  "redshift",
  "snowflake",
  "bigquery",
  "databricks",
  "clickhouse",
]);

export function supportsEntityMapping(connectorType: string): boolean {
  return ENTITY_MAPPING_CONNECTORS.has(connectorType.toLowerCase());
}
