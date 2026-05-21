# API authentication

## API keys

1. Sign in to the dashboard.
2. Navigate to **Developer → API Keys**.
3. Click **Create key**, choose **read** or **write** scope, and copy the secret immediately.

Keys are stored as hashes—**the full value is shown only once**.

## Request header

```bash
curl -H "X-API-Key: pk_live_xxxxxxxx" \
  https://api.yourdomain.com/api/public/v1/entities
```

Never send API keys in query strings or commit them to source control.

## Scopes

| Scope | Methods | Example endpoints |
|-------|---------|-------------------|
| `read` | GET | `/entities`, `/recommendations`, `/analytics/overview` |
| `write` | POST | `/pipeline/trigger`, `/recommendations/{id}/action` |

A write key does not automatically grant read access to all GET routes in every deployment—create separate keys if you need least privilege.

## Dashboard sessions

Sign-in tokens from the Entivia dashboard **cannot** be used on the public API. Use API keys for all programmatic access documented in this section.

## Rotating keys

1. Create a new key.
2. Update your integration.
3. Delete the old key from the dashboard.

## Related

- [Public API overview](/docs/api/overview)
- [Errors & limits](/docs/api/errors)
