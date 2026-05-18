# Supported data sources

Pulse connects to your existing data through **connections**. Each connection uses a **connector type** with the credentials and fields required for that system.

In the dashboard: **Settings → Connections → Add connection**. Pick a connector from the list and fill in the required fields.

Credentials are encrypted at rest. Use **read-only** database users whenever your source supports them.

## SQL databases

Best for the core **pipeline** (entity profiling, risk scoring) and **Studio** SQL features when the connector supports live SQL introspection.

| Connector | Type ID | Notes |
|-----------|---------|--------|
| PostgreSQL | `postgresql` | Host, port, database, user, password, optional SSL mode |
| MySQL / MariaDB | `mysql` | Standard TCP connection |
| Microsoft SQL Server | `mssql` | Standard TCP connection |
| Amazon Redshift | `redshift` | Postgres-compatible wire protocol |
| SQLite | `sqlite` | File path on the API host (single-node self-hosted) |

These support **read-only** session mode for live queries: Pulse does not mutate your source data through the connection.

## Cloud warehouses & analytical databases

| Connector | Type ID | Notes |
|-----------|---------|--------|
| Snowflake | `snowflake` | Connection URL (account, warehouse, role) |
| Google BigQuery | `bigquery` | Connection URL (`bigquery://project/dataset`) |
| Databricks | `databricks` | SQL warehouse connection URL |
| ClickHouse | `clickhouse` | Native DSN or HTTPS URL + credentials |

## NoSQL

| Connector | Type ID | Notes |
|-----------|---------|--------|
| MongoDB | `mongodb` | MongoDB connection URI |

## Spreadsheets & SaaS

| Connector | Type ID | Notes |
|-----------|---------|--------|
| Google Sheets | `google_sheets` | API key + spreadsheet ID |
| Airtable | `airtable` | Personal access token + optional base ID |

## Object storage

For buckets containing **CSV or Parquet** files:

| Connector | Type ID | Notes |
|-----------|---------|--------|
| Amazon S3 | `s3` | Bucket, access key, secret, region |
| Google Cloud Storage | `gcs` | Bucket + service account JSON |

## File upload

| Connector | Type ID | Notes |
|-----------|---------|--------|
| CSV / file upload | `csv` | Upload in the dashboard (max **50 MB**) |

## Feature support by connector category

Not every connector is used the same way inside Pulse:

| Category | Pipeline & entity SQL mapping | Studio live SQL |
|----------|------------------------------|-----------------|
| SQL databases (Postgres, MySQL, MSSQL, Redshift, SQLite) | Yes | Yes |
| Cloud warehouses (Snowflake, BigQuery, Databricks, ClickHouse) | Yes (via SQL) | Yes where SQL introspection is available |
| Spreadsheets, object storage, MongoDB, CSV | Ingestion / API-style workflows | Limited — not a substitute for a SQL warehouse |

If you configure an API or object-store connector where the pipeline expects live SQL entity mapping, you may see an error directing you to use a SQL database or CSV upload instead.

## Security recommendations

1. Create a dedicated **read-only** user for Pulse.
2. Restrict network access (IP allowlist, VPC peering, or private link) so only Pulse can reach the host.
3. On **self-hosted**, keep the connection inside your network; Pulse Cloud reaches your source over the network path you allow.
4. Rotate credentials if a key is exposed; delete and recreate the connection in the dashboard.

## Testing a connection

After saving a connection, click **Test** on the connection card in the dashboard. Status becomes `active` / `connected` on success, or `failed` with an error message shown on the card.

## Related

- [Getting started](/docs/getting-started) — first connection after signup
- [Pulse Cloud](/docs/hosting/cloud) — SaaS signup flow
- [Self-hosted](/docs/hosting/self-hosted) — connections inside your VPC
