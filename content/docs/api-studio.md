# Studio public API

Share Studio dashboards without API keys. These endpoints are **unauthenticated** and rate-limited per IP when Redis is available.

**Base path:** `/api/public/v1/studio`

## Public dashboard by slug

```
GET /api/public/v1/studio/dashboards/{slug}
```

- Only dashboards with `is_public: true` are accessible.
- Any query parameter is forwarded as a **dashboard filter** value for chart SQL.
- Charts execute server-side (up to 500 rows per visualization).

**Frontend URL:** `/p/{slug}` on the dashboard host.

## Embed by token

```
GET /api/public/v1/studio/embed/{token}
```

- Requires Redis on the API.
- Embed tokens are generated from the dashboard when an admin publishes an embed link.
- Default expiry: 24 hours; max 720 hours (30 days).

**Frontend URL:** `/embed/studio/{token}`

## Rate limit

60 requests per minute per IP (when Redis is configured).

## Endpoints

See the reference below.
