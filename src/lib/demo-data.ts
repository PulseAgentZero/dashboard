export const metrics = [
  {
    label: "Entities modeled",
    value: "42,918",
    delta: "+12.4%",
    detail: "Across telecom, health, retail, and logistics datasets",
    trend: "up",
  },
  {
    label: "High-risk entities",
    value: "1,284",
    delta: "-8.1%",
    detail: "312 require action before close of business",
    trend: "down",
  },
  {
    label: "Open recommendations",
    value: "486",
    delta: "+31",
    detail: "Ranked by urgency, impact, and confidence",
    trend: "up",
  },
  {
    label: "Agent-grounded answers",
    value: "94%",
    delta: "+3.2%",
    detail: "Responses backed by tool calls and mapped schema",
    trend: "up",
  },
];

export const entities = [
  {
    id: "SUB-00445",
    name: "Amina Bello",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
    segment: "Telecom retention",
    industry: "Telecom",
    risk: "High",
    score: 91,
    signal: "Usage dropped 43% in 14 days",
    action: "Offer 7-day data bundle",
    lastSeen: "12 min ago",
    completeness: 96,
    owner: "Retention team",
  },
  {
    id: "WARD-12",
    name: "Lagos Care Ward B",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=160&q=80",
    segment: "Hospital flow",
    industry: "Healthcare",
    risk: "High",
    score: 86,
    signal: "Capacity at 92%",
    action: "Reallocate 3 night-shift nurses",
    lastSeen: "19 min ago",
    completeness: 88,
    owner: "Hospital ops",
  },
  {
    id: "SKU-8821",
    name: "Golden Maize 5kg",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=160&q=80",
    segment: "Retail inventory",
    industry: "Retail",
    risk: "Medium",
    score: 64,
    signal: "Stock cover below 4 days",
    action: "Trigger restock to Ikeja hub",
    lastSeen: "41 min ago",
    completeness: 81,
    owner: "Supply chain",
  },
  {
    id: "DRV-203",
    name: "Route EKY-18",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=160&q=80",
    segment: "Logistics routes",
    industry: "Logistics",
    risk: "Medium",
    score: 58,
    signal: "Delay rate up 18%",
    action: "Move delivery window by 45 min",
    lastSeen: "1 hr ago",
    completeness: 74,
    owner: "Fleet ops",
  },
];

export const recommendations = [
  {
    title: "Prioritize retention outreach",
    entity: "SUB-00445",
    urgency: "Critical",
    owner: "Retention team",
    confidence: "96%",
    status: "Unassigned",
    impact: "High churn reduction",
    reason:
      "Recharge frequency and session length both declined below the configured retention threshold.",
  },
  {
    title: "Shift bed allocation",
    entity: "WARD-12",
    urgency: "High",
    owner: "Hospital ops",
    confidence: "89%",
    status: "Escalated",
    impact: "Capacity relief",
    reason:
      "Admissions trend is rising while available staff hours are falling for the evening period.",
  },
  {
    title: "Restock fast-moving SKU",
    entity: "SKU-8821",
    urgency: "Medium",
    owner: "Supply chain",
    confidence: "82%",
    status: "In review",
    impact: "Stockout prevention",
    reason:
      "Demand velocity is 1.7x the regional baseline and stock cover is projected to fail by Friday.",
  },
];

export const entitySummary = [
  { label: "Total entities", value: "42,918", detail: "Across mapped tables" },
  { label: "High risk", value: "1,284", detail: "312 need action today" },
  { label: "Avg completeness", value: "87%", detail: "Mapped profile coverage" },
  { label: "Active segments", value: "4", detail: "Industry-agnostic views" },
];

export const recommendationSummary = [
  { label: "Open queue", value: "486", detail: "Ranked by urgency" },
  { label: "Critical", value: "47", detail: "Needs immediate action" },
  { label: "Actioned today", value: "128", detail: "Outcome tracking active" },
  { label: "Avg confidence", value: "89%", detail: "Recommendation quality" },
];

export const segments = [
  {
    name: "Telecom retention",
    entities: "12,840",
    risk: 72,
    change: "+9.8%",
    color: "bg-rose-500",
  },
  {
    name: "Hospital flow",
    entities: "6,215",
    risk: 49,
    change: "-3.1%",
    color: "bg-emerald-500",
  },
  {
    name: "Retail inventory",
    entities: "18,440",
    risk: 38,
    change: "+4.4%",
    color: "bg-amber-400",
  },
  {
    name: "Logistics routes",
    entities: "5,423",
    risk: 57,
    change: "+2.7%",
    color: "bg-indigo-500",
  },
];

export const trend = [38, 44, 41, 52, 56, 49, 63, 68, 65, 73, 81, 76];

export const agentMessages = [
  {
    from: "user",
    text: "Who needs attention first today?",
  },
  {
    from: "agent",
    text: "I found 312 high-risk entities. The top driver is telecom activity decline, followed by healthcare capacity pressure in Ward B.",
  },
  {
    from: "agent",
    text: "Recommended action: assign retention outreach to SUB-00445 and reallocate night-shift coverage before 6 PM.",
  },
];

export const onboardingSteps = [
  {
    title: "Business context",
    status: "Complete",
    description: "Goals, industry, key entities, and operational language.",
  },
  {
    title: "Data connection",
    status: "Complete",
    description: "Read-only PostgreSQL connection verified.",
  },
  {
    title: "Schema mapping",
    status: "Complete",
    description: "Entity table, display field, signals, and timestamp mapped.",
  },
  {
    title: "Live intelligence",
    status: "Running",
    description: "Risk scores, recommendations, trends, and agent tools active.",
  },
];

export const integrationTasks = [
  "Replace demo arrays with /api/risk-summary",
  "Wire entity explorer to /api/entities",
  "Send chat prompts to /api/agent/messages",
  "Persist recommendation actions to /api/recommendations/:id",
];
