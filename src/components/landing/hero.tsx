export default function Hero() {
  return (
    <section className="relative min-h-screen bg-slate-50 text-zinc-900 overflow-hidden flex flex-col items-center pt-30">
      {/* Premium Ambient Background (Replaces the boring grid) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-40%] left-[50%] -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-indigo-100/40 via-indigo-50/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[-10%] w-150 h-[600px] bg-sky-100/30 rounded-full blur-3xl" />
      </div>

      {/* Announcement Badge */}
      <div className="relative z-10 mb-12 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-zinc-200/80 px-4 py-1.5 rounded-full text-xs text-zinc-600 shadow-sm shadow-zinc-100/50">
        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
        <span>
          Open Source Core •{" "}
          <a href="#" className="underline hover:text-indigo-600 transition-colors font-medium">
            Read the launch announcement
          </a>
        </span>
      </div>

      <div className="relative z-10 max-w-625 w-full px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] text-zinc-900">
            <span className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-transparent">
              Data Intelligence
            </span>{" "}
            <br />
            <span className="text-zinc-400 font-medium">without the friction.</span>
          </h1>

          <p className="text-xl text-zinc-600 max-w-125 leading-relaxed">
            Pulse turns warehouse data into grounded operational answers. No SQL or pipeline setup needed.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Primary Action Button */}
            <button className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-indigo-600/15 hover:shadow-indigo-600/25 hover:-translate-y-0.5 cursor-pointer active:translate-y-0">
              <span>Get Started Freely</span>
            </button>
            {/* Secondary Action Button */}
            <button className="px-6 py-3.5 rounded-xl border border-zinc-200 bg-white/80 backdrop-blur-xs text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all font-medium shadow-xs">
              Watch Video Demo
            </button>
          </div>

          <div className="pt-6 space-y-2 border-t border-zinc-200/60">
            <p className="text-zinc-600 text-sm leading-relaxed">
              Detected a <span className="text-zinc-900 font-semibold underline decoration-amber-500/40 decoration-2">12% churn spike</span> across 
              <span className="text-zinc-900 font-semibold"> West African nodes.</span> 
              {" "}Recommend <span className="text-indigo-600 font-semibold">localized retention action.</span>
            </p>
            <p className="text-zinc-400 text-xs pt-1">
              Open models from <span className="text-zinc-600 font-medium">$1/mo</span> with $10-40 in free credits.
            </p>
          </div>
        </div>

        {/* Right Decorative Elements (Clean Glassmorphic Dashboard Mock) */}
        <div className="hidden lg:block relative h-[450px] w-full">
          {/* Main "Card" */}
          <div className="absolute top-12 right-4 w-[85%] h-[320px] bg-white/70 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-zinc-200/50 p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400/70" />
                <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                <span className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <span className="text-xs font-mono text-zinc-400">warehouse-query.py</span>
            </div>
            
            {/* Visual filler lines representing data/code */}
            <div className="space-y-3 flex-1 pt-6">
              <div className="h-4 bg-zinc-100 rounded-md w-3/4 animate-pulse" />
              <div className="h-4 bg-indigo-50 rounded-md w-1/2" />
              <div className="h-4 bg-zinc-100 rounded-md w-5/6" />
              <div className="h-4 bg-zinc-50 rounded-md w-2/3" />
            </div>

            <div className="h-12 bg-indigo-50/50 rounded-xl border border-indigo-100/50 flex items-center px-4 justify-between">
              <span className="text-xs font-medium text-indigo-600">Optimization complete</span>
              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-md font-mono">200 OK</span>
            </div>
          </div>
          
          {/* Accent Floating Mini-Card */}
          <div className="absolute bottom-4 left-4 w-56 bg-white border border-zinc-100 rounded-xl shadow-lg p-4 flex items-center gap-3 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Accuracy</p>
              <p className="text-lg font-bold text-zinc-800">99.4%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}