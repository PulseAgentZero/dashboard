---
lastUpdated: 2026-05-18
---

# Privacy Policy

This Privacy Policy explains how Pulse ("**we**," "**us**," or "**our**") collects, uses, discloses, and protects personal data when you use the Pulse Intelligence Engine website, **Pulse Cloud**, **self-hosted** deployments, and related services (the "**Services**").

We are committed to transparency and to practices aligned with the Nigeria Data Protection Regulation (NDPR) and, where applicable, the EU General Data Protection Regulation (GDPR).

## 1. Who we are

**Pulse Intelligence Engine** provides a real-time intelligence platform for operational teams. Depending on how you use Pulse, we may act as a **data controller** (for example, for your account and billing on Pulse Cloud) or as a **data processor** on your instructions (for example, when you connect customer databases and run pipelines).

Contact: **privacy@pulsedata.io**

## 2. Pulse Cloud vs self-hosted

| Topic | Pulse Cloud | Self-hosted |
|-------|-------------|-------------|
| **Who operates infrastructure** | Pulse | Your organization |
| **Account & billing data** | We are typically the controller | We process license and support data; you control deployment access |
| **Pipeline & warehouse data** | Processed in our hosted environment per your configuration | Stays in your network; you are typically the controller |
| **Connection credentials** | Encrypted at rest in our environment | Encrypted at rest in your deployment |

If you deploy self-hosted Pulse in your VPC, your organization determines purposes and means of processing for data inside your environment. This policy still applies to personal data we collect directly from you (for example, when you purchase a license or contact support).

## 3. Personal data we collect

Depending on your use of the Services, we may collect:

**Account and profile data** — Name, email address, organization name, role, avatar, and authentication identifiers (including OAuth subject IDs if you sign in with Google).

**Authentication and security data** — Password hashes (never stored in plain text), session tokens, API key metadata, login timestamps, and IP addresses in security logs.

**Billing data** — Subscription plan, payment references, and transaction status from our payment processor (we do not store full payment card numbers).

**Usage and product data** — Feature usage, pipeline run metadata, error logs, and performance metrics needed to operate and improve the Services.

**Connection metadata** — Names and types of data sources, hostnames, and encrypted credentials you provide. We do not need to retain raw warehouse row content beyond what your configuration requires to deliver features.

**Support communications** — Messages you send to us and related troubleshooting information.

**Website data** — Cookies and similar technologies for session management and security on the dashboard and marketing site (see Section 12).

## 4. How we use personal data

We use personal data to:

- Provide, authenticate, and secure the Services.
- Process subscriptions, licenses, and invoices.
- Run AI pipelines, Studio, and recommendations you configure.
- Send transactional email (verification, password reset, alerts you enable).
- Monitor abuse, debug incidents, and improve reliability.
- Comply with legal obligations and enforce our [Terms of Service](/terms).

**Legal bases (where GDPR applies):** contract performance, legitimate interests (security, product improvement), consent where required (for example, optional marketing), and legal obligation.

## 5. Customer database credentials

When you add a data source, you provide credentials so Pulse can connect on your behalf. Credentials are **encrypted at rest** using industry-standard symmetric encryption (Fernet). We use them only to perform connection tests, scheduled pipelines, Studio queries, and related features you enable.

We strongly recommend **read-only** database users where your systems support it. See [Supported data sources](/docs/data-sources) and [Security recommendations](/docs/data-sources#security-recommendations).

## 6. AI and large language models

Pulse may send prompts, schema snippets, sample rows, or query context to LLM providers you configure (such as **Anthropic** or **Groq**) to power the AI pipeline and Studio natural-language features.

On **self-hosted** deployments, you may use **Ollama** or other local models so that AI processing does not leave your network. See [Self-hosted hosting](/docs/hosting/self-hosted#data-privacy).

We configure providers for API use only and do not authorize them to use your data to train public models for unrelated products, subject to their own terms.

## 7. How we share personal data

We do not sell personal data. We may share data with:

- **Infrastructure and hosting providers** that operate Pulse Cloud.
- **Payment processors** to complete transactions.
- **Email delivery providers** for transactional messages.
- **LLM and OAuth providers** you connect or authenticate with.
- **Professional advisers** under confidentiality obligations.
- **Authorities** when required by law or to protect rights and safety.

We require subprocessors that handle personal data to provide appropriate safeguards by contract.

## 8. International transfers

If you are in Nigeria, the EEA, the UK, or other regions with transfer rules, your data may be processed in countries where we or our subprocessors operate. We use appropriate safeguards such as standard contractual clauses or equivalent mechanisms where required.

## 9. Retention

We retain personal data only as long as needed for the purposes above, including:

- **Account data** — For the life of your account and a reasonable period after closure for backups and legal compliance.
- **Logs** — For a limited period aligned with security and debugging needs.
- **Billing records** — As required by tax and accounting law.

You may request deletion subject to exceptions (for example, ongoing disputes or legal holds).

## 10. Security

We implement technical and organizational measures described on our [Security](/security) page, including encryption in transit, encrypted storage of connection secrets, access controls, and audit logging in the product.

No method of transmission or storage is 100% secure. You are responsible for securing self-hosted deployments, API keys, and credentials to your Connected Systems.

## 11. Your rights

Depending on your location, you may have the right to:

- Access a copy of your personal data.
- Rectify inaccurate data.
- Erase data in certain circumstances.
- Restrict or object to processing.
- Data portability where applicable.
- Withdraw consent where processing is consent-based.
- Lodge a complaint with a supervisory authority (for example, the Nigeria Data Protection Commission).

To exercise rights, email **privacy@pulsedata.io**. We may verify your identity before responding.

## 12. Cookies and similar technologies

We use essential cookies and local storage for dashboard authentication and session continuity. We do not use third-party advertising cookies on the product.

You can control browser cookies through your device settings; disabling essential cookies may prevent sign-in.

## 13. Children

The Services are not directed to children under 18. We do not knowingly collect personal data from children. Contact us if you believe we have collected such data.

## 14. Changes to this policy

We may update this Privacy Policy from time to time. We will post the revised version with an updated date and provide additional notice for material changes where required.

## 15. Contact

Privacy inquiries and data subject requests: **privacy@pulsedata.io**

Security issues: **security@pulsedata.io** (see [Security](/security))
