import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Github } from '../../../public/icon/github';

export default function TeamSection() {
  const team = [
    {
      role: "SYSTEMS ARCHITECTURE",
      bio: "Awwal is a software engineer focused on building ",
      highlight: "high-performance intelligence layers",
      suffix: " and clean, scalable architecture. He led the design of the Pulse multi-agent pipeline.",
      name: "Awwal Anileleye",
      title: "Lead Software Engineer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Awwal"
    },
    {
      role: "AI & REASONING",
      bio: "Roqeeb specializes in large language model ",
      highlight: "optimization and grounded reasoning",
      suffix: ". He ensures that Pulse delivers precise insights without the enterprise hallucination risk.",
      name: "Roqeeb",
      title: "AI Engineer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Roqeeb"
    },
    {
      role: "DATA PIPELINES",
      bio: "Joy engineers the resilient ",
      highlight: "real-time data connectors",
      suffix: " that allow Pulse to introspect complex enterprise databases with zero latency.",
      name: "Joy",
      title: "Data Engineer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joy"
    },
    {
      role: "INFRASTRUCTURE",
      bio: "Chidera focuses on the ",
      highlight: "secure data orchestration",
      suffix: " and schema mapping that forms the backbone of the Pulse intelligence engine.",
      name: "Chidera",
      title: "Data Engineer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chidera"
    }
  ];

  return (
    <section data-navbar-theme="dark" className="bg-black text-white font-sans selection:bg-zinc-800">
      <div className="max-w-7xl mx-auto border-x border-zinc-900">
        
        {/* Header Section */}
        <div className="border-y border-zinc-900 p-12 md:p-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <span className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">
              / The Team
            </span>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
              Built by engineers.<br />
              For the enterprise.
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-between gap-12 px-6 py-2.5 rounded-full border border-zinc-800 bg-zinc-950/50 text-sm font-medium hover:bg-zinc-900 transition-colors group">
              <span>View on GitHub</span>
              <Github />
            </button>
          </div>
        </div>

        {/* Team Grid - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-900">
          {team.slice(0, 2).map((member, i) => (
            <div key={i} className={`p-12 md:p-16 flex flex-col justify-between gap-12 ${i === 0 ? 'border-r border-zinc-900' : ''}`}>
              <div className="space-y-6">
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                  {member.role}
                </span>
                <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium">
                  {member.bio}
                  <span className="bg-zinc-800 text-white px-1 py-0.5 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    {member.highlight}
                  </span>
                  {member.suffix}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-zinc-200">{member.name}</p>
                  <p className="text-xs text-zinc-500">{member.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Grid - Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-900">
          {team.slice(2, 4).map((member, i) => (
            <div key={i} className={`p-12 md:p-16 flex flex-col justify-between gap-12 ${i === 0 ? 'border-r border-zinc-900' : ''}`}>
              <div className="space-y-6">
                <span className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                  {member.role}
                </span>
                <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium">
                  {member.bio}
                  <span className="bg-zinc-800 text-white px-1 py-0.5 rounded-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                    {member.highlight}
                  </span>
                  {member.suffix}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-800 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-sm text-zinc-200">{member.name}</p>
                  <p className="text-xs text-zinc-500">{member.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer controls */}
        <div className="flex justify-end p-6 border-b border-zinc-900 gap-4">
          <button className="p-2 text-zinc-600 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button className="p-2 text-zinc-600 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </section>
  );
}