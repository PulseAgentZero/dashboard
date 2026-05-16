import React from 'react';

export default function ModelingSection() {
  return (
    <section className="w-full bg-white text-zinc-600 font-mono text-xs leading-relaxed selection:bg-indigo-100">
      {/* Container with full border grid */}
      <div className="w-full border-y border-zinc-200 grid grid-cols-[80px_1fr_1fr_80px]">
        
        {/* Left Sidebar Labels - The "Static" Problems */}
        <div className="border-r border-zinc-200 flex flex-col pt-20 gap-16 items-center text-[10px] text-zinc-400 uppercase tracking-tighter bg-zinc-50/30">
          <span>[ Input ]</span>
          <div className="flex flex-col gap-24 pt-4 text-center">
            <span>[ Average ]</span>
            <span>[ Flat ]</span>
            <span>[ Blind ]</span>
          </div>
          <span className="mt-12">[ Outcome ]</span>
          <div className="mt-20 flex flex-col items-center text-center">
            <span className="text-zinc-300 font-bold">[ Failure ]</span>
            <span className="text-[11px] mt-2 italic font-sans text-zinc-400 font-medium">Noise. <br/> No Signal.</span>
          </div>
        </div>

        {/* Column 1: Static Analytics */}
        <div className="border-r border-zinc-200 p-8 lg:p-12">
          <div className="mb-12">
            <h3 className="text-zinc-900 text-[20px] font-sans font-black uppercase tracking-tight">Static Analytics</h3>
            <p className="text-zinc-400 font-sans italic text-sm mt-1">Hard-coded rules. Past tense.</p>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-500 font-medium">{">"} Recommend next-best-action for high-value users</p>
            
            <div className="space-y-5">
              <div className="flex items-center gap-2 text-zinc-400 font-medium">
                <span>✦</span> Calculating averages...
              </div>
              <div className="pl-4 border-l border-zinc-200 space-y-2">
                <span className="bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 text-[9px] font-bold uppercase text-zinc-500">No Modeling</span>
                <p className="text-zinc-800 font-sans text-sm">└ Recommendation: &quot;Send generic discount coupon&quot;</p>
              </div>

              <div className="flex items-center gap-2 text-zinc-400 font-medium">
                <span>✦</span> Why did they churn anyway?
              </div>
              <div className="pl-4 border-l border-zinc-200 space-y-2">
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-100 text-[9px] font-bold uppercase">Correlation Error</span>
                <p className="text-zinc-800 font-sans text-sm">└ &quot;I assume it&apos;s price, but I&apos;m just a dashboard.&quot;</p>
              </div>
            </div>

            <div className="pt-10 opacity-30 grayscale pointer-events-none border-t border-zinc-100 mt-8">
              <p className="mb-1">{">"} 80% of coupons went unused</p>
              <p>{">"} back to manual segmenting...</p>
            </div>
          </div>
        </div>

        {/* Column 2: Pulse Modeling */}
        <div className="p-8 lg:p-12 bg-zinc-50/40">
          <div className="mb-12">
            <h3 className="text-zinc-900 text-[20px] font-sans font-black uppercase tracking-tight">Pulse Modeling</h3>
            <p className="text-zinc-500 font-sans italic text-sm mt-1">Behavioral DNA. Predictive. Adaptive.</p>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-800 font-medium">{">"} Recommend next-best-action for high-value users</p>
            
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" /> Constructing User Models...
            </div>

            {/* The Modeling Logic UI */}
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600/[0.02] blur-xl rounded-full -z-10" />
              <div className="bg-white p-6 border border-zinc-200 rounded-lg shadow-sm shadow-zinc-100">
                <span className="bg-zinc-900 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm">Active Reasoning</span>
                <div className="mt-4 space-y-2">
                  <p className="text-zinc-900 font-bold text-sm font-sans">└ User Modeling layer initialized:</p>
                  <ul className="pl-4 space-y-2 text-zinc-500 font-sans text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-zinc-300 font-mono">□</span> 
                      <span>Mapping <code className="bg-indigo-50 text-indigo-600 font-mono text-xs px-1 rounded">transaction_velocity</code> to churn risk</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-zinc-300 font-mono">□</span> 
                      <span>Weighting <code className="bg-indigo-50 text-indigo-600 font-mono text-xs px-1 rounded">support_ticket_sentiment</code></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-zinc-300 font-mono">□</span> 
                      <span>Modeling <code className="bg-indigo-50 text-indigo-600 font-mono text-xs px-1 rounded">feature_adoption</code> curves</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
               <div className="flex items-center gap-2">
                 <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-indigo-100 rounded">Personalized Logic</span>
                 <p className="text-zinc-500">└ Identifying non-obvious patterns...</p>
               </div>
               
               <div className="bg-white border-l-4 border-emerald-500 pl-4 py-3 rounded-r-lg border-y border-r border-zinc-200 shadow-xs">
                 <span className="text-emerald-600 font-bold uppercase text-[10px] tracking-widest block mb-1">Recommendation Engine</span>
                 <p className="text-zinc-900 font-sans text-sm font-medium">└ &quot;User group &apos;Beta-Alpha&apos; lacks mobile engagement. Trigger personalized push-notification vs. email.&quot;</p>
                 <p className="text-emerald-600 text-[11px] mt-1.5 font-bold">Expected conversion uplift: +18.4%</p>
               </div>

               <p className="text-indigo-600 mt-8 font-bold text-xs">{">"} agreed. initialize mobile-push sequence.</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Labels - The "Pulse" Advantage */}
        <div className="border-l border-zinc-200 flex flex-col pt-20 gap-16 items-center text-[10px] uppercase tracking-tighter bg-zinc-50/30">
          <span className="text-zinc-400">[ Input ]</span>
          
          <div className="flex flex-col items-center gap-1 mt-8 text-center">
            <span className="text-indigo-600 font-bold">[ Deep DNA ]</span>
            <span className="text-[11px] text-zinc-400 font-sans font-medium mt-1">User <br/> Modeling</span>
          </div>

          <div className="flex flex-col items-center gap-1 mt-24">
            <span className="text-indigo-600 font-bold">[ Predictive ]</span>
          </div>

          <div className="flex flex-col items-center gap-1 mt-20 text-center">
            <span className="text-indigo-600 font-bold">[ Logic Win ]</span>
            <span className="text-[11px] text-zinc-400 font-sans font-medium mt-1">Tailored <br/> Actions</span>
          </div>
        </div>
      </div>
    </section>
  );
}