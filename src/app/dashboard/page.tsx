import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { MetricsGrid } from "@/components/dashboard/metric-card";
import { RiskBreakdown } from "@/components/dashboard/risk-breakdown";
import { TrendsPanel } from "@/components/dashboard/trends-panel";
import { EntityExplorerPreview } from "@/components/dashboard/entity-explorer-preview";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";
import { PipelineStatusCard } from "@/components/dashboard/pipeline-status-card";
import { DashboardPageShell } from "@/components/layout/dashboard-page-shell";

export default function DashboardPage() {
  return (
    <DashboardPageShell className="space-y-5">
      <DashboardHeader />
      <MetricsGrid />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
        <RiskBreakdown />
        <TrendsPanel />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.8fr_1fr]">
        <EntityExplorerPreview />
        <RecommendationsPanel />
      </div>

      <PipelineStatusCard />
    </DashboardPageShell>
  );
}
