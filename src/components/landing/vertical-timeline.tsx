"use client"
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Cpu, Share2, Command, RotateCcw, FileText } from 'lucide-react';

// label col = w-28 (112px), node col = w-8 (32px) → line center = 112 + 16 = 128px
const LINE_LEFT = 128;

const steps = [
  { 
    label: '[ Connection ]', 
    Icon: FileText, 
    bold: 'How does Pulse connect to my data?', 
    rest: '', 
    action: true  
  },
  { 
    label: '[ Introspection ]', 
    Icon: Cpu, 
    bold: 'Schema mapping.', 
    rest: ' automatically identifying entities, signals, and timestamps.' 
  },
  { 
    label: '[ Reasoning ]', 
    Icon: Terminal, 
    bold: 'Real-time modeling.', 
    rest: ' translating business goals into live analytical SQL queries.' 
  },
  { 
    label: '[ Prediction ]', 
    Icon: Share2, 
    bold: 'Behavioral profiling.', 
    rest: ' scoring every entity based on declining activity or risk patterns.' 
  },
  { 
    label: '[ Outcome ]',  
    Icon: Command,  
    bold: 'Actionable Intelligence.', 
    rest: ' prioritized recommendations delivered to your team in real-time.' 
  },
];

export default function VerticalTimeline() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="bg-black text-white font-mono py-20">
      <div className="max-w-7xl mx-auto border-x border-zinc-900">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">

          {/* LEFT — Timeline */}
          <div className="border-r border-zinc-900 relative">

            {/* Static track */}
            <div
              className="absolute top-0 bottom-0 w-px bg-zinc-800/60 pointer-events-none"
              style={{ left: LINE_LEFT }}
            />

            {/* Animated fill: green (done) → yellow tip (in progress) */}
            <motion.div
              className="absolute top-0 w-px pointer-events-none"
              style={{
                left: LINE_LEFT,
                height: lineHeight,
                background: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 70%, #eab308 100%)',
                boxShadow: '0 0 6px #22c55e44',
              }}
            />

            {steps.map(({ label, Icon, bold, rest, action }, i) => (
              <div key={i} className="flex items-center border-b border-zinc-900 min-h-21.5">

                {/* Label */}
                <div className="w-28 shrink-0 px-5">
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider leading-tight">
                    {label}
                  </span>
                </div>

                {/* Node — sits on top of the line via z-20 + black bg */}
                <div className="w-8 shrink-0 flex justify-center">
                  <div className="z-20 p-1.5 border border-zinc-800 rounded-md bg-black">
                    <Icon size={14} className="text-zinc-500" />
                  </div>
                </div>

                {/* Text */}
                <div className="flex-1 flex items-center justify-between px-6 pr-8">
                  <p className="text-sm leading-relaxed">
                    <span className="text-white font-medium">{bold}</span>
                    {rest && <span className="text-zinc-500">{rest}</span>}
                  </p>
                  {action && <RotateCcw size={13} className="text-zinc-700 ml-4 shrink-0" />}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Terminal preview */}
          <div className="px-8 pt-10 pb-4 sticky top-20 h-fit">
            <div className="rounded-xl overflow-hidden border border-zinc-800/80 shadow-2xl shadow-indigo-950/30">

              {/* Title bar */}
              <div className="bg-[#0d0d16] px-4 py-2.5 flex items-center gap-2 border-b border-zinc-800/60">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] text-zinc-600 ml-2 tracking-widest">~/project</span>
              </div>

              {/* Terminal body */}
              {/* Terminal body */}
<div className="bg-[#08081a] p-6 text-[12px] space-y-3 leading-relaxed">

  <div className="flex items-center gap-2 text-emerald-400/80">
    <span>✓</span>
    <span>Connected to PostgreSQL (prod-db-01)</span>
  </div>

  <div className="pl-4 space-y-1.5">
    <div className="text-zinc-700">.pulse/schema-metadata/</div>
    {['users_table.json', 'transactions.json', 'logs.json'].map(f => (
      <div key={f} className="flex items-center gap-2.5">
        <span className="bg-indigo-500/20 text-indigo-400 px-1.5 py-px rounded-sm text-[9px] font-bold tracking-wide">INDEX</span>
        <span className="text-zinc-400">{f}</span>
      </div>
    ))}
  </div>

  <div className="pt-1 space-y-1.5">
    <div className="flex items-center gap-2 text-zinc-500">
      <span className="text-zinc-700">❯</span>
      <span>pulse analyze --goal churn</span>
    </div>
    <div className="flex items-center gap-2.5">
      <span className="bg-purple-500/20 text-purple-400 px-1.5 py-px rounded-sm text-[9px] font-bold tracking-wide">QUERY</span>
      <span className="text-zinc-600">generating risk scores...</span>
    </div>
    <div className="flex items-center gap-2 text-emerald-400/70">
      <span>✓</span>
      <span>42 high-risk entities identified</span>
    </div>
  </div>

  <div className="pt-1 space-y-1.5">
    <div className="flex items-center gap-2 text-zinc-500">
      <span className="text-zinc-700">❯</span>
      <span>pulse push alerts --channel slack</span>
    </div>
    <div className="flex items-center gap-2.5">
      <span className="bg-cyan-500/20 text-cyan-400 px-1.5 py-px rounded-sm text-[9px] font-bold tracking-wide">NOTIFY</span>
      <span className="text-zinc-600">ops-team-leads</span>
    </div>
    <div className="flex items-center gap-2 text-emerald-400/70">
      <span>✓</span>
      <span>Daily Digest Delivered</span>
    </div>
  </div>

</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
