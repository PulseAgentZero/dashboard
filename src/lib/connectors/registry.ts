export type ConnectorGuideStep = {
  title: string;
  body: string;
  code?: string;
};

export type ConnectorMeta = {
  connectorType: string;
  logo: string;
  docHref?: string;
  prerequisites: string[];
  steps: ConnectorGuideStep[];
  securityTips: string[];
};

const DEFAULT_SECURITY_TIPS = [
  "Create a dedicated read-only user or role for Entivia.",
  "Restrict network access (IP allowlist, VPC peering, or private link).",
  "Rotate credentials immediately if a key is exposed.",
];

function meta(
  connectorType: string,
  partial: Omit<ConnectorMeta, "connectorType" | "logo"> & { logo?: string },
): ConnectorMeta {
  return {
    connectorType,
    logo: partial.logo ?? `/connectors/${connectorType}.svg`,
    docHref: partial.docHref ?? "/docs/data-sources",
    prerequisites: partial.prerequisites,
    steps: partial.steps,
    securityTips: partial.securityTips.length
      ? partial.securityTips
      : DEFAULT_SECURITY_TIPS,
  };
}

export const CONNECTOR_REGISTRY: Record<string, ConnectorMeta> = {
  postgresql: meta("postgresql", {
    docHref: "/docs/data-sources",
    prerequisites: [
      "PostgreSQL 12+ reachable from Entivia (host/port or socket).",
      "A database user with CONNECT on the database and SELECT on schemas you want to analyze.",
    ],
    steps: [
      {
        title: "Create a read-only role",
        body: "Run the following in your database as a superuser or owner:",
        code: `CREATE ROLE pulse_readonly LOGIN PASSWORD 'your_secure_password';
GRANT CONNECT ON DATABASE your_db TO pulse_readonly;
GRANT USAGE ON SCHEMA public TO pulse_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pulse_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO pulse_readonly;`,
      },
      {
        title: "Allow network access",
        body: "Update pg_hba.conf and security groups so Entivia (or your self-hosted host) can reach the server on the configured port.",
      },
      {
        title: "Enter connection details",
        body: "Use the host, port, database name, username, and password in the form. Enable SSL if your server requires it.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  mysql: meta("mysql", {
    prerequisites: [
      "MySQL 5.7+ or MariaDB 10.3+ reachable from Entivia.",
      "A user with SELECT on target databases and SHOW VIEW if you use views.",
    ],
    steps: [
      {
        title: "Create a read-only user",
        body: "Connect as admin and create a limited user:",
        code: `CREATE USER 'pulse_readonly'@'%' IDENTIFIED BY 'your_secure_password';
GRANT SELECT ON your_db.* TO 'pulse_readonly'@'%';
FLUSH PRIVILEGES;`,
      },
      {
        title: "Configure firewall",
        body: "Open port 3306 (or your custom port) only to Entivia Cloud egress IPs or your self-hosted VPC.",
      },
      {
        title: "Fill in the connection form",
        body: "Provide host, port, database name, username, and password.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  mssql: meta("mssql", {
    prerequisites: [
      "SQL Server instance with TCP enabled.",
      "SQL authentication or Windows auth supported by your deployment.",
    ],
    steps: [
      {
        title: "Create a login and user",
        body: "Use SQL Server Management Studio or sqlcmd:",
        code: `CREATE LOGIN pulse_readonly WITH PASSWORD = 'your_secure_password';
USE your_db;
CREATE USER pulse_readonly FOR LOGIN pulse_readonly;
ALTER ROLE db_datareader ADD MEMBER pulse_readonly;`,
      },
      {
        title: "Enable remote connections",
        body: "Ensure SQL Server Browser and firewall rules allow inbound TCP on your port (default 1433).",
      },
      {
        title: "Enter credentials in Entivia",
        body: "Use host, port, database name, username, and password in the configuration form.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  sqlite: meta("sqlite", {
    prerequisites: [
      "SQLite database file accessible on the Entivia API host (self-hosted single-node).",
      "File path must be readable by the Entivia process user.",
    ],
    steps: [
      {
        title: "Place the database file",
        body: "Copy or mount the .db file on the server running Entivia. Note the absolute path.",
      },
      {
        title: "Set permissions",
        body: "chmod 640 on the file and ensure only the Entivia service account can read it.",
      },
      {
        title: "Provide the file path",
        body: "Enter the full path in the connection form (e.g. /data/app/production.db).",
      },
    ],
    securityTips: [
      "SQLite files contain full data at rest—encrypt disks and restrict host access.",
      ...DEFAULT_SECURITY_TIPS,
    ],
  }),

  csv: meta("csv", {
    prerequisites: [
      "CSV file under 50 MB, or use S3/GCS connectors for larger files.",
    ],
    steps: [
      {
        title: "Prepare your file",
        body: "Use UTF-8 encoding, a header row, and consistent column types. Remove sensitive columns you do not need in Entivia.",
      },
      {
        title: "Upload in the dashboard",
        body: "Use the file upload field in the connection form. Entivia stores the file for pipeline ingestion.",
      },
      {
        title: "Map entities",
        body: "After upload, complete schema mapping under Schema mappings when prompted.",
      },
    ],
    securityTips: [
      "Do not upload files containing unnecessary PII.",
      "Delete the connection when the upload is no longer needed.",
    ],
  }),

  snowflake: meta("snowflake", {
    prerequisites: [
      "Snowflake account with a warehouse, role, and database.",
      "User with USAGE on warehouse/database and SELECT on schemas.",
    ],
    steps: [
      {
        title: "Create a service user",
        body: "In Snowflake, create a user and grant least privilege:",
        code: `CREATE USER pulse_user PASSWORD='your_secure_password';
GRANT ROLE pulse_role TO USER pulse_user;
GRANT USAGE ON WAREHOUSE your_warehouse TO ROLE pulse_role;
GRANT USAGE ON DATABASE your_db TO ROLE pulse_role;
GRANT USAGE ON ALL SCHEMAS IN DATABASE your_db TO ROLE pulse_role;
GRANT SELECT ON ALL TABLES IN DATABASE your_db TO ROLE pulse_role;`,
      },
      {
        title: "Build the connection URL",
        body: "Format: account.region.snowflakecomputing.com with warehouse and role in the connection URL field as required by Entivia.",
      },
      {
        title: "Enter URL and credentials",
        body: "Paste the Snowflake connection URL and username/password in the form.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  bigquery: meta("bigquery", {
    prerequisites: [
      "Google Cloud project with BigQuery API enabled.",
      "Service account JSON key with BigQuery Data Viewer (and Job User if required).",
    ],
    steps: [
      {
        title: "Create a service account",
        body: "In GCP Console → IAM → Service Accounts, create an account and download a JSON key.",
      },
      {
        title: "Grant BigQuery access",
        body: "Assign roles: BigQuery Data Viewer on the dataset, and BigQuery Job User on the project if queries run jobs.",
      },
      {
        title: "Connection URL",
        body: "Use bigquery://project_id/dataset in the connection URL field and paste the service account JSON in the credentials field.",
      },
    ],
    securityTips: [
      "Store the JSON key only in Entivia—never commit it to git.",
      ...DEFAULT_SECURITY_TIPS,
    ],
  }),

  databricks: meta("databricks", {
    prerequisites: [
      "Databricks workspace with a SQL warehouse.",
      "Personal access token or service principal with CAN USE on the warehouse.",
    ],
    steps: [
      {
        title: "Create a token",
        body: "User Settings → Developer → Access tokens → Generate new token. Copy it once; it will not be shown again.",
      },
      {
        title: "Get the SQL warehouse JDBC/HTTP path",
        body: "From the warehouse connection details, copy the server hostname and HTTP path.",
      },
      {
        title: "Enter connection URL and token",
        body: "Paste the Databricks SQL connection URL and token in the Entivia form.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  redshift: meta("redshift", {
    prerequisites: [
      "Amazon Redshift cluster or serverless workgroup.",
      "Database user with SELECT on schemas to analyze.",
    ],
    steps: [
      {
        title: "Create a database user",
        body: "Connect as admin and run:",
        code: `CREATE USER pulse_readonly PASSWORD 'your_secure_password';
GRANT USAGE ON SCHEMA public TO pulse_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pulse_readonly;`,
      },
      {
        title: "Configure security group",
        body: "Allow inbound TCP 5439 from Entivia Cloud IPs or your self-hosted security group.",
      },
      {
        title: "Enter host and credentials",
        body: "Use the Redshift endpoint, port 5439, database name, and user credentials.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  clickhouse: meta("clickhouse", {
    prerequisites: [
      "ClickHouse server with HTTP or native interface reachable from Entivia.",
      "User with SELECT on target databases/tables.",
    ],
    steps: [
      {
        title: "Create a read-only user",
        body: "In ClickHouse:",
        code: `CREATE USER pulse_readonly IDENTIFIED BY 'your_secure_password';
GRANT SELECT ON your_db.* TO pulse_readonly;`,
      },
      {
        title: "Choose connection mode",
        body: "Use HTTPS URL or native DSN as documented for your ClickHouse deployment.",
      },
      {
        title: "Fill in the form",
        body: "Enter URL, username, and password in the configuration panel.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  mongodb: meta("mongodb", {
    prerequisites: [
      "MongoDB Atlas cluster or self-hosted replica set.",
      "Connection URI with read-only user.",
    ],
    steps: [
      {
        title: "Create a database user",
        body: "In Atlas → Database Access, add a user with read-only built-in role on the target database.",
      },
      {
        title: "Allow network access",
        body: "Add Entivia egress IPs (Cloud) or your VPC CIDR (self-hosted) to the IP access list.",
      },
      {
        title: "Paste the connection URI",
        body: "Use mongodb+srv://user:password@cluster.mongodb.net/database in the URI field.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  airtable: meta("airtable", {
    prerequisites: [
      "Airtable personal access token with data.records:read scope.",
      "Base ID for the base you want to connect.",
    ],
    steps: [
      {
        title: "Create a personal access token",
        body: "Airtable → Developer hub → Personal access tokens. Scope to the minimum bases and read access.",
      },
      {
        title: "Find your base ID",
        body: "Open the base; the ID appears in the URL (appXXXXXXXXXXXXXX).",
      },
      {
        title: "Enter token and base ID",
        body: "Paste the token and optional base ID in the Entivia connection form.",
      },
    ],
    securityTips: [
      "Tokens grant API access—rotate if exposed.",
      ...DEFAULT_SECURITY_TIPS,
    ],
  }),

  google_sheets: meta("google_sheets", {
    prerequisites: [
      "Google Cloud API key with Google Sheets API enabled, or service account with sheet access.",
      "Spreadsheet ID from the sheet URL.",
    ],
    steps: [
      {
        title: "Enable Google Sheets API",
        body: "In GCP Console → APIs & Services, enable Google Sheets API for your project.",
      },
      {
        title: "Create credentials",
        body: "Create an API key (restrict to Sheets API) or a service account and share the sheet with its email.",
      },
      {
        title: "Enter API key and spreadsheet ID",
        body: "Spreadsheet ID is the long string in docs.google.com/spreadsheets/d/{id}/edit.",
      },
    ],
    securityTips: [
      "Restrict API keys by HTTP referrer or IP where possible.",
      ...DEFAULT_SECURITY_TIPS,
    ],
  }),

  s3: meta("s3", {
    prerequisites: [
      "S3 bucket with CSV or Parquet objects.",
      "IAM user or role with s3:GetObject and s3:ListBucket on that prefix.",
    ],
    steps: [
      {
        title: "Create IAM policy",
        body: "Minimum permissions for a prefix:",
        code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:ListBucket"],
    "Resource": [
      "arn:aws:s3:::your-bucket",
      "arn:aws:s3:::your-bucket/your-prefix/*"
    ]
  }]
}`,
      },
      {
        title: "Create access keys",
        body: "Create an IAM user, attach the policy, and generate access key + secret.",
      },
      {
        title: "Enter bucket and credentials",
        body: "Provide bucket name, region, access key, and secret in the form.",
      },
    ],
    securityTips: DEFAULT_SECURITY_TIPS,
  }),

  gcs: meta("gcs", {
    prerequisites: [
      "GCS bucket with CSV or Parquet files.",
      "Service account JSON with storage.objects.get and storage.objects.list.",
    ],
    steps: [
      {
        title: "Create a service account",
        body: "GCP → IAM → Service Accounts. Grant Storage Object Viewer on the bucket.",
      },
      {
        title: "Download JSON key",
        body: "Create a key and download the JSON file. Keep it secure.",
      },
      {
        title: "Enter bucket and JSON",
        body: "Provide bucket name and paste the full service account JSON in the credentials field.",
      },
    ],
    securityTips: [
      "Never commit service account JSON to source control.",
      ...DEFAULT_SECURITY_TIPS,
    ],
  }),
};

export function getConnectorMeta(connectorType: string): ConnectorMeta | undefined {
  return CONNECTOR_REGISTRY[connectorType];
}

export function getConnectorLogo(connectorType: string): string {
  return CONNECTOR_REGISTRY[connectorType]?.logo ?? `/connectors/${connectorType}.svg`;
}
