# Environment variables

This reference is for **[self-hosted](/docs/hosting/self-hosted)** operators who configure the `chideraozigbo488/entivia` image via `.env`.

**[Entivia Cloud](/docs/hosting/cloud)** customers do not set these variables—Entivia operates the hosted environment. Manage your workspace from the dashboard (connections, API keys, billing, team).

> These variables apply to the all-in-one `chideraozigbo488/entivia` image and the [recommended self-hosted compose](/docs/hosting/self-hosted).

## Required for self-hosted

At minimum:

- `POSTGRES_PASSWORD` or `DATABASE_URL`
- `JWT_SECRET` and `ENCRYPTION_KEY`
- At least one LLM key (`ANTHROPIC_API_KEY` and/or `GROQ_API_KEY`)
- `FRONTEND_URL` — the URL users open in the browser (CORS and email links)
- `PORT` — host port if not using 80 (optional)
- `ENTIVIA_VERSION` — Docker image tag (optional, default `latest`)

## Generating secrets

```bash
openssl rand -hex 32   # JWT_SECRET
openssl rand -hex 24   # POSTGRES_PASSWORD
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

The reference tables follow in the sections below.
