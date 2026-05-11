import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import PressSection from "@/components/landing/press-section";
import FeaturesSection from "@/components/landing/features-section";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PressSection />
        <FeaturesSection />
      </main>
    </div>
  );
}
