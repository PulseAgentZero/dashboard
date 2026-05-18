# License activation

**Self-hosted** installations use a license key to unlock Pro. **[Pulse Cloud](/docs/hosting/cloud)** (SaaS) uses dashboard subscriptions instead—no `PULSE_LICENSE_KEY` on your side.

## Purchase a license

1. Sign in or create an account.
2. Go to [Self-hosted pricing](/pricing/self-hosted) and complete checkout.
3. Copy the `plc_...` license key from the confirmation screen or email.

## Activate via environment

Add to your `.env` next to `docker-compose.yml`:

```bash
PULSE_LICENSE_KEY=plc_your_license_jwt_here
```

Restart the stack:

```bash
docker compose up -d
```

## Activate via dashboard

1. Deploy with the [self-hosted compose](/docs/hosting/self-hosted) (`pulseai/pulse`).
2. Sign in as an **admin**.
3. Open **Settings → License**.
4. Paste the key and submit.

## Offline operation

| Variable | Default | Description |
|----------|---------|-------------|
| `LICENSE_SERVER_URL` | `https://license.pulseai.io` | Validation server |
| `LICENSE_OFFLINE_GRACE_DAYS` | `7` | Run without phone-home |
| `LICENSE_REVALIDATION_INTERVAL_HOURS` | `24` | Re-check interval |

If the license server is unreachable, Pulse continues within the grace period, then restricts Pro features.

## Related

- [Self-hosted deployment](/docs/hosting/self-hosted)
- [Environment variables](/docs/configuration/environment-variables)
