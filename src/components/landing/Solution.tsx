"use client";

import { useEffect, useState, useRef } from "react";
import { 
  MessageSquare, 
  Database, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Terminal, 
  CornerDownRight, 
  Lock, 
  Layers, 
  Activity 
} from "lucide-react";

const STEPS = [
  {
    id: "step-1",
    num: "01",
    icon: MessageSquare,
    title: "Describe your business goals",
    badge: "Plain English Input",
    description: "Tell Entivia how your operation works without writing code. Define what high-risk status means for your custom database nodes.",
    example: '"We are a telecom firm. Core entities are subscribers, and risk means high probability of subscriber churn based on balance drops."',
    fileName: "prompt_compiler.md",
  },
  {
    id: "step-2",
    num: "02",
    icon: Database,
    title: "Connect your active database",
    badge: "Read-Only Security",
    description: "Plug in PostgreSQL, MySQL, MSSQL, SQLite, or CSV streams. Connection parameters are fully encrypted locally.",
    example: "postgresql://op_user:******@local-replica.internal:5432/telecom_prod",
    fileName: "secure_tunnel.config",
  },
  {
    id: "step-3",
    num: "03",
    icon: Cpu,
    title: "Autonomous Introspection & Scoring",
    badge: "Reasoning Pipeline",
    description: "The AI agent maps database schemas, references transaction flows, and models scores from critical to healthy automatically.",
    example: "Pipeline scheduler triggered. Analyzing table schemas... 12,400 entities scored dynamically.",
    fileName: "entivia-engine.log",
  },
  {
    id: "step-4",
    num: "04",
    icon: Zap,
    title: "Act on live recommendations",
    badge: "Actionable Output",
    description: "Your operations team gets automatically ranked tasks, draft outreach logs, and automated event webhooks instantly.",
    example: "Recommendation: Dispatch personalized high-value retention tier bundle over API payload.",
    fileName: "action_dispatcher.json",
  },
];

