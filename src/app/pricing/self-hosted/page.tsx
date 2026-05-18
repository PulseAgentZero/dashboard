import { Suspense } from "react";
import { PricingSelfHostedPage } from "@/components/landing/pricing-self-hosted-page";

export default function SelfHostedPricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
          Loading…
        </div>
      }
    >
      <PricingSelfHostedPage />
    </Suspense>
  );
}
