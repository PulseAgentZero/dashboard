# Log streaming

Licensed self-hosted instances can stream structured application logs from Settings -> Log streams.

Supported destinations:

- HTTP webhook endpoints for SIEMs and observability tools.
- Syslog collectors over UDP, TCP, or TLS.
- Rotating files under `/var/log/pulse/streams` inside the `pulse_logs` Docker volume.

Each delivered record is JSON and includes the standard fields `timestamp`, `level`, `logger`, `message`, plus structured fields such as `event_category`, `request_id`, `org_id`, `status_code`, `duration_ms`, and `run_id` when available.

HTTP destinations receive batched payloads:

```json
{
  "count": 1,
  "records": [
    {
      "timestamp": "2026-05-22T13:00:00Z",
      "level": "INFO",
      "logger": "app.api.middleware.logging_middleware",
      "message": "GET /api/v1/entities -> 200",
      "event_category": "api_request",
      "request_id": "abc123",
      "status_code": 200,
      "duration_ms": 42
    }
  ]
}
```

If you configure an HMAC secret, Entivia sends `X-Pulse-Signature: sha256=<hex digest>` computed over the raw request body.
