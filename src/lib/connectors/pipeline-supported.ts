/**
 * SQL database connectors. These need the user to map an entity table before the
 * pipeline can run — they do not auto-map.
 */
const SQL_ENTITY_MAPPING_CONNECTORS = new Set([
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

/**
 * File/spreadsheet connectors. The worker auto-introspects and creates a best-guess
 * mapping in the background, but the user can still refine it via the wizard.
 */
const FILE_ENTITY_MAPPING_CONNECTORS = new Set([
  "csv",
  "excel",
  "google_sheets",
  "s3",
]);

export function isSqlEntityMappingConnector(connectorType: string): boolean {
  return SQL_ENTITY_MAPPING_CONNECTORS.has(connectorType.toLowerCase());
}

export function isFileEntityMappingConnector(connectorType: string): boolean {
  return FILE_ENTITY_MAPPING_CONNECTORS.has(connectorType.toLowerCase());
}

/**
 * True when the connector supports the schema-mapping wizard (entity table +
 * identity/signal columns). Includes both SQL databases and file/spreadsheet
 * sources — anything the pipeline can profile entities from.
 */
export function supportsEntityMapping(connectorType: string): boolean {
  return (
    isSqlEntityMappingConnector(connectorType) ||
    isFileEntityMappingConnector(connectorType)
  );
}
