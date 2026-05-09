export type RiskTier = "Critical" | "High" | "Medium" | "Low";

export type Entity = {
  id: string;
  name: string;
  image: string;
  segment: string;
  industry: string;
  risk: RiskTier;
  score: number;
  signal: string;
  action: string;
  lastSeen: string;
};

export type Recommendation = {
  title: string;
  entity: string;
  urgency: RiskTier;
  owner: string;
  confidence: string;
  reason: string;
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  detail: string;
  trend: "up" | "down";
};

export type Segment = {
  name: string;
  entities: string;
  risk: number;
  change: string;
  color: string;
};
