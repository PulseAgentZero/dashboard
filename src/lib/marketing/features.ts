import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Bot,
  Cable,
  ChartNoAxesCombined,
  Key,
  Shield,
  Target,
  Zap,
} from "lucide-react";

export type MarketingCapability = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
};

/** Customer-facing outcomes — plain language */
export const MARKETING_CAPABILITIES: MarketingCapability[] = [
  {
    id: "risk-scoring",
    title: "Live risk scores on every entity",
    description:
      "We learn how each customer, patient, or SKU behaves—then label them high, medium, low, or healthy from signals already in your database.",
    highlights: [
      "Works for any business you describe in plain English",
      "High, medium, low, and healthy out of the box",
      "Trends and segments without a data science team",
    ],
    icon: ChartNoAxesCombined,
  },
  {
    id: "recommendations",
    title: "What to do next — ranked for your team",
    description:
      "Stop staring at dashboards. Entivia surfaces retention offers, reorders, and follow-ups grounded in real behavior.",
    highlights: [
      "Critical items first",
      "Draft messages and next steps",
      "Mark done when your team acts",
    ],
    icon: Target,
  },
  {
    id: "agent",
    title: "Ask your data in plain English",
    description:
      "No SQL required. Ask questions; Entivia runs live queries against your connected database—answers backed by your data, not made up.",
    highlights: [
      "Real answers from your schema",
      "Explore risk, cohorts, and outliers in chat",
      "Your business context keeps answers relevant",
    ],
    icon: Bot,
  },
  {
    id: "connectors",
    title: "Connect where your data already lives",
    description:
      "Postgres, MySQL, MSSQL, SQLite, and file uploads. Credentials stay encrypted. Read-only access is recommended.",
    highlights: [
      "Guided setup in minutes",
      "Data stays in your environment on self-hosted",
      "No bulk export or duplicate data lake",
    ],
    icon: Cable,
  },
  {
    id: "automation",
    title: "Runs on your schedule — or on demand",
    description:
      "An autonomous pipeline profiles entities, refreshes scores, and generates recommendations. Trigger a fresh run anytime.",
    highlights: [
      "Scheduled or one-click runs",
      "Always from live source data",
      "No manual ETL to maintain",
    ],
    icon: Zap,
  },
  {
    id: "studio",
    title: "Charts and SQL when you want them",
    description:
      "Power users can query, visualize, and share dashboards—or embed links—without another BI stack.",
    highlights: [
      "Query connected databases and files",
      "Dashboards and public share links",
      "Complements automated intelligence",
    ],
    icon: BarChart3,
  },
  {
    id: "alerts",
    title: "Alerts when risk moves",
    description:
      "Set rules on the scores that matter. When risk spikes, your team hears about it—and webhooks can notify your stack.",
    highlights: [
      "Rules on scores and key signals",
      "In-app and email delivery",
      "Webhooks to Slack, CRM, or internal tools",
    ],
    icon: Bell,
  },
  {
    id: "sovereignty",
    title: "Built for teams that can't ship data out",
    description:
      "Run Entivia Cloud for speed, or deploy in your VPC with Docker. Self-hosted keeps pipeline traffic internal.",
    highlights: [
      "Read-only database users supported",
      "Self-hosted with optional Pro license",
      "Public API and webhooks for your tools",
    ],
    icon: Shield,
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Tell us your business",
    description:
      "A short description of what you sell, who you serve, and what “at risk” means—so everything stays on-domain.",
  },
  {
    step: "02",
    title: "Connect live data",
    description:
      "Point at the database you already use. No bulk export. No duplicate lake.",
  },
  {
    step: "03",
    title: "We profile and score",
    description:
      "The pipeline reads your schema, finds entities, and produces risk scores and recommendations.",
  },
  {
    step: "04",
    title: "Your team acts faster",
    description:
      "Operators follow recommendations, ask the agent follow-ups, and alert the systems that need to know.",
  },
] as const;

export const INTEGRATION_HIGHLIGHTS = [
  {
    title: "Public API",
    description:
      "Entities, recommendations, analytics, and pipeline triggers with scoped API keys.",
    icon: Key,
    href: "/docs/api/overview",
  },
] as const;
