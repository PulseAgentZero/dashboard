import { Suspense } from "react";
import { PricingCloudPage } from "@/components/landing/pricing-cloud-page";

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
          Loading…
        </div>
      }
    >
      <PricingCloudPage />
    </Suspense>
  );
}
