"use client"
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Cpu, Share2, Command, RotateCcw, FileText } from 'lucide-react';

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
    <div ref={containerRef} className="bg-white text-zinc-900 font-mono py-20">
      <div className="max-w-7xl mx-auto border-x border-zinc-200">
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]">

          {/* LEFT — Timeline */}
          <div className="border-r border-zinc-200 relative">

            {/* Static background track */}
            <div
              className="absolute top-0 bottom-0 w-px bg-zinc-200 pointer-events-none"
              style={{ left: LINE_LEFT }}
            />

            {/* Animated multi-color gradient timeline track */}
            <motion.div
              className="absolute top-0 w-px pointer-events-none"
              style={{
                left: LINE_LEFT,
                height: lineHeight,
                background: 'linear-gradient(to bottom, #4f46e5 0%, #7c3aed 40%, #c026d3 75%, #db2777 100%)',
                boxShadow: '0 0 10px rgba(124, 58, 237, 0.25)',
              }}
            />

            {steps.map(({ label, Icon, bold, rest, action }, i) => (
              <div key={i} className="flex items-center border-b border-zinc-200 min-h-22">

                {/* Label */}
                <div className="w-28 shrink-0 px-5">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider leading-tight">
                    {label}
                  </span>
                </div>

                {/* Node */}
                <div className="w-8 shrink-0 flex justify-center">
                  <div className="z-20 p-1.5 border border-zinc-200 rounded-md bg-white text-zinc-600 shadow-xs">
                    <Icon size={14} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 flex items-center justify-between px-6 pr-8">
                  <p className="text-sm font-sans font-medium leading-relaxed text-zinc-600">
                    <span className="text-zinc-900 font-bold font-mono text-[14px] block md:inline md:mr-1">
                      {bold}
                    </span>
                    {rest}
                  </p>
                  {action && <RotateCcw size={13} className="text-zinc-400 hover:text-zinc-900 transition-colors ml-4 shrink-0 cursor-pointer" />}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT — Premium Light IDE Terminal preview */}
          <div className="px-8 pt-10 pb-4 sticky top-24 h-fit">
            <div className="rounded-xl overflow-hidden border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50">

              {/* Title bar */}
              <div className="bg-zinc-50/80 px-4 py-3 flex items-center justify-between border-b border-zinc-200">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider">pulse_compiler_logs</span>
                <div className="w-6"></div>
              </div>

              {/* Terminal body */}
              <div className="p-6 text-[12px] space-y-4 leading-relaxed bg-zinc-950 text-zinc-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>✓</span>
                  <span>Connected to PostgreSQL (prod-db-01)</span>
                </div>

                <div className="pl-4 space-y-1.5">
                  <div className="text-zinc-500 font-bold">.pulse/schema-metadata/</div>
                  {['users_table.json', 'transactions.json', 'logs.json'].map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <span className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-sm text-[9px] font-black tracking-wide">INDEX</span>
                      <span className="text-zinc-400">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-indigo-400 font-bold">❯</span>
                    <span>pulse analyze --goal churn</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-sm text-[9px] font-black tracking-wide">QUERY</span>
                    <span className="text-zinc-500">generating risk scores...</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span>✓</span>
                    <span>42 high-risk entities identified</span>
                  </div>
                </div>

                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-indigo-400 font-bold">❯</span>
                    <span>pulse push alerts --channel slack</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded-sm text-[9px] font-black tracking-wide">NOTIFY</span>
                    <span className="text-zinc-500 font-medium">ops-team-leads</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
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