export default function Solution() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Only track scroll intersections on large viewports where the layout is a sticky split-screen
    if (window.innerWidth < 1024) return;

    const observers = stepRefs.current.map((ref, idx) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStep(idx);
          }
        },
        {
          rootMargin: "-30% 0px -40% 0px",
          threshold: 0.1,
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((obs) => obs?.disconnect());
    };
  }, []);

  const scrollToStep = (idx: number) => {
    if (window.innerWidth >= 1024) {
      stepRefs.current[idx]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      setActiveStep(idx);
    }
  };

  // Helper render function to prevent duplicate code block styling across inline and desktop panels
  const renderVisualContent = (stepIdx: number) => {
    return (
      <div className="p-4 sm:p-6 bg-neutral-900 text-neutral-300 min-h-[260px] sm:min-h-[320px] flex flex-col justify-between gap-6 font-mono text-xs sm:text-[13px]">
        {/* 01. ENGLISH INPUT VIEW */}
        {stepIdx === 0 && (
          <div className="flex flex-col gap-3 sm:gap-4 flex-1 justify-center">
            <div className="text-neutral-500 text-[10px] sm:text-[11px] tracking-tight">/ Business Context Prompt</div>
            <div className="bg-neutral-950 p-3 sm:p-4 rounded-lg border border-neutral-800/80 font-sans text-xs sm:text-sm text-neutral-100 italic leading-relaxed">
              {STEPS[0].example}
            </div>
            <div className="flex items-start gap-2 text-neutral-400 text-[11px] sm:text-xs pl-1">
              <CornerDownRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
              <span>Parsing configuration rules into abstract graph embeddings...</span>
            </div>
          </div>
        )}

        {/* 02. SECURE DATABASE CONNECTION VIEW */}
        {stepIdx === 1 && (
          <div className="flex flex-col gap-3 sm:gap-4 flex-1 justify-center">
            <div className="text-neutral-500 text-[10px] sm:text-[11px] tracking-tight">/ Database Encryption String</div>
            <div className="bg-neutral-950 p-3 sm:p-4 rounded-lg border border-neutral-800/80 text-[11px] sm:text-[12px] break-all text-emerald-400">
              {STEPS[1].example}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[11px] sm:text-xs mt-1">
              <div className="bg-neutral-950 p-2 sm:p-2.5 rounded border border-neutral-800/40 flex items-center gap-1.5 sm:gap-2">
                <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500" />
                <span className="text-neutral-400 text-[10px] sm:text-[11px]">TLS 1.3 Strict</span>
              </div>
              <div className="bg-neutral-950 p-2 sm:p-2.5 rounded border border-neutral-800/40 flex items-center gap-1.5 sm:gap-2">
                <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-500" />
                <span className="text-neutral-400 text-[10px] sm:text-[11px]">Read-Only Layer</span>
              </div>
            </div>
          </div>
        )}

        {/* 03. TERMINAL STREAM VIEW */}
        {stepIdx === 2 && (
          <div className="flex flex-col gap-3 sm:gap-4 flex-1 justify-center">
            <div className="text-neutral-500 text-[10px] sm:text-[11px] tracking-tight">/ Engine Step Context State</div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="text-neutral-400 font-semibold">▶ engine_status:</span>
              <span className="text-amber-400 font-medium tracking-wide animate-pulse">RUNNING_INTROSPECTION</span>
            </div>
            <div className="bg-neutral-950 rounded-lg p-3 sm:p-4 border border-neutral-800/60 text-[11px] sm:text-[12px]">
              <p className="leading-relaxed text-neutral-300">
                {STEPS[2].example}
              </p>
            </div>
          </div>
        )}

        {/* 04. RECOMMENDATION ACTION CARD */}
        {stepIdx === 3 && (
          <div className="flex flex-col gap-3 sm:gap-4 flex-1 justify-center">
            <div className="text-neutral-500 text-[10px] sm:text-[11px] tracking-tight">/ Dispatched Production Task Payload</div>
            <div className="bg-white text-neutral-900 rounded-lg p-3 sm:p-4 border border-neutral-200 shadow-sm font-sans">
              <div className="flex items-center gap-2 pb-1.5 border-b border-neutral-100 mb-2">
                <Activity className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-[11px] sm:text-xs font-bold text-neutral-900 tracking-tight">Immediate Outbound Queue</span>
              </div>
              <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed font-mono">
                {STEPS[3].example.replace("Recommendation: ", "")}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Status Anchors */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-neutral-800/60 text-neutral-500 text-[10px] sm:text-[11px]">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span>Zero external cloud dependencies</span>
          </div>
          <div className="text-neutral-400 font-medium tracking-wider">
            STAGE 0{stepIdx + 1} / 04
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="solutions"
      data-navbar-theme="light"
      className="bg-white text-neutral-900 py-12 sm:py-24 lg:py-32 border-b border-neutral-100 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header Block */}
        <div className="max-w-3xl mb-12 sm:mb-20 lg:mb-24">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif tracking-tight text-neutral-900 leading-snug sm:leading-[1.1]">
            Turn raw rows into real actions. No data science team required.
          </h2>
          <p className="mt-4 sm:mt-6 text-neutral-500 text-sm sm:text-lg lg:text-xl max-w-2xl leading-relaxed">
            Entivia connects natively inside your current setup, reasons directly across transaction logs, and updates your operations desk in real time.
          </p>
        </div>

        {/* Interactive Split Architecture Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: List Container */}
          <div className="lg:col-span-5 flex flex-col gap-12 lg:gap-32 lg:py-10 pl-2 lg:pl-0 border-l border-neutral-100">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = activeStep === idx;
              
              return (
                <div key={step.id} className="w-full flex flex-col gap-4">
                  {/* Text trigger boundary block */}
                  <div
                    ref={(el) => { stepRefs.current[idx] = el; }}
                    onClick={() => scrollToStep(idx)}
                    className="w-full text-left flex gap-3 sm:gap-4 items-start relative cursor-pointer pl-4 -ml-[1px] lg:transition-opacity lg:duration-300"
                    style={{ opacity: isSelected ? 1 : window.innerWidth >= 1024 ? 0.25 : 1 }}
                  >
                    {/* Sleek Vertical Accent Active Bar */}
                    <span 
                      className={`absolute left-0 top-1 bottom-1 w-[2px] transition-all duration-300 ${
                        isSelected ? "bg-neutral-900 scale-y-100" : "bg-transparent scale-y-0 lg:scale-y-0"
                      }`} 
                    />

                    {/* Flat Compact Icon Marker */}
                    <span className={`p-1 mt-0.5 rounded transition-colors ${
                      isSelected ? "text-neutral-900" : "text-neutral-400 lg:text-neutral-400"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 font-mono text-[10px] sm:text-[11px] tracking-tight text-neutral-400">
                        <span>{step.num}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-200" />
                        <span className="uppercase text-neutral-500 font-medium">{step.badge}</span>
                      </div>
                      
                      <h3 className="text-sm sm:text-base font-semibold tracking-tight text-neutral-900">
                        {step.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed mt-1.5">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Mobile-Only Inline Display Node Block */}
                  <div className="block lg:hidden w-full rounded-xl border border-neutral-200/80 bg-white overflow-hidden shadow-sm mt-1">
                    <div className="bg-neutral-50 px-3 py-2 border-b border-neutral-200 flex items-center justify-between text-neutral-400 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="w-3 h-3 text-neutral-400" />
                        <span className="text-neutral-600 font-medium tracking-tight font-mono">{step.fileName}</span>
                      </div>
                    </div>
                    {renderVisualContent(idx)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Desktop-Only Sticky Context Simulator Panel */}
          <div className="hidden lg:block lg:col-span-7 lg:sticky lg:top-28">
            <div className="w-full rounded-xl border border-neutral-200/80 bg-white overflow-hidden font-mono relative transition-all duration-300">
              
              {/* Dynamic Header Frame mapped to active step */}
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center justify-between text-neutral-400 text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-neutral-600 font-medium tracking-tight text-[11px]">
                    {STEPS[activeStep].fileName}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-500 bg-neutral-200/60 font-medium px-2 py-0.5 rounded uppercase tracking-wider">
                  {STEPS[activeStep].badge}
                </div>
              </div>

              {/* Central Multi-Layout Container Frame */}
              {renderVisualContent(activeStep)}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}