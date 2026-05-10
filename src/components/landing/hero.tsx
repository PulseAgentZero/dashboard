import React from "react";
import Image from "next/image";
import { BladeFan } from "../../../public/icon/bladeFan";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative w-full h-screen bg-[#7D91C4] overflow-hidden flex items-center">
      {/* Navbar Overlay */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-8 py-6 z-20">
        <div className="text-white flex items-center gap-2 w-[35%]">
          <div
            className="animate-spin flex items-center justify-center gap-2"
            style={{ animationDuration: "5s" }}
          >
            <BladeFan color="white" size={45} />
          </div>
          <p className="text-[25px] font-semibold">PULSE</p>
        </div>
        <div className="hidden md:flex gap-8 text-white/90 font-medium w-[30%] items-center justify-center">
          <a href="#" className="hover:text-white">
            Products
          </a>
          <a href="#" className="hover:text-white">
            Learn
          </a>
          <a href="#" className="hover:text-white">
            Company
          </a>
        </div>
        <div className="flex items-center justify-end gap-2 w-[35%]">
          <Link href="/auth/login" className="text-white font-medium px-4 py-2">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-[#3B66F5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center pt-20">
        {/* Left Column: Text & CTA */}
        <div className="z-10 text-white max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-5">
            Smarter Intelligence for Every Business
            <br />
            <span className="opacity-90 italic font-serif">just for you.</span>
          </h1>
          <p className="text-lg md:text-[18px] text-white/80 mb-8 max-w-lg leading-relaxed">
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

        {/* Right Column: High-Impact Visual */}
        <div className="relative flex justify-center items-end h-full">
          {/* High-resolution image placeholder on the right */}
          <div className="relative w-full aspect-square md:aspect-auto md:h-175">
            <Image
              src="https://images.unsplash.com/photo-1738680389225-b86472d8c632?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Global Banking User"
              fill
              className="object-cover object-top rounded-t-full"
              priority
            />
          </div>
        </div>
      </div>

      {/* Wave/Bottom Detail */}
      <div className="absolute bottom-0 right-0 w-1/3 h-28 bg-white rounded-tl-[50px] hidden md:block"></div>
    </section>
  );
};

export default Hero;
