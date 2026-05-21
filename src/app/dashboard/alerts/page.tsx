import { AlertsPage } from "@/components/alerts/alerts-page";
import { RequireRole } from "@/components/auth/require-role";

export default function Page() {
  return (
    <RequireRole minRole="manager">
      <AlertsPage />
    </RequireRole>
  );
}
