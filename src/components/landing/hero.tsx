import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full h-screen bg-[#7D91C4] overflow-hidden flex items-center">
      {/* Main Content */}
      <div className="container mx-auto px-6 grid md:grid-cols-12 gap-8 items-start pt-20">
        {/* Left Column: 60% Width (7/12) */}
        <div className="z-10 text-white md:col-span-7 lg:pr-12">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-5">
            Smarter Intelligence for Every Business
            <br />
            <span className="opacity-90 italic font-serif">just for you.</span>
          </h1>
          <p className="text-lg md:text-[18px] text-white/80 mb-8 max-w-lg leading-relaxed font-medium">
            Connect Pulse to your database for AI insights, recommendations, and
            a conversational agent without a data science team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/auth/signup"
              className="bg-[#3B66F5] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>

        {/* Right Column: 40% Width (5/12) */}
        <div className="relative flex justify-center md:justify-end items-end h-full md:col-span-5">
          {/* image container with constrained width */}
          <div className="relative w-full max-w-[320px] lg:max-w-95 aspect-full">
            <Image
              src="https://images.unsplash.com/photo-1487379595640-f04ccae706cd?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Global Banking User"
              fill
              className="object-cover object-top rounded-t-full shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Wave/Bottom Detail */}
      <div className="absolute bottom-0 -right-4 w-1/3 h-28 bg-white rounded-tl-[40px] -skew-x-12 hidden md:block"></div>
      <div className="absolute bottom-0 left-0 bg-white h-2.5 w-full"></div>
    </section>
  );
};

export default Hero;
