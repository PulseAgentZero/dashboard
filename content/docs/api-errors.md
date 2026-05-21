# Errors & limits

## Error shape

All errors return:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Human-readable description"
  }
}
```

Switch on `error.code` in your integration—never parse `message` for logic.

Validation errors (`422`) may include `fields`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "fields": {
      "email": "Invalid email format"
    }
  }
}
```

Plan gates (`402`) may include `feature` and `upgrade_url`:

```json
{
  "error": {
    "code": "FEATURE_LOCKED",
    "message": "Analytics requires a Pro plan",
    "feature": "advanced_analytics",
    "upgrade_url": "https://pulseai.io/pricing"
  }
}
```

## Common codes

| HTTP | Code | When |
|------|------|------|
| 400 | `BAD_REQUEST` | Invalid input |
| 400 | `PIPELINE_ALREADY_RUNNING` | Concurrent pipeline blocked |
| 401 | `INVALID_CREDENTIALS` | Wrong API key or missing header |
| 403 | `FORBIDDEN` | Insufficient key scope |
| 404 | `NOT_FOUND` | Resource missing or wrong org |
| 402 | `PLAN_LIMIT_REACHED` | Quota exceeded |
| 402 | `FEATURE_LOCKED` | Plan does not include feature |
| 422 | `VALIDATION_ERROR` | Body validation failed |
| 429 | `RATE_LIMITED` | Too many requests |

## Rate limits

When Redis is enabled on the API host:

| Surface | Limit |
|---------|-------|
| Public API — read keys | 30 req/min |
| Public API — write keys | 10 req/min |
| Studio public routes | 60 req/min per IP |

## Related

- [Public API overview](/docs/api/overview)
- [Authentication](/docs/api/authentication)
