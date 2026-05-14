import React from 'react';

export default function IntelligenceSection() {
  return (
    <section className="w-full bg-black text-[#a1a1aa] font-mono text-xs leading-relaxed selection:bg-indigo-500/30">
      {/* Container with full border grid */}
      <div className="w-full border-y border-zinc-900 grid grid-cols-[80px_1fr_1fr_80px]">
        
        {/* Left Sidebar Labels */}
        <div className="border-r border-zinc-900 flex flex-col pt-20 gap-16 items-center text-[10px] text-zinc-600 uppercase tracking-tighter">
          <span>[ Prompt ]</span>
          <div className="flex flex-col gap-24 pt-4">
            <span>[ Generic ]</span>
            <span>[ Lost ]</span>
            <span>[ Manual ]</span>
          </div>
          <span className="mt-12">[ Error ]</span>
          <div className="mt-20 flex flex-col items-center">
            <span>[ s#!t ]</span>
            <span className="text-[12px] mt-1 italic text-center">Stuck. <br/> No Context.</span>
          </div>
        </div>

        {/* Column 1: Generic AI */}
        <div className="border-r border-zinc-900 p-8 lg:p-12">
          <div className="mb-12">
            <h3 className="text-white text-[20px] italic font-sans font-bold">Generic AI</h3>
            <p className="text-zinc-500 font-sans italic text-sm">Static LLMs. The guessing game.</p>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-400">{">"} Identify subscribers at risk of churn</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-zinc-500">
                <span>✦</span> Analyzing...
              </div>
              <div className="pl-4 border-l border-zinc-800 space-y-2">
                <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-[9px] uppercase text-red-400">Missing Data</span>
                <p className="text-zinc-300">└ Please upload a CSV of your subscribers</p>
              </div>

              <div className="flex items-center gap-2 text-zinc-500">
                <span>✦</span> I have the CSV. Now what?
              </div>
              <div className="pl-4 border-l border-zinc-800 space-y-2">
                <span className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-[9px] uppercase text-yellow-500">Hallucinating</span>
                <p className="text-zinc-300">└ "I've invented a risk score based on names..."</p>
              </div>
            </div>

            <div className="pt-8 opacity-40 grayscale pointer-events-none">
              <p>{">"} s#!t, this doesn't match our DB</p>
              <p>{">"} leave it, I'll write the SQL myself!</p>
            </div>
          </div>
        </div>

        {/* Column 2: Pulse Intelligence */}
        <div className="p-8 lg:p-12 bg-zinc-950/20">
          <div className="mb-12">
            <h3 className="text-white text-[20px] italic font-sans font-bold">Pulse Intelligence</h3>
            <p className="text-zinc-500 font-sans italic text-sm">Grounded. Real-time. Yours.</p>
          </div>

          <div className="space-y-6">
            <p className="text-zinc-400">{">"} Identify subscribers at risk of churn</p>
            
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> Introspecting database...
            </div>

            {/* Context Badge and Reasoning - The "Aha!" UI */}
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600/10 blur-xl rounded-full -z-10" />
              <div className="bg-gradient-to-r from-indigo-900/40 to-transparent p-6 rounded-sm">
                <span className="bg-indigo-600 text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Grounded Context</span>
                <div className="mt-4 space-y-2">
                  <p className="text-indigo-200">└ Applying your Business Context:</p>
                  <ul className="pl-4 space-y-1 text-indigo-300/80">
                    <li>□ Reading `subscriber_activity` table</li>
                    <li>□ Target: Low usage &lt; 3 logins/week</li>
                    <li>□ Signals: Recent failed payments detected</li>
                    <li>□ Location: Focusing on Lagos region</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <span className="bg-zinc-800 text-zinc-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tighter">Executing SQL</span>
                 <p className="text-zinc-500">└ Reasoning across 14M rows...</p>
               </div>
               
               <div className="text-emerald-400">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2" /> 424 Entities Identified
                 <p className="pl-4 text-zinc-400 mt-2">└ Generated prioritized retention recommendations</p>
                 <p className="pl-8 text-zinc-500 mt-1 italic">View churn risk dashboard for details.</p>
               </div>

               <p className="text-indigo-400 mt-8 italic">{">"} perfect. draft an email for the top 10.</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar Labels */}
        <div className="border-l border-zinc-900 flex flex-col pt-20 gap-16 items-center text-[10px] uppercase tracking-tighter">
          <span className="text-zinc-600">[ Prompt ]</span>
          
          <div className="flex flex-col items-center gap-2 mt-8">
            <span className="text-indigo-500 font-bold">[ DB Connect ]</span>
            <span className="text-[12px] text-zinc-600 text-center">Live <br/> Introspection</span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-24">
            <span className="text-indigo-500 font-bold">[ Dynamic Logic ]</span>
          </div>

          <div className="flex flex-col items-center gap-2 mt-20">
            <span className="text-indigo-500 font-bold">[ Action Ready ]</span>
            <span className="text-[12px] text-zinc-600 text-center">Zero <br/> Hallucination</span>
          </div>
        </div>
      </div>
    </section>
  );
}