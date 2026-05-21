import { ApiKeysPage } from "@/components/api-keys/api-keys-page";
import { RequireRole } from "@/components/auth/require-role";

export default function Page() {
  return (
    <RequireRole minRole="manager">
      <ApiKeysPage />
    </RequireRole>
  );
}
