import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import PressSection from "@/components/landing/press-section";
import FeaturesSection from "@/components/landing/features-section";
// import DarkPromoSection from "@/components/landing/dark-promo-section";
// import BentoSection from "@/components/landing/bento-section";
// import UseCasesSection from "@/components/landing/usecases-section";
// import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PressSection />
        <FeaturesSection />
        {/* <DarkPromoSection />
        <BentoSection />
        <UseCasesSection /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}
