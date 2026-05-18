import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import { LegalMarkdown } from "./legal-markdown";

type Props = {
  content: string;
  lastUpdated: string | null;
};

export function LegalLayout({ content, lastUpdated }: Props) {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-20 pt-28 sm:px-8">
        {lastUpdated && (
          <p className="mb-6 text-xs uppercase tracking-widest text-zinc-600">
            Last updated {lastUpdated}
          </p>
        )}
        <LegalMarkdown content={content} />
      </main>
      <Footer />
    </div>
  );
}
