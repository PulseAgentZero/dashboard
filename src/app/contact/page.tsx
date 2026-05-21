import type { Metadata } from "next";
import { ContactPage } from "@/components/landing/contact-page";

export const metadata: Metadata = {
  title: "Contact | Entivia",
  description:
    "Talk to the Entivia team about demos, pilots, partnerships, or support — replies within one business day.",
};

export default function Page() {
  return <ContactPage />;
}
