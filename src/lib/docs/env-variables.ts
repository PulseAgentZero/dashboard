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
        description: "s3 | minio | local — avatars, logos, CSV uploads.",
      },
      {
        name: "LOCAL_STORAGE_PATH",
        default: "/app/uploads",
        description: "Local filesystem path when STORAGE_BACKEND=local.",
      },
      {
        name: "ASSETS_S3_BUCKET",
        description: "S3 bucket for cloud asset storage.",
      },
      {
        name: "MINIO_ENDPOINT_URL",
        description: "MinIO or S3-compatible endpoint (R2, DO Spaces, etc.).",
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
        name: "DEPLOYMENT_MODE",
        default: "self_hosted",
        description:
          "Set automatically by the `pulseai/pulse` image. Do not change unless you know you need a custom deployment profile.",
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
    vars: [
      {
        name: "PULSE_LICENSE_KEY",
        selfHostedOnly: true,
        description: "Pro license JWT (plc_…). Set in .env or activate via dashboard.",
      },
      {
        name: "LICENSE_SERVER_URL",
        default: "https://license.pulseai.io",
        selfHostedOnly: true,
        description: "Pulse license validation server.",
      },
      {
        name: "LICENSE_OFFLINE_GRACE_DAYS",
        default: "7",
        selfHostedOnly: true,
        description: "Days the instance can run offline without revalidation.",
      },
    ],
  },
  {
    id: "runtime",
    title: "Runtime & image",
    description:
      "Used by the all-in-one `pulseai/pulse` image. Set in `.env` alongside the compose file.",
    vars: [
      {
        name: "PULSE_VERSION",
        default: "latest",
        description: "Docker image tag for `pulseai/pulse` (e.g. `latest` or a release tag).",
      },
      {
        name: "PORT",
        default: "80",
        description: "Host port mapped to nginx inside the Pulse container (`HOST:80`).",
      },
    ],
  },
];
