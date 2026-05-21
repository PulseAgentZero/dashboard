import { Suspense } from "react";
import { AcceptInviteContent } from "./accept-invite-content";

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  );
}
