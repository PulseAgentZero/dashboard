/** Connector types Studio can query (SQL or file-backed DuckDB). */
export const STUDIO_FILE_CONNECTORS = new Set(["csv", "excel", "google_sheets", "s3"]);

export function isStudioFileConnector(connectorType: string): boolean {
  return STUDIO_FILE_CONNECTORS.has(connectorType);
}

export function isStudioSqlConnector(connectorType: string): boolean {
  if (isStudioFileConnector(connectorType)) return false;
  const blocked = new Set(["airtable", "mongodb"]);
  return !blocked.has(connectorType);
}

export function studioConnectionLabel(connectorType: string): string {
  if (connectorType === "csv") return "CSV file";
  if (connectorType === "excel") return "Excel workbook";
  if (connectorType === "google_sheets") return "Google Sheets";
  if (connectorType === "s3") return "Amazon S3";
  return connectorType.replace(/_/g, " ");
}
