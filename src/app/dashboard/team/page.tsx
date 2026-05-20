import { TeamPage } from "@/components/team/team-page";
import { RequireRole } from "@/components/auth/require-role";

export default function Page() {
  return (
    <RequireRole minRole="manager">
      <TeamPage />
    </RequireRole>
  );
}
