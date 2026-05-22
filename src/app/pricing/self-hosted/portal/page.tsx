import { LicensePortalPage } from "@/components/landing/license-portal-page";

export const metadata = {
  title: "License portal · Entivia",
  description:
    "Retrieve your self-hosted Entivia license keys. Email-only sign-in — no account required.",
};

export default function SelfHostedLicensePortalPage() {
  return <LicensePortalPage />;
}
