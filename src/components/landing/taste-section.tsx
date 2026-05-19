import React from 'react';

export default function ModelingSection() {
  return (
    <section className="w-full bg-black text-[#a1a1aa] font-mono text-xs leading-relaxed selection:bg-indigo-500/30">
      {/* Container with full border grid */}
      <div className="w-full border-y border-zinc-900 grid grid-cols-[80px_1fr_1fr_80px]">
        
        {/* Left Sidebar Labels - The "Static" Problems */}
        <div className="border-r border-zinc-900 flex flex-col pt-20 gap-16 items-center text-[10px] text-zinc-600 uppercase tracking-tighter">
          <span>[ Input ]</span>
          <div className="flex flex-col gap-24 pt-4">
            <span>[ Average ]</span>
            <span>[ Flat ]</span>
            <span>[ Blind ]</span>
          </div>
          <span className="mt-12">[ Outcome ]</span>
          <div className="mt-20 flex flex-col items-center">
            <span>[ s#!t ]</span>
            <span className="text-[12px] mt-1 italic text-center">Noise. <br/> No Signal.</span>
          </div>
        </div>

        {/* Column 1: Static Analytics */}
        <div className="border-r border-zinc-900 p-8 lg:p-12">
          <div className="mb-12">
            <h3 className="text-white text-[20px] italic font-sans font-bold uppercase tracking-tighter">Static Analytics</h3>
            <p className="text-zinc-500 font-sans italic text-sm">Hard-coded rules. Past tense.</p>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-400">{">"} Recommend next-best-action for high-value users</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <span>✦</span> Calculating averages...
              </div>
              <div className="pl-4 border-l border-zinc-800 space-y-2">
                <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-[9px] uppercase text-zinc-500">No Modeling</span>
                <p className="text-zinc-100">└ Recommendation: &quot;Send generic discount coupon&quot;</p>
              </div>

              <div className="flex items-center gap-2 text-zinc-500">
                <span>✦</span> Why did they churn anyway?
              </div>
              <div className="pl-4 border-l border-zinc-800 space-y-2">
                <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-[9px] uppercase text-red-500">Correlation Error</span>
                <p className="text-zinc-100">└ &quot;I assume it&apos;s price, but I&apos;m just a dashboard.&quot;</p>
              </div>
            </div>

            <div className="pt-8 opacity-30 grayscale pointer-events-none">
              <p>{">"} s#!t, 80% of coupons went unused</p>
              <p>{">"} back to manual segmenting...</p>
            </div>
          </div>
        </div>

        {/* Column 2: Entivia Modeling */}
        <div className="p-8 lg:p-12 bg-zinc-950/20">
          <div className="mb-12">
            <h3 className="text-white text-[20px] italic font-sans font-bold uppercase tracking-tighter">Entivia Modeling</h3>
            <p className="text-zinc-500 font-sans italic text-sm">Behavioral DNA. Predictive. Adaptive.</p>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-400">{">"} Recommend next-best-action for high-value users</p>
            
            <div className="flex items-center gap-2 text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Constructing User Models...
            </div>

            {/* The Modeling Logic UI */}
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600/5 blur-2xl rounded-full -z-10" />
              <div className="bg-gradient-to-r from-zinc-900 to-transparent p-6 border border-zinc-800 rounded-sm">
                <span className="bg-white text-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">Active Reasoning</span>
                <div className="mt-4 space-y-2">
                  <p className="text-zinc-100 font-bold">└ User Modeling layer initialized:</p>
                  <ul className="pl-4 space-y-1 text-zinc-500">
                    <li>□ Mapping <span className="text-indigo-400">transaction_velocity</span> to churn risk</li>
                    <li>□ Weighting <span className="text-indigo-400">support_ticket_sentiment</span></li>
                    <li>□ Modeling <span className="text-indigo-400">feature_adoption</span> curves</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <span className="bg-indigo-950 text-indigo-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-indigo-900">Personalized Logic</span>
                 <p className="text-zinc-500">└ Identifying non-obvious patterns...</p>
               </div>
               
               <div className="text-white border-l-2 border-emerald-500 pl-4 py-1">
                 <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Recommendation Engine</span>
                 <p className="text-zinc-100 mt-2">└ &quot;User group &apos;Beta-Alpha&apos; lacks mobile engagement. Trigger personalized push-notification vs. email.&quot;</p>
                 <p className="text-zinc-500 mt-1 italic">Expected conversion uplift: +18.4%</p>
               </div>

               <p className="text-indigo-400 mt-8 italic">{">"} agreed. initialize mobile-push sequence.</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Labels - The "Entivia" Advantage */}
        <div className="border-l border-zinc-900 flex flex-col pt-20 gap-16 items-center text-[10px] uppercase tracking-tighter">
          <span className="text-zinc-600">[ Input ]</span>
          
          <div className="flex flex-col items-center gap-2 mt-8">
            <span className="text-indigo-500 font-bold">[ Deep DNA ]</span>
            <span className="text-[12px] text-zinc-600 text-center">User <br/> Modeling</span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-24">
            <span className="text-indigo-500 font-bold">[ Predictive ]</span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-20">
            <span className="text-indigo-500 font-bold">[ Logic Win ]</span>
            <span className="text-[12px] text-zinc-600 text-center">Tailored <br/> Actions</span>
          </div>
        </div>
      </div>
    </section>
  );
}