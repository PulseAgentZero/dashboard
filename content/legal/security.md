---
lastUpdated: 2026-05-18
---

# Security

Entivia is built for teams that connect sensitive operational data. This page describes how we protect the Entivia Intelligence Engine on **Entivia Cloud** and what you control when you run **self-hosted** deployments.

For legal terms, see our [Privacy Policy](/privacy) and [Terms of Service](/terms).

## Shared responsibility

Security is a partnership:

| Responsibility | Entivia Cloud | Self-hosted |
|----------------|-------------|-------------|
| Application security patches | Entivia | You (via image upgrades) |
| Network perimeter & VPC | Entivia (hosted) | You |
| Database credentials & least privilege | You | You |
| API keys & team access | You | You |
| Encryption keys (`JWT_SECRET`, `ENCRYPTION_KEY`) | Entivia (managed) | You |
| LLM data residency | Your provider choice | You (e.g. local Ollama) |

## Encryption

**In transit** — Browser and API traffic use TLS (HTTPS). Do not disable TLS in production.

**At rest** — Connection credentials to your data sources are encrypted using **Fernet** symmetric encryption before storage. On self-hosted, you generate and protect `ENCRYPTION_KEY` in your `.env` file.

**Secrets management** — Generate strong secrets and rotate them on a schedule:

```bash
openssl rand -hex 32   # JWT_SECRET
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

See [Environment variables — Security](/docs/configuration/environment-variables) for the full reference.

## Authentication and access control

- **Dashboard sessions** — JWT-based authentication with configurable access token lifetime (default 15 minutes). Refresh and sign-out invalidate continued use of stolen tokens within that window.
- **Passwords** — Stored using one-way hashing; minimum length enforced (default 8 characters).
- **API keys** — Issued per organization with scopes for programmatic access. Treat keys like passwords; rotate and revoke unused keys from **Settings → API keys**.
- **Team access** — Invite colleagues with organization roles. Remove users promptly when they leave.
- **OAuth** — Optional Google sign-in; we receive profile identifiers needed for authentication, not your Google password.

## Network and deployment

**Self-hosted** — Deploy inside your VPC or private network so pipeline traffic to Connected Systems does not traverse the public internet unnecessarily. Entivia connects **outbound** to your databases; you do not need to expose your warehouse to the internet for Entivia to work.

**Entivia Cloud** — Tenant workloads are logically separated. We operate hosted infrastructure with standard cloud security controls; details are available on request for enterprise customers.

Set `FRONTEND_URL` to the exact URL users type in the browser so CORS, email links, and redirects remain correct.

## Data handling

- Use **read-only** database users where your engine supports them.
- Limit connection scopes to schemas and tables required for analytics.
- Review [Security recommendations](/docs/data-sources#security-recommendations) per connector type.
- On self-hosted, customer pipeline data remains in **your** environment. See [Data privacy](/docs/hosting/self-hosted#data-privacy) in the self-hosted guide.

## AI and LLM data handling

AI features may send schema metadata, query context, or samples to configured LLM providers. To keep data on-premises:

- Set `AI_PROVIDER=ollama` and run Ollama inside your network.
- Avoid sending production PII in prompts when testing in Studio.

Minimize what you connect and what you ask the agent to process.

## Logging, monitoring, and audit

- **Audit logs** — Organization administrators can review significant actions in the dashboard (**Audit logs**).
- **Operational logs** — We log errors and security events needed to run the service. Self-hosted operators control log retention on their infrastructure.
- **Alerts** — Configure alert channels for pipeline and operational events you define.

## Vulnerability disclosure

We welcome responsible reports of security vulnerabilities. Please email **security@entivia.online** with:

- A clear description and steps to reproduce.
- Impact assessment if known.
- Your contact information for follow-up.

Please do not publicly disclose issues until we have had a reasonable time to investigate and remediate. We do not pursue legal action against researchers who act in good faith and avoid privacy violations, data destruction, or service disruption.

## Incident response

If we confirm a security incident affecting Entivia Cloud customer data, we will investigate promptly, take containment steps, and notify affected customers and regulators where required by law.

Self-hosted operators are responsible for incident response within their own environments; we provide security updates through published container images and documentation.

## Compliance posture

Entivia is designed with privacy regulations such as **NDPR** in mind, especially for teams that need operational control through self-hosted deployment. We do not claim third-party certifications (such as SOC 2 or ISO 27001) unless explicitly published on this page.

Your compliance obligations depend on your industry, data types, and deployment model. Use our [Trust Center](/trust) and documentation to support your assessments.

## Related resources

- [Trust Center](/trust)
- [Privacy Policy](/privacy)
- [Terms of Service](/terms)
- [Architecture](/docs/architecture)
- [Self-hosted deployment](/docs/hosting/self-hosted)
- [Environment variables](/docs/configuration/environment-variables)

Questions: **security@entivia.online**
