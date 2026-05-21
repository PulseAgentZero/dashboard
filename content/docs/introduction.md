# Introduction

Entivia is a real-time intelligence platform that connects to your data, profiles customer behavior, scores risk, and surfaces actionable recommendations.

## How you can run Entivia

| | **Entivia Cloud** | **Self-hosted** |
|---|-----------------|-----------------|
| **What it is** | Hosted SaaS — we operate Entivia; your team signs in and works in our environment | You install and run Entivia on your own servers (VPC, on-prem, private cloud) |
| **Who operates it** | Entivia (infrastructure, updates, scaling) | Your organization |
| **Getting started** | [Sign up](/auth/signup), [connect a data source](/docs/data-sources), go | [Docker install](/docs/hosting/self-hosted) + optional license |
| **Billing** | [Pro subscription](/pricing) | Free tier or [license key](/pricing/self-hosted) for Pro |
| **Best for** | Teams that want zero ops and fast time-to-value | Regulated industries, air-gapped networks, full operational control |

> **Your data:** Entivia connects to **your** systems with credentials you provide. We recommend **read-only** database users where possible. On self-hosted, pipeline traffic stays inside your network. On Entivia Cloud, you connect from our hosted workspace to your data source.

## Supported data sources

Entivia supports SQL databases, cloud warehouses, spreadsheets, object storage, and file uploads. Add connections from **Data & pipeline → Connections** in the dashboard (or use **Connect Data** in the header).

See **[Supported data sources](/docs/data-sources)** for the full list, required credentials, and which features each connector supports.

## What Entivia includes

Entivia combines a **web dashboard** for analysts and admins with a **Public API** for integrations. The dashboard covers the full workflow: connect data, map entities, run an **AI pipeline** on a schedule or on demand, then explore **entities**, **recommendations**, and **analytics**. **Studio** adds SQL-based charts and dashboards with optional public or embed sharing. A conversational **Agent** answers questions in context, and **alerts** plus **webhooks** push signals to your stack.

For a walkthrough of every area in the app, see **[Product features](/docs/features)**.

## Where to go next

| If you… | Start here |
|---------|------------|
| Want to use Entivia as a customer (SaaS) | [Entivia Cloud](/docs/hosting/cloud) |
| Need to install Entivia on your infrastructure | [Self-hosted](/docs/hosting/self-hosted) |
| Want to understand dashboard capabilities | [Product features](/docs/features) |
| Need to connect Postgres, Snowflake, S3, etc. | [Supported data sources](/docs/data-sources) |
| Build against the REST API | [Public API overview](/docs/api/overview) |

## Documentation map

| Section | Description |
|---------|-------------|
| [Getting started](/docs/getting-started) | Entivia Cloud signup and first connection |
| [Product features](/docs/features) | Dashboard areas and core workflows |
| [Supported data sources](/docs/data-sources) | Connectors, credentials, feature support |
| [Architecture](/docs/architecture) | Product components and public API |
| [Entivia Cloud](/docs/hosting/cloud) | SaaS product — accounts, plans, connections |
| [Self-hosted](/docs/hosting/self-hosted) | Docker deployment in your environment |
| [Configuration](/docs/configuration/environment-variables) | Env vars (self-hosted operators) |
| [API reference](/docs/api/overview) | Public REST API |
