# License activation

**Self-hosted** installations use a license key to unlock Pro. **[Entivia Cloud](/docs/hosting/cloud)** (SaaS) uses dashboard subscriptions instead—no self-hosted license key on your side.

## Purchase a license

1. Go to [Self-hosted pricing](/pricing/self-hosted) and complete checkout with your email.
2. Copy the `plc_...` license key from the confirmation screen or email.
3. If you lose the key later, use the [license portal](/pricing/self-hosted/portal) to email yourself a fresh copy.

## Activate via dashboard

1. Deploy with the [self-hosted compose](/docs/hosting/self-hosted) (`chideraozigbo488/entivia`).
2. Sign in as an **admin**.
3. Open **Settings → License**.
4. Paste the key and submit.

## Offline operation

| Variable | Default | Description |
|----------|---------|-------------|
| `LICENSE_SERVER_URL` | `https://license.entivia.online` | Validation server |
| `LICENSE_OFFLINE_GRACE_DAYS` | `7` | Run without phone-home |
| `LICENSE_REVALIDATION_INTERVAL_HOURS` | `24` | Re-check interval |

If the license server is unreachable, Entivia continues within the grace period, then restricts Pro features.

## Related

- [Self-hosted deployment](/docs/hosting/self-hosted)
- [Environment variables](/docs/configuration/environment-variables)
