import { DashboardBuilderPage } from "@/components/studio/dashboard-builder-page";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <DashboardBuilderPage dashboardId={id} />;
}
