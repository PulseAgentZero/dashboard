import type { DriveStep } from "driver.js";

export function getTourSteps(): DriveStep[] {
  return [
    {
      element: "[data-tour='sidebar-nav']",
      popover: {
        title: "Your workspace",
        description:
          "Everything lives here — entities, recommendations, analytics, pipeline, and settings. You can collapse the sidebar anytime for more space.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='nav-dashboard']",
      popover: {
        title: "Home dashboard",
        description:
          "Your live overview: risk metrics, scoring trends, entity segments, and pipeline health — all in one place.",
        side: "right",
      },
    },
    {
      element: "[data-tour='nav-connections']",
      popover: {
        title: "Data connections",
        description:
          "Connect a database, data warehouse, CSV, or third-party source. Entivia reads your data and scores entities from it.",
        side: "right",
      },
    },
    {
      element: "[data-tour='connect-data']",
      popover: {
        title: "Add a data source",
        description:
          "Tap this anytime to plug in a new source. It's the first step — no data, no scoring.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='notifications-bell']",
      popover: {
        title: "Alerts & activity",
        description:
          "Pipeline completions, risk spikes, and recommendation updates surface here. You can also set custom alert rules under Alerts in the sidebar.",
        side: "bottom",
      },
    },
  ];
}
