import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Footer from "@/components/landing/footer";
import Problem from "@/components/landing/Problem";
import Solution from "@/components/landing/Solution";
import Industries from "@/components/landing/Industries";
// import Pricing from "@/components/landing/Pricing";

export default function Home() {
  return (
    <div className="marketing-dark min-h-screen bg-(--mk-bg)">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Industries />
        {/* <Pricing /> */}
      </main>
      <Footer />
    </div>
  );
}
