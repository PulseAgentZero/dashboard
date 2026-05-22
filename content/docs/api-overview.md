# Public API overview

The Entivia **Public API** lets external systems read entities, recommendations, analytics, and pipeline status—and trigger pipeline runs—with API keys.

## Base URL

**Entivia Cloud:**

```
https://api.entivia.online/api/public/v1
```

**Self-hosted:** replace the host with your own deployment URL, e.g. `https://entivia.acme.com/api/public/v1`.

## Authentication

Every request (except Studio public routes) requires:

```
X-API-Key: your_api_key_here
```

Create keys in the dashboard under **Developer → API Keys**. Keys are scoped:

| Scope | Allowed operations |
|-------|-------------------|
| **read** | GET endpoints |
| **write** | POST endpoints (e.g. trigger pipeline, action recommendations) |

JWT session tokens from the dashboard **do not** work on the public API.

## Response envelope

Successful responses wrap data:

```json
{
  "data": {
    "entities": [],
    "total": 0
  },
  "meta": {
    "page": 1,
    "limit": 50
  }
}
```

Errors use `{ "error": { "code", "message" } }` — see [Errors & limits](/docs/api/errors).

## Rate limits

When `REDIS_URL` is configured on the API:

| Key scope | Limit |
|-----------|-------|
| Read | 30 requests / minute |
| Write | 10 requests / minute |

Exceeded limits return `429` with `RATE_LIMITED`.

## Interactive documentation

OpenAPI-powered docs are always available on your API host:

- **ReDoc:** `/api/public/redoc`
- **OpenAPI JSON:** `/api/public/openapi.json`

Use these for exhaustive request/response schemas. This site documents the main resources and examples.

## Resources

| Guide | Description |
|-------|-------------|
| [Authentication](/docs/api/authentication) | Keys, scopes, security |
| [Entities](/docs/api/entities) | Profiles and risk history |
| [Recommendations](/docs/api/recommendations) | List, action, dismiss |
| [Analytics](/docs/api/analytics) | Overview stats |
| [Pipeline](/docs/api/pipeline) | Runs and triggers |
| [Studio (public)](/docs/api/studio) | Public dashboards & embeds |

## Try it

Sign in and use the [API Playground](/dashboard/playground) to send live requests.
