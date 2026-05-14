import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Footer from "@/components/landing/footer";
import TrustGrid from "@/components/landing/trust-grid";
import FeatureExplorer from "@/components/landing/feature-explorer";
import PhilosophyGrid from "@/components/landing/philosophy-grid";
import VerticalTimeline from "@/components/landing/vertical-timeline";
import TasteSection from "@/components/landing/taste-section";
import CommunitySection from "@/components/landing/community-section";
import FinalCTA from "@/components/landing/final-CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <TrustGrid />
        <FeatureExplorer />
        <PhilosophyGrid />
        <VerticalTimeline />
        <TasteSection />
        <CommunitySection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
