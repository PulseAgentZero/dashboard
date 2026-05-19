/** Sync with api/.env.example and docker/compose/self-hosted/.env.example */

export type EnvVar = {
  name: string;
  required?: boolean;
  default?: string;
  description: string;
  selfHostedOnly?: boolean;
};

export type EnvVarGroup = {
  id: string;
  title: string;
  description?: string;
  vars: EnvVar[];
};

export const ENV_VAR_GROUPS: EnvVarGroup[] = [
  {
    id: "database",
    title: "Database",
    description: "PostgreSQL connection. Compose builds DATABASE_URL from POSTGRES_* when not set.",
    vars: [
      {
        name: "POSTGRES_USER",
        default: "pulse",
        description: "Postgres username (compose service).",
      },
      {
        name: "POSTGRES_PASSWORD",
        required: true,
        description: "Postgres password. Generate: openssl rand -hex 24",
      },
      {
        name: "POSTGRES_DB",
        default: "pulse",
        description: "Database name.",
      },
      {
        name: "DATABASE_URL",
        description:
          "Full async DSN. Overrides POSTGRES_* when connecting to external/managed Postgres.",
      },
      {
        name: "DATABASE_POOL_SIZE",
        default: "5",
        description: "SQLAlchemy connection pool size.",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    vars: [
      {
        name: "JWT_SECRET",
        required: true,
        description: "JWT signing secret. Generate: openssl rand -hex 32",
      },
      {
        name: "ENCRYPTION_KEY",
        required: true,
        description:
          "Fernet key for encrypting client DB credentials at rest.",
      },
      {
        name: "ACCESS_TOKEN_EXPIRE_MINUTES",
        default: "15",
        description: "JWT access token lifetime in minutes.",
      },
      {
        name: "PASSWORD_MIN_LENGTH",
        default: "8",
        description: "Minimum password length for new accounts.",
      },
    ],
  },
  {
    id: "llm",
    title: "LLM providers",
    description:
      "At least one provider is required. Used by the AI pipeline and Studio NL→SQL.",
    vars: [
      {
        name: "ANTHROPIC_API_KEY",
        required: true,
        description: "Anthropic Claude — primary pipeline LLM.",
      },
      {
        name: "GROQ_API_KEY",
        required: true,
        description: "Groq — fallback LLM when Anthropic is unavailable.",
      },
      {
        name: "AI_PROVIDER",
        description:
          "Studio AI provider: anthropic | openai | groq | ollama | azure_openai | mistral | google",
      },
      {
        name: "AI_MODEL",
        description: "Override default model for the chosen provider.",
      },
      {
        name: "OLLAMA_BASE_URL",
        selfHostedOnly: true,
        description: "Local Ollama URL for air-gapped deployments (no external API calls).",
      },
    ],
  },
  {
    id: "redis",
    title: "Redis",
    vars: [
      {
        name: "REDIS_URL",
        description:
          "Refresh rotation, OAuth, rate limits, Studio cache, embed tokens, schedules. Without Redis: stateless refresh JWTs, no embed tokens.",
      },
      {
        name: "REDIS_MAX_MEMORY",
        default: "512mb",
        description: "Redis memory cap hint.",
      },
    ],
  },
  {
    id: "email",
    title: "Email",
    vars: [
      {
        name: "EMAIL_BACKEND",
        description: "resend | smtp — auto-detected from configured keys.",
      },
      {
        name: "RESEND_API_KEY",
        description: "Resend API key for transactional email.",
      },
      {
        name: "DEFAULT_FROM_EMAIL",
        default: "noreply@pulse.club",
        description: "Sender address for system emails.",
      },
      {
        name: "SMTP_HOST",
        description: "SMTP server hostname.",
      },
      {
        name: "SMTP_PORT",
        default: "587",
        description: "SMTP port.",
      },
    ],
  },
  {
    id: "storage",
    title: "File storage",
    vars: [
      {
        name: "STORAGE_BACKEND",
        default: "local",
        description: "local | s3 | minio — avatars, logos, CSV uploads. Auto-detects from MINIO_ENDPOINT_URL or ASSETS_S3_BUCKET if unset.",
      },
      {
        name: "LOCAL_STORAGE_PATH",
        default: "/app/uploads",
        description: "Local filesystem path when STORAGE_BACKEND=local (compose volume uploads_data).",
      },
      {
        name: "ASSETS_S3_BUCKET",
        description: "S3 bucket name when using AWS S3.",
      },
      {
        name: "ASSETS_S3_PREFIX",
        default: "pulse/assets",
        description: "Key prefix inside the bucket.",
      },
      {
        name: "AWS_REGION",
        default: "us-east-1",
        description: "AWS region for the S3 bucket.",
      },
      {
        name: "AWS_ACCESS_KEY_ID",
        description:
          "AWS access key for S3 uploads. Standard boto3 env var (not a Settings field). Omit on ECS/EC2 if the task has an IAM role.",
      },
      {
        name: "AWS_SECRET_ACCESS_KEY",
        description: "AWS secret key paired with AWS_ACCESS_KEY_ID. Never commit real values.",
      },
      {
        name: "ASSETS_PUBLIC_BASE_URL",
        description: "Optional public base URL for uploaded files (e.g. CloudFront). Defaults to bucket URL.",
      },
      {
        name: "MINIO_ENDPOINT_URL",
        description: "MinIO or S3-compatible endpoint (R2, DO Spaces, etc.) when STORAGE_BACKEND=minio.",
      },
      {
        name: "MINIO_ACCESS_KEY",
        description: "Access key for MinIO / S3-compatible storage.",
      },
      {
        name: "MINIO_SECRET_KEY",
        description: "Secret key for MinIO / S3-compatible storage.",
      },
      {
        name: "MINIO_BUCKET",
        default: "pulse-assets",
        description: "Bucket name for MinIO backend.",
      },
    ],
  },
  {
    id: "application",
    title: "Application",
    vars: [
      {
        name: "FRONTEND_URL",
        required: true,
        description:
          "Dashboard URL for CORS and email links. No trailing slash. Self-hosted: your browser URL.",
      },
      {
        name: "ENVIRONMENT",
        default: "development",
        description: "development | staging | production",
      },
      {
        name: "LOG_LEVEL",
        default: "INFO",
        description: "Python log level.",
      },
    ],
  },
  {
    id: "license",
    title: "License (self-hosted)",
    description:
      "Standard Docker Hub installs do not use license env vars. Enter your plc_… key under Settings → License after sign-in.",
    vars: [
      {
        name: "PULSE_LICENSE_KEY",
        selfHostedOnly: true,
        description:
          "Optional: preload a Pro license (plc_…) via env. Most users activate in the dashboard instead.",
      },
    ],
  },
  {
    id: "runtime",
    title: "Runtime & image",
    description:
      "Used by the all-in-one `entivia/entivia` image. Set in `.env` alongside the compose file.",
    vars: [
      {
        name: "PULSE_VERSION",
        default: "latest",
        description: "Docker image tag for `entivia/entivia` (e.g. `latest` or a release tag).",
      },
      {
        name: "PORT",
        default: "80",
        description: "Host port mapped to nginx inside the Entivia container (`HOST:80`).",
      },
    ],
  },
];
