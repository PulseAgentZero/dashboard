import { WebhooksPage } from "@/components/webhooks/webhooks-page";
import { RequireRole } from "@/components/auth/require-role";

export default function Page() {
  return (
    <RequireRole minRole="admin">
      <WebhooksPage />
    </RequireRole>
  );
}
