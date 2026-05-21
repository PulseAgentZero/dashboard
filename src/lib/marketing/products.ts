import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Bot,
  Cable,
  ChartNoAxesCombined,
  Target,
} from "lucide-react";

export type PlatformProduct = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
};

export const PLATFORM_PRODUCTS: PlatformProduct[] = [
  {
    id: "risk-scoring",
    title: "Risk Scoring Engine",
    subtitle: "Every entity, scored every run",
    description:
      "Entivia profiles each customer, patient, SKU, or route from signals already in your database—then labels them high, medium, low, or healthy.",
    highlights: [
      "Works for any industry you describe in plain English",
      "Scores refresh on a schedule or when you click run",
      "No data science team required",
    ],
    icon: ChartNoAxesCombined,
  },
  {
    id: "recommendations",
    title: "Recommendation Agent",
    subtitle: "Ranked, ready-to-act next steps",
    description:
      "Stop staring at charts. Entivia surfaces what to do next—retention offers, stock reorders, staff moves—ranked by urgency.",
    highlights: [
      "Critical items first",
      "Draft messages and operational steps",
      "Mark done when your team acts",
    ],
    icon: Target,
  },
  {
    id: "ask-anything",
    title: "Ask Anything",
    subtitle: "Plain-English chat over your live data",
    description:
      "Operators ask questions in normal language. Entivia runs real queries against your connected database—answers are never made up.",
    highlights: [
      "Grounded in your schema and business context",
      "Explore risk, cohorts, and outliers in conversation",
      "No SQL required for day-to-day questions",
    ],
    icon: Bot,
  },
  {
    id: "connectors",
    title: "Live Connectors",
    subtitle: "Postgres, MySQL, MSSQL, SQLite, files",
    description:
      "Point at the database or warehouse you already use. Credentials stay encrypted. Read-only access is recommended.",
    highlights: [
      "Guided setup in minutes",
      "Data stays in your environment on self-hosted",
      "No bulk export or duplicate data lake",
    ],
    icon: Cable,
  },
  {
    id: "studio",
    title: "Studio Analytics",
    subtitle: "SQL, charts, and share links when you need them",
    description:
      "Power users can query, visualize, and publish dashboards—or embed links—without buying another BI tool.",
    highlights: [
      "Write SQL against connected sources",
      "Dashboards and public share links",
      "Complements automated intelligence",
    ],
    icon: BarChart3,
  },
  {
    id: "alerts",
    title: "Alerts & Webhooks",
    subtitle: "Slack, email, or your stack when risk moves",
    description:
      "Set rules on the scores and signals that matter. When something spikes, your team hears about it immediately.",
    highlights: [
      "Threshold rules on risk tiers",
      "In-app and email delivery",
      "Webhooks to Slack, CRM, or internal tools",
    ],
    icon: Bell,
  },
];

export const FEATURES_PAGE_SECTIONS = [
  { id: "why", label: "Why Entivia" },
  { id: "how", label: "How it works" },
  { id: "what", label: "What you get" },
  { id: "connect", label: "Connect anywhere" },
  { id: "hosting", label: "Cloud & self-hosted" },
] as const;
