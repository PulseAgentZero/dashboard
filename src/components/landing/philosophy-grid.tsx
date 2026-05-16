
export default function PhilosophyGrid() {
  return (
    <div data-navbar-theme="dark" className="bg-black text-white font-mono selection:bg-zinc-800">
      <div className="max-w-7xl mx-auto border-x border-zinc-900">
        
        {/* Top Header */}
        <div className="border-y border-zinc-900 p-8 lg:p-10">
          <h2 className="text-xl text-zinc-200 tracking-tight font-bold">
            / stop guessing with generic AI.
          </h2>
        </div>

        {/* Dual Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-900">
          
          {/* Left Column: Context */}
          <div className="p-12 lg:p-16 border-r border-zinc-900 flex flex-col gap-6">
            <div className="inline-block">
              <span className="bg-zinc-900 text-[10px] text-zinc-400 px-2 py-1 rounded border border-zinc-800 uppercase tracking-widest font-sans font-bold">
                data without context is noise
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-zinc-400 leading-relaxed max-w-sm">
                <span className="text-white font-bold">/ Generic. Static. Irrelevant.</span> Standard LLMs don&apos;t know your business logic. Pulse learns your specific operational context to provide reasoning that actually aligns with your KPIs.
              </p>
            </div>
          </div>

          {/* Right Column: The Harness */}
          <div className="p-12 lg:p-16 flex flex-col gap-6">
            <div className="inline-block">
              <span className="bg-zinc-900 text-[10px] text-zinc-400 px-2 py-1 rounded border border-zinc-800 uppercase tracking-widest font-sans font-bold">
                reasoning, not just retrieval
              </span>
            </div>
            <div className="space-y-4">
              <p className="text-zinc-400 leading-relaxed max-w-sm">
                <span className="text-white font-bold">/ &quot;AI can&apos;t handle complex DBs.&quot;</span> It can&apos;t, but our harness can. Pulse sits between the model and your data, ensuring every insight is grounded in live, validated SQL queries.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Headline Section */}
        <div className="p-16 lg:p-24 border-b border-zinc-900 flex justify-center text-center">
          <h3 className="text-3xl md:text-4xl font-sans text-zinc-500 max-w-3xl leading-tight">
            <span className="text-white">Hello, Pulse.</span> The industry-agnostic intelligence layer that pairs enterprise LLMs with your <span className="text-white underline decoration-zinc-700 underline-offset-8">live operational data</span>.
          </h3>
        </div>

      </div>
    </div>
  );
}