export type IndustrySolution = {
  id: string;
  name: string;
  tagline: string;
  pain: string;
  entitiesScored: string;
  signals: string[];
  sampleAction: {
    entity: string;
    urgency: "critical" | "high" | "medium";
    title: string;
    detail: string;
  };
  keyOutcomes: string[];
};

export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    id: "telecom",
    name: "Telecom",
    tagline: "Stop losing customers before they leave.",
    pain:
      "You see churn in reports weeks later. By then, the customer is already gone.",
    entitiesScored: "Subscribers",
    signals: [
      "Usage drops and missed payments",
      "Support tickets and plan downgrades",
      "Days since last recharge or bundle purchase",
    ],
    sampleAction: {
      entity: "Amina Bello · +234 803 *** 4121",
      urgency: "critical",
      title: "Offer 7-day data bundle",
      detail:
        "Usage down 62% in 14 days. Similar subscribers accepted this offer 71% of the time.",
    },
    keyOutcomes: ["Spot churn early", "Retention offers that fit", "Less coupon waste"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    tagline: "See which wards need help, before the queue forms.",
    pain:
      "Bed and staff decisions rely on gut feel and yesterday's spreadsheets—not live patient flow.",
    entitiesScored: "Wards & patients",
    signals: [
      "Admissions, discharges, and length of stay",
      "Bed occupancy and nurse-to-patient ratios",
      "Readmission and escalation patterns",
    ],
    sampleAction: {
      entity: "Lagos Ward B · 94% occupancy",
      urgency: "high",
      title: "Reallocate 2 nurses from Ward C",
      detail:
        "Occupancy trending up 18% this week. Ward C has spare capacity through Friday.",
    },
    keyOutcomes: ["Live ward pressure", "Smarter staffing", "Fewer bottlenecks"],
  },
  {
    id: "fmcg-retail",
    name: "FMCG & Retail",
    tagline: "Know which products will run out, by store.",
    pain:
      "Stockouts show up when shelves are empty—not when you can still reorder in time.",
    entitiesScored: "SKUs & stores",
    signals: [
      "Sell-through rate by location",
      "Days of cover and reorder lead times",
      "Promo spikes and seasonal demand",
    ],
    sampleAction: {
      entity: "SKU-8842 · Ikeja Store 12",
      urgency: "critical",
      title: "Reorder 240 units today",
      detail:
        "On track to stock out in 3 days at current velocity. Supplier lead time is 2 days.",
    },
    keyOutcomes: ["Fewer empty shelves", "Right stock per store", "Less dead inventory"],
  },
  {
    id: "logistics",
    name: "Logistics",
    tagline: "Spot delays and bad routes before they cost you.",
    pain:
      "Drivers and routes look fine on paper until a client calls about a late delivery.",
    entitiesScored: "Routes & drivers",
    signals: [
      "On-time delivery rate and idle time",
      "Fuel use and distance vs. plan",
      "Repeat delay patterns by corridor",
    ],
    sampleAction: {
      entity: "Route LAG-ABJ-04 · Driver Musa K.",
      urgency: "high",
      title: "Reroute via alternate hub",
      detail:
        "3 late deliveries this week on same corridor. Alternate route saves ~45 min avg.",
    },
    keyOutcomes: ["Delay risk upfront", "Better route choices", "Happier clients"],
  },
  {
    id: "public-sector",
    name: "Public sector",
    tagline: "Understand how citizens use your services.",
    pain:
      "Demand spikes surprise teams because usage patterns sit in siloed systems nobody queries daily.",
    entitiesScored: "Service points & regions",
    signals: [
      "Application volume and wait times",
      "Regional demand vs. staff capacity",
      "Repeat visits and drop-off points",
    ],
    sampleAction: {
      entity: "North Central · ID registration",
      urgency: "medium",
      title: "Add weekend desk hours",
      detail:
        "Queue times up 34% month-on-month. Weekend slots clear 40% of backlog in pilot regions.",
    },
    keyOutcomes: ["See demand early", "Fair resource spread", "Shorter wait times"],
  },
];
