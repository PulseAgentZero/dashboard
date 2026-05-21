export type DataSourceRow = {
  connectorType: string;
  name: string;
  notes: string;
};

export type DataSourceSection = {
  id: string;
  title: string;
  description?: string;
  rows: DataSourceRow[];
};

export const DATA_SOURCE_SECTIONS: DataSourceSection[] = [
  {
    id: "sql-databases",
    title: "SQL databases",
    description:
      "Best for the core pipeline (entity profiling, risk scoring) and Studio SQL features when the connector supports live SQL introspection.",
    rows: [
      {
        connectorType: "postgresql",
        name: "PostgreSQL",
        notes: "Host, port, database, user, password, optional SSL mode",
      },
      {
        connectorType: "mysql",
        name: "MySQL / MariaDB",
        notes: "Standard TCP connection",
      },
      {
        connectorType: "mssql",
        name: "Microsoft SQL Server",
        notes: "Standard TCP connection",
      },
      {
        connectorType: "redshift",
        name: "Amazon Redshift",
        notes: "Postgres-compatible wire protocol",
      },
      {
        connectorType: "sqlite",
        name: "SQLite",
        notes: "File path on the API host (single-node self-hosted)",
      },
    ],
  },
  {
    id: "cloud-warehouses",
    title: "Cloud warehouses & analytical databases",
    rows: [
      {
        connectorType: "snowflake",
        name: "Snowflake",
        notes: "Connection URL (account, warehouse, role)",
      },
      {
        connectorType: "bigquery",
        name: "Google BigQuery",
        notes: "Connection URL (bigquery://project/dataset)",
      },
      {
        connectorType: "databricks",
        name: "Databricks",
        notes: "SQL warehouse connection URL",
      },
      {
        connectorType: "clickhouse",
        name: "ClickHouse",
        notes: "Native DSN or HTTPS URL + credentials",
      },
    ],
  },
  {
    id: "nosql",
    title: "NoSQL",
    rows: [
      {
        connectorType: "mongodb",
        name: "MongoDB",
        notes: "MongoDB connection URI",
      },
    ],
  },
  {
    id: "spreadsheets-saas",
    title: "Spreadsheets & SaaS",
    rows: [
      {
        connectorType: "google_sheets",
        name: "Google Sheets",
        notes: "API key + spreadsheet ID",
      },
      {
        connectorType: "airtable",
        name: "Airtable",
        notes: "Personal access token + optional base ID",
      },
    ],
  },
  {
    id: "object-storage",
    title: "Object storage",
    description: "For buckets containing CSV or Parquet files.",
    rows: [
      {
        connectorType: "s3",
        name: "Amazon S3",
        notes: "Bucket, access key, secret, region",
      },
      {
        connectorType: "gcs",
        name: "Google Cloud Storage",
        notes: "Bucket + service account JSON",
      },
    ],
  },
  {
    id: "file-upload",
    title: "File upload",
    rows: [
      {
        connectorType: "csv",
        name: "CSV / file upload",
        notes: "Upload in the dashboard (max 50 MB)",
      },
    ],
  },
];

/** Split data-sources.md for connector tables rendered with icons. */
export function splitDataSourcesMarkdown(content: string): {
  intro: string;
  tail: string;
} {
  const sqlStart = content.indexOf("## SQL databases");
  const featureStart = content.indexOf("## Feature support");

  if (sqlStart === -1 || featureStart === -1) {
    return { intro: content, tail: "" };
  }

  return {
    intro: content.slice(0, sqlStart).trimEnd(),
    tail: content.slice(featureStart).trimStart(),
  };
}
