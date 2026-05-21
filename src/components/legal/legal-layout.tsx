import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { LegalMarkdown } from "./legal-markdown";

type Props = {
  content: string;
  lastUpdated: string | null;
};

export function LegalLayout({ content, lastUpdated }: Props) {
  return (
    <div className="marketing-dark min-h-screen bg-[var(--mk-bg)] text-[var(--mk-text)]">
      <Navbar />
      <main
        data-navbar-theme="dark"
        className="mx-auto max-w-3xl px-6 pb-20 pt-28 sm:px-8"
      >
        {lastUpdated && (
          <p className="mb-6 text-xs uppercase tracking-widest text-[var(--mk-text-faint)]">
            Last updated {lastUpdated}
          </p>
        )}
        <LegalMarkdown content={content} />
      </main>
      <Footer />
    </div>
  );
}
