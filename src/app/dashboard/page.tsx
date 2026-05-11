import { AgentPanel } from "@/components/dashboard/agent-panel";
import { ConnectionStatusCard } from "@/components/dashboard/connection-status-card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EntityExplorerPreview } from "@/components/dashboard/entity-explorer-preview";
import { IntegrationChecklist } from "@/components/dashboard/integration-checklist";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";
import { SegmentOverview } from "@/components/dashboard/segment-overview";
import { TrendsPanel } from "@/components/dashboard/trends-panel";

export default function DashboardPage() {
  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="min-w-0 space-y-6">
        <DashboardHeader />
        <MetricsGrid />

        <div className="grid gap-6 2xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
          <TrendsPanel />
          <SegmentOverview />
        </div>

        <EntityExplorerPreview />
      </section>

      <aside className="min-w-0 space-y-6">
        <AgentPanel />
        <ConnectionStatusCard />
        <RecommendationsPanel />
        <IntegrationChecklist />
      </aside>
    </div>
  );
}
