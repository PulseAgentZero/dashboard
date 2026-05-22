# Redis, email & storage

## Redis

`REDIS_URL` enables features that require shared state:

| Feature | Without Redis |
|---------|----------------|
| Refresh token rotation | Stateless JWT refresh only |
| Email verification / password reset tokens | Disabled |
| Google OAuth | Disabled |
| Public API rate limits | Not enforced per key |
| Studio query cache & schema cache | Disabled |
| Dashboard embed tokens | **Not available** |
| Auto-refresh schedules | Disabled |

**Recommendation:** Always run Redis in production. For self-hosted, the default `chideraozigbo488/entivia` image includes embedded Redis.

```bash
REDIS_URL=redis://localhost:6379/0
REDIS_MAX_MEMORY=512mb
```

## Email

Entivia sends verification, password reset, and invite emails when configured.

**Resend:**

```bash
RESEND_API_KEY=re_...
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

**SMTP (any provider):**

```bash
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...
SMTP_USE_STARTTLS=true
```

Auto-detection: Resend if `RESEND_API_KEY` is set, otherwise SMTP if `SMTP_HOST` is set.

## File storage

Uploads (avatars, logos, CSVs) use `STORAGE_BACKEND`:

| Value | Use case |
|-------|----------|
| `local` | Dev or single-node self-hosted (`LOCAL_STORAGE_PATH`, served at `/assets`) |
| `s3` | AWS S3 (`ASSETS_S3_BUCKET`, `AWS_REGION`) |
| `minio` | S3-compatible (R2, DO Spaces, MinIO) |

```bash
STORAGE_BACKEND=local
LOCAL_STORAGE_PATH=/app/uploads
LOCAL_STORAGE_URL_BASE=http://localhost:8000/assets
```

## Google OAuth

Requires Redis plus:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/.../oauth/google/callback
```

## Vector search (optional)

For semantic entity search:

```bash
VOYAGEAI_API_KEY=...
QDRANT_URL=http://localhost:6333
```

Without Voyage/Qdrant, similarity search is disabled; core pipeline still runs.

## Related

- [Environment variables](/docs/configuration/environment-variables) — full reference tables
- [Getting started](/docs/getting-started)
