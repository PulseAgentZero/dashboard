import { PlaygroundPage } from "@/components/playground/playground-page";
import { RequireRole } from "@/components/auth/require-role";

export default function Page() {
  return (
    <RequireRole minRole="manager">
      <PlaygroundPage />
    </RequireRole>
  );
}
