# Entivia Dashboard

The official web dashboard for **[Entivia](https://entivia.online)** — a real‑time behavioral intelligence platform that connects to your existing database, runs an autonomous multi‑agent AI pipeline against it, and surfaces explainable next‑best‑action recommendations through a conversational interface.

This repository contains only the frontend. The backend lives at [`PulseAgentZero/api`](https://github.com/PulseAgentZero/api).

| | |
|---|---|
| **Framework** | Next.js 16 (App Router) · React 19 · TypeScript 5 |
| **Styling** | Tailwind CSS v4 · custom design system |
| **State / Data** | TanStack Query · Redux Toolkit · Zod |
| **Realtime** | Server‑Sent Events for streaming agent reasoning |
| **Charts / Editors** | Recharts · React Grid Layout · Monaco · Mermaid |
| **Tour / UX** | Driver.js · Framer Motion |
| **Build target** | Docker (multi‑arch) or `next start` (Node 20+) |

---

## Table of contents

1. [Architecture overview](#architecture-overview)
2. [Project structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Local development](#local-development)
5. [Environment variables](#environment-variables)
6. [npm scripts](#npm-scripts)
7. [Docker](#docker)
8. [Deployment](#deployment)
9. [Code conventions](#code-conventions)
10. [Troubleshooting](#troubleshooting)

---

## Architecture overview

The dashboard is a single Next.js application that serves three audiences from one codebase:

- **Marketing** (`/`, `/products`, `/pricing`, `/contact`, …) — public landing pages.
- **Authenticated app** (`/dashboard/**`) — the actual product surface (entities, recommendations, analytics, studio, agent / Co‑Pilot, connections, pipeline, settings).
- **Documentation** (`/docs/**`) — embedded product docs.

Every authenticated request is proxied through the Entivia API at `NEXT_PUBLIC_API_URL`. JWTs are stored on the client and rotated via the API’s refresh‑token endpoints. There is no Next.js server route that touches the database directly; the dashboard is a pure presentation layer.

Two deployment modes are supported and selected at **build time** via `NEXT_PUBLIC_DEPLOYMENT_MODE`:

- `cloud` — hosted Entivia. Hides on‑prem settings (LLM keys, license activation, log streaming destinations).
- `self_hosted` — bundled into the all‑in‑one [`chideraozigbo488/entivia`](https://hub.docker.com/r/chideraozigbo488/entivia) image. Shows every admin tab.

---

## Project structure

```
dashboard/
├── src/
│   ├── app/                     # Next.js App Router routes
│   │   ├── auth/                # Login, signup, verify, OAuth, SSO callbacks
│   │   ├── dashboard/           # Authenticated product (entities, recs, agent, …)
│   │   ├── docs/                # Embedded product documentation
│   │   ├── pricing/             # Cloud + self-hosted pricing flows
│   │   ├── solutions/           # Marketing pages
│   │   └── layout.tsx           # Root providers, fonts, error boundaries
│   │
│   ├── components/
│   │   ├── agent/               # Conversational Co-Pilot chat surface
│   │   ├── analytics/           # Charts, dashboards, KPI grids
│   │   ├── connections/         # Data source onboarding wizard
│   │   ├── landing/             # Marketing-page sections
│   │   ├── studio/              # SQL editor + dashboard builder
│   │   ├── tour/                # Driver.js first-run product tour
│   │   ├── ui/                  # Primitives (buttons, modals, forms, toasts)
│   │   └── …
│   │
│   ├── hooks/                   # TanStack Query hooks per domain
│   ├── layout/                  # Shell layout (sidebar, topbar, breadcrumbs)
│   ├── lib/                     # API client, validation, helpers, plans
│   ├── providers/               # React context providers (auth, query, theme)
│   ├── proxy.ts                 # Single typed fetch wrapper around the API
│   └── types/                   # Shared TypeScript types
│
├── public/                      # Static assets (icons, OG images, connectors)
├── content/                     # MDX-style content for /docs
├── Dockerfile                   # Standalone Next.js build → Node 20 runtime
├── docker-compose.yml           # Standalone frontend compose (points at any API)
├── next.config.ts               # Standalone output, image domains, redirects
└── .env.example                 # Reference environment file
```

---

## Prerequisites

- **Node.js ≥ 20.0** (the Docker runtime uses `node:20-alpine`; matching locally avoids native‑module surprises)
- **npm ≥ 10** (npm is the source of truth — `package-lock.json` is committed; `pnpm-lock.yaml` is `.dockerignore`d to keep the image build deterministic)
- A running **Entivia API** to talk to. Either:
  - Start one locally from [`PulseAgentZero/api`](https://github.com/PulseAgentZero/api) — see the API repo’s README, or
  - Point at an existing environment by setting `NEXT_PUBLIC_API_URL`.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — at minimum set NEXT_PUBLIC_API_URL to your API origin
# (default: http://localhost:8000 if you're running the API on its default port)

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>. The page hot‑reloads on save.

Pair this with the API’s `FRONTEND_URL` env var — set it to `http://localhost:3000` so CORS, auth email links, and OAuth redirects resolve correctly during development.

---

## Environment variables

All client‑side variables must be prefixed with `NEXT_PUBLIC_` and are **baked into the JavaScript bundle at build time**. Changing any of them in production requires a rebuild.

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `NEXT_PUBLIC_API_URL` | yes | `http://localhost:8000` | Origin of the Entivia API. **No trailing slash.** |
| `NEXT_PUBLIC_DEPLOYMENT_MODE` | yes | `cloud` | `cloud` hides self‑hosted‑only tabs; `self_hosted` shows them |
| `NEXT_PUBLIC_PRO_PRICE_DISPLAY` | no | `₦40,000/month` | Display price shown on cloud pricing copy |
| `NEXT_PUBLIC_APP_URL` | no | _(empty)_ | Absolute origin of the app, used when the docs site is on a different subdomain so cross‑origin links don’t get rewritten |
| `NEXT_PUBLIC_MARKETING_URL` | no | _(empty)_ | Same idea, for marketing links from `/docs/**` |
| `NEXT_BUILD_STANDALONE` | build only | _(unset)_ | Set to `1` to enable Next.js standalone output (the Docker build sets this automatically) |
| `NEXT_TELEMETRY_DISABLED` | no | `1` (in Docker) | Disables Next.js anonymous telemetry |

A reference template lives in [`.env.example`](.env.example) — copy it to `.env.local` for local dev, or pass values as build args / env vars in Docker.

---

## npm scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js dev server with Fast Refresh on `http://localhost:3000` |
| `npm run build` | Production build. With `NEXT_BUILD_STANDALONE=1`, emits `.next/standalone` for Docker |
| `npm run start` | Serve the built app (`next start`) — used by the Docker runtime |
| `npm run lint` | Run ESLint with `eslint-config-next` |

> Type‑checking runs as part of `npm run build`. To check types without producing a build, run `npx tsc --noEmit`.

---

## Docker

The dashboard ships as a small, standalone Node image — the second stage contains only `server.js`, the compiled `.next` output, and `public/`.

### Build locally (single arch)

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 \
  --build-arg NEXT_PUBLIC_DEPLOYMENT_MODE=cloud \
  -t entivia-dashboard:dev .

docker run --rm -p 3000:3000 entivia-dashboard:dev
```

### Compose (frontend only, points at any running API)

```bash
cp .env.example .env
# Set NEXT_PUBLIC_API_URL to your API
docker compose up --build
```

This brings up only the frontend on `http://localhost:3096` and joins the existing `reverse-proxy_nginx-network` so it can be fronted by the same nginx that proxies the API.

### Multi‑arch publish

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --build-arg NEXT_PUBLIC_API_URL=https://api.entivia.online \
  --build-arg NEXT_PUBLIC_DEPLOYMENT_MODE=cloud \
  --push \
  -t chideraozigbo488/entivia-frontend:latest \
  .
```

> **`NEXT_PUBLIC_*` values are frozen at build time** — every distinct API origin needs its own image tag (or build).

### Self‑hosted bundle

For the all‑in‑one self‑hosted image at [`chideraozigbo488/entivia`](https://hub.docker.com/r/chideraozigbo488/entivia), this dashboard is consumed as a build context (`--build-context frontend=../dashboard`) by the API repo’s `docker/images/pulse/Dockerfile`. You don’t build the dashboard image separately for self‑hosted; just push your changes and rebuild the bundle from the API repo.

---

## Deployment

| Target | How |
|---|---|
| **Vercel / Netlify** | Standard Next.js App Router app — set every `NEXT_PUBLIC_*` var in the dashboard, then deploy. No standalone output flag needed. |
| **Docker** (compose, ECS, Cloud Run, Fly, Railway) | Use the included `Dockerfile`. Bake `NEXT_PUBLIC_*` values via `--build-arg`. |
| **Bundled in the self‑hosted image** | Already wired — see [`chideraozigbo488/entivia` on Docker Hub](https://hub.docker.com/r/chideraozigbo488/entivia). |

In all cases the API’s `FRONTEND_URL` env var must match the dashboard’s public origin (CORS + auth email links).

---

## Code conventions

- **Routing** — App Router only. New pages go under `src/app/**`. Co‑locate `loading.tsx`, `error.tsx`, and `layout.tsx` next to their routes.
- **Data fetching** — every API call goes through `src/proxy.ts`, then through a typed wrapper in `src/lib/api/`, then through a TanStack Query hook in `src/hooks/<domain>/`. Components don’t talk to `fetch` directly.
- **State** — server state via TanStack Query, local UI state via React state, cross‑page UI state (sidebar, theme) via Redux Toolkit. No new Redux slices unless the state is genuinely cross‑cutting.
- **Styling** — Tailwind v4 utility classes. Reuse primitives from `src/components/ui/` instead of re‑creating buttons/inputs.
- **Validation** — Zod schemas live in `src/lib/validation`. Forms use the shared `useFormValidation` hook.
- **Types** — domain types in `src/types/`. Avoid `any`; if you genuinely need it, add a `// eslint-disable-next-line` with a one‑line reason.

Run `npm run lint` before opening a PR. Type errors fail the Docker build, so they’re effectively a hard CI gate.

---

## Troubleshooting

**The dashboard loads but every API call returns CORS errors.**
The API’s `FRONTEND_URL` doesn’t match the origin you’re visiting. Update it to match exactly (scheme + host + port).

**OAuth / verify / reset email links go to the wrong host.**
Same root cause — `FRONTEND_URL` on the API drives every templated link.

**`NEXT_PUBLIC_*` change doesn’t take effect after redeploy.**
`NEXT_PUBLIC_*` values are inlined into the static JS bundle at **build time**, not runtime. You must rebuild and redeploy the image after changing one.

**Docker build fails with a TypeScript error.**
The Next.js build does a full type‑check. Reproduce locally with `npx tsc --noEmit`, fix, rebuild.

**`pnpm` install conflicts with the locked `npm` graph.**
Use `npm install`. `pnpm-lock.yaml` is intentionally `.dockerignore`d so the image build never sees it.

**Charts / Recharts render blank in production.**
Recharts requires `transpilePackages` in `next.config.ts` — already configured. If you fork and remove it, charts will silently render nothing.

---

## License

Proprietary © Entivia. See [`LICENSE`](LICENSE) for details. The Entivia software is sold under a one‑time self‑hosted license or a hosted cloud subscription — see <https://entivia.online/pricing>.

---

## Support

- Product, pricing, docs: <https://entivia.online>
- Backend repo: <https://github.com/PulseAgentZero/api>
- Self‑hosted Docker image: <https://hub.docker.com/r/chideraozigbo488/entivia>
- Email: <support@entivia.online>
