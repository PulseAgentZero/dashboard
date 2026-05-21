import { ConnectionsPage } from "@/components/connections/connections-page";
import { RequireRole } from "@/components/auth/require-role";

export default function Page() {
  return (
    <RequireRole minRole="manager">
      <ConnectionsPage />
    </RequireRole>
  );
}
