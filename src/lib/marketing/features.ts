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

/** Customer-facing outcomes — not dashboard screen names */
export const MARKETING_CAPABILITIES: MarketingCapability[] = [
  {
    id: "risk-scoring",
    title: "Live risk scoring on every entity",
    description:
      "Entivia profiles customers, patients, accounts, or any unit you care about—then scores risk from signals already in your database.",
    highlights: [
      "Industry-agnostic: describe your business in plain English",
      "High, medium, low, and healthy tiers out of the box",
      "Trends and segments without a data science team",
    ],
    icon: ChartNoAxesCombined,
  },
  {
    id: "recommendations",
    title: "Recommendations you can act on today",
    description:
      "Stop staring at dashboards. Entivia surfaces prioritized interventions—retention offers, reallocations, follow-ups—grounded in real behavior.",
    highlights: [
      "Critical items ranked first",
      "Draft messages and operational next steps",
      "Close the loop when an action is taken",
    ],
    icon: Target,
  },
  {
    id: "agent",
    title: "Ask your data in plain English",
    description:
      "No SQL required. Operators and managers ask questions; Entivia translates them into live queries against your connected sources.",
    highlights: [
      "Grounded answers from your schema—not generic AI",
      "Explore risk, cohorts, and outliers in conversation",
      "Business context keeps answers relevant to your domain",
    ],
    icon: Bot,
  },
  {
    id: "connectors",
    title: "Connect where your data already lives",
    description:
      "Postgres, Snowflake, BigQuery, spreadsheets, S3, and more. Credentials stay encrypted; read-only access is recommended by default.",
    highlights: [
      "15+ connectors with guided setup",
      "Your data never needs to leave your environment on self-hosted",
      "Minutes to first insight, not months of pipeline work",
    ],
    icon: Cable,
  },
  {
    id: "automation",
    title: "Runs on your schedule—or on demand",
    description:
      "An autonomous pipeline profiles entities, refreshes scores, and generates recommendations automatically. Trigger a run anytime you need a fresh pass.",
    highlights: [
      "Scheduled or one-click runs",
      "Always working from live source data",
      "No manual ETL or feature store to maintain",
    ],
    icon: Zap,
  },
  {
    id: "studio",
    title: "Self-serve analytics when you need charts",
    description:
      "Power users can write SQL, build visualizations, and publish dashboards—or share embed links—without spinning up a separate BI stack.",
    highlights: [
      "Query warehouses, databases, and uploaded files",
      "Dashboards and public share links",
      "Complements automated intelligence, doesn’t replace it",
    ],
    icon: BarChart3,
  },
  {
    id: "alerts",
    title: "Alerts when risk moves",
    description:
      "Set thresholds on the metrics that matter. When risk spikes or a segment deteriorates, your team hears about it—and webhooks can notify your stack.",
    highlights: [
      "Rules on scores and key signals",
      "Email-style delivery plus outbound webhooks",
      "Fewer surprises in weekly reviews",
    ],
    icon: Bell,
  },
  {
    id: "sovereignty",
    title: "Built for teams that can’t ship data out",
    description:
      "Run Entivia Cloud for speed, or deploy entirely in your VPC with Docker. Self-hosted teams bring their own models and keep pipeline traffic internal.",
    highlights: [
      "Read-only database users supported",
      "Self-hosted with optional Pro license",
      "Public API and webhooks for your existing tools",
    ],
    icon: Shield,
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Tell Entivia your business",
    description:
      "A short description of what you sell, who you serve, and what “at risk” means—so models stay on-domain.",
  },
  {
    step: "02",
    title: "Connect live data",
    description:
      "Point at the warehouse or database you already use. No bulk export, no duplicate lake required.",
  },
  {
    step: "03",
    title: "Entivia profiles and scores",
    description:
      "The pipeline reads your schema, identifies entities, and produces risk scores and recommendations.",
  },
  {
    step: "04",
    title: "Your team decides faster",
    description:
      "Operators act on recommendations, ask the agent follow-ups, and alert the systems that need to know.",
  },
] as const;

/** For API / enterprise callouts in a compact strip */
export const INTEGRATION_HIGHLIGHTS = [
  {
    title: "Public API",
    description: "Entities, recommendations, analytics, and pipeline triggers with scoped API keys.",
    icon: Key,
    href: "/docs/api/overview",
  },
] as const;
