

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-black text-white overflow-hidden flex flex-col items-center pt-30">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Announcement Badge */}
      <div className="relative z-10 mb-12 flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-1.5 rounded-full text-xs text-zinc-400">
        <span className="w-2 h-2 bg-zinc-500 rounded-full"></span>
        <span>
          Open Source Core •{" "}
          <a href="#" className="underline hover:text-white">
            Read the launch announcement
          </a>
        </span>
      </div>

      <div className="relative z-10 max-w-625 w-full px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Data Intelligence  <br />
              <span className="text-zinc-400">without the friction.</span>
            </h1>

          <p className="text-xl text-zinc-400 max-w-125 leading-relaxed">
              Pulse turns warehouse data into grounded operational answers. No SQL or pipeline setup needed.
            </p>

          <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-3 bg-indigo-600/90 hover:bg-indigo-600 px-4 py-3 rounded-2xl border border-indigo-400/30 font-mono text-sm transition-all group">
                <span className="text-indigo-200">Click to Get Started</span>
              </div>
              <button className="px-6 py-3 rounded-2xl border border-zinc-700 bg-black hover:bg-zinc-900 transition-colors font-medium">
                Video Demo
              </button>
            </div>

          <div className="pt-4 space-y-2">
              <p className="text-zinc-400 text-sm">
  Detected a <span className="text-white font-bold">12% churn spike</span> across 
  <span className="text-white font-bold"> West African nodes. </span> 
  Recommend <br /><span className="text-white font-bold">localized retention action.</span>
</p>
              <p className="text-zinc-500 text-xs pt-2">
                Open models from <span className="text-indigo-400">$1/mo</span> with $10-40 in free credits.
              </p>
            </div>
        </div>

        {/* Right Decorative Elements (The "Code Blocks") */}
        <div className="hidden lg:block relative h-[500px]">
          {/* Example of the floating purple blocks from the screenshot */}
          <div className="absolute top-10 right-0 w-74 h-16 bg-gradient-to-r from-transparent to-indigo-900/60 rounded-sm blur-[1px]"></div>
          <div className="absolute top-32 right-20 w-58 h-16 bg-gradient-to-r from-transparent to-indigo-800/80 rounded-sm"></div>
          <div className="absolute top-56 right-5 w-90 h-20 bg-gradient-to-r from-transparent to-indigo-900/70 rounded-sm"></div>
          <div className="absolute bottom-20 right-10 w-82 h-16 bg-gradient-to-r from-transparent to-indigo-700/50 rounded-sm"></div>
          {/* Vertical and small block accents */}
          <div className="absolute top-40 right-48 w-30 h-16 bg-indigo-900/40 border-l border-indigo-500/20"></div>
          <div className="absolute bottom-36 right-32 w-26 h-16 bg-indigo-800/30"></div>
        </div>
      </div>
    </section>
  );
}

