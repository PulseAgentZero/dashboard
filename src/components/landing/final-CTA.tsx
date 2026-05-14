import React from 'react';
import Image from 'next/image';

export default function FinalCTA() {
  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aner",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zion",
  ];

  return (
    <section className="relative w-full bg-black py-32 overflow-hidden border-t border-zinc-900">
      {/* Background Grid - Matches the grid logic in Screenshot 2026-05-14 at 1.44.34 AM.jpg */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-20 pointer-events-none">
        {[...Array(72)].map((_, i) => (
          <div key={i} className="border-[0.5px] border-zinc-800" />
        ))}
      </div>

      {/* Textured "Taste" Blocks - Side Visuals */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Side Blocks */}
        <div className="absolute top-10 left-10 w-32 h-10 bg-zinc-900/80 rounded shadow-inner" />
        <div className="absolute top-24 left-4 w-48 h-12 bg-zinc-900/60 rounded" />
        <div className="absolute top-40 left-20 w-40 h-8 bg-zinc-900/40 rounded" />
        
        {/* Right Side Blocks */}
        <div className="absolute top-12 right-8 w-24 h-16 bg-zinc-900/80 rounded" />
        <div className="absolute top-32 right-12 w-52 h-10 bg-zinc-900/60 rounded" />
        <div className="absolute top-48 right-4 w-36 h-12 bg-zinc-900/40 rounded" />
      </div>
      

      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Avatar Stack */}
        <div className="flex -space-x-3 mb-10">
  {avatars.map((src, i) => (
    <div key={i} className="relative w-10 h-10">
      <Image 
        src={src} 
        alt="Operational Team member"
        width={40}
        height={40}
        className="rounded-full border-2 border-black bg-zinc-800 object-cover"
        unoptimized // Use this if you haven't configured remotePatterns for api.dicebear.com
      />
    </div>
  ))}
  <div className="w-10 h-10 rounded-full border-2 border-black bg-zinc-900 flex items-center justify-center text-[10px] text-zinc-500 font-bold z-10">
    +50
  </div>
</div>

        {/* Content */}
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          <span className="text-zinc-600 italic font-mono text-2xl mr-2">//</span>
          Take Command of your data.
        </h2>
        
        <p className="text-xl md:text-3xl text-zinc-400 font-medium leading-tight mb-12 max-w-2xl">
  Scale 10× faster with your existing data,<br />
  zero hallucinations, and grounded reasoning.<br />
  Connect, introspect, and start deciding.
</p>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-full font-mono text-sm transition-all cursor-pointer group shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold tracking-tighter">Get started with pulse</span>

          </div>
          <button className="px-8 py-3 rounded-full border border-zinc-800 bg-black text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all font-medium">
            Read the docs.
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-zinc-600 font-mono tracking-[0.3em] uppercase">
         Open Source Core • MIT Licensed • Self-Hostable
        </p>
      </div>
    </section>
  );
}