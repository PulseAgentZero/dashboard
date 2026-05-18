import type { Metadata } from "next";
import { TrustCenterPage } from "@/components/legal/trust-center-page";

export const metadata: Metadata = {
  title: "Trust Center | Pulse",
  description:
    "Security, privacy, terms, and documentation for Pulse Cloud and self-hosted deployments.",
};

export default function TrustPage() {
  return <TrustCenterPage />;
}
