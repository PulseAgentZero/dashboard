import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
// import BentoSection from "@/components/landing/bento-section";
// import ModelingSection from "@/components/landing/taste-section";
// import HowItWorksSection from "@/components/landing/how-it-works-section";
// import IndustriesSection from "@/components/landing/industries-section";
// import PricingTeaserSection from "@/components/landing/pricing-teaser-section";
// import FinalCTA from "@/components/landing/final-CTA";
import Footer from "@/components/landing/footer";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Industries from "@/components/landing/Industries";
import Pricing from "@/components/landing/Pricing";

export default function Home() {
  return (
    <div className="marketing-dark min-h-screen bg-(--mk-bg)">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Industries />
        <Pricing />
        {/* <BentoSection />
        <ModelingSection />
        <HowItWorksSection />
        <IndustriesSection />
        <PricingTeaserSection />
        <FinalCTA /> */}
      </main>
      <Footer />
    </div>
  );
}
