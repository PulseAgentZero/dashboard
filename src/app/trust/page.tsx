import type { Metadata } from "next";
import { TrustCenterPage } from "@/components/legal/trust-center-page";

export const metadata: Metadata = {
  title: "Trust Center | Entivia",
  description:
    "Security, privacy, terms, and documentation for Entivia Cloud and self-hosted deployments.",
};

export default function TrustPage() {
  return <TrustCenterPage />;
}
