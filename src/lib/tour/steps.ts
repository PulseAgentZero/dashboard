import type { DriveStep } from "driver.js";

export function getTourSteps(): DriveStep[] {
  return [
    {
      element: "[data-tour='sidebar-nav']",
      popover: {
        title: "Navigation",
        description:
          "Move between your dashboard, entities, recommendations, and data tools from the sidebar.",
        side: "right",
        align: "start",
      },
    },
    {
      element: "[data-tour='nav-dashboard']",
      popover: {
        title: "Dashboard",
        description: "Your home view for risk metrics, trends, and pipeline status.",
        side: "right",
      },
    },
    {
      element: "[data-tour='nav-connections']",
      popover: {
        title: "Connections",
        description: "Connect databases, warehouses, spreadsheets, and files as data sources.",
        side: "right",
      },
    },
    {
      element: "[data-tour='connect-data']",
      popover: {
        title: "Quick connect",
        description: "Use Connect Data anytime to add or manage sources from the header.",
        side: "bottom",
      },
    },
    {
      element: "[data-tour='notifications-bell']",
      popover: {
        title: "Notifications",
        description:
          "Pipeline runs, recommendations, and alerts appear here. Open the full inbox from the sidebar.",
        side: "bottom",
      },
    },
  ];
}
