import { Suspense } from "react";
import { LicensePortalCallbackContent } from "@/components/landing/license-portal-callback";

export const metadata = {
  title: "Signing in to your license portal · Entivia",
};

export default function SelfHostedLicensePortalCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-screen place-items-center bg-black text-zinc-400">
          Signing you in…
        </div>
      }
    >
      <LicensePortalCallbackContent />
    </Suspense>
  );
}
