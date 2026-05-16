"use client";
import { useState } from "react";
import { MousePointer2 } from "lucide-react";

export default function FeatureExplorer() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "01",
      title: "Industry-Agnostic Modeling",
      cmd: "npx pulse init",
      description:
        "Zero hardcoding. Describe your business in plain English and Pulse builds a custom behavior model on top of your schema.",
      code: "CONTEXT: Reading business_context.txt\nSCHEMA: Identified 'subscriber_id' as Primary Entity\nGOAL: Churn Reduction",
    },
    {
      id: "02",
      title: "Direct-to-Database Introspection",
      description:
        "Data Sovereignty. Pulse connects to your live DB and reads metadata only. Your customer data never leaves your environment.",
      code: "CONNECTING: postgres://prod-db-01\nSTATUS: Read-only access granted\nMETADATA: 14 tables indexed, 0 rows copied.",
    },
    {
      id: "03",
      title: "Dynamic Query Reasoning",
      description:
        "No SQL required. The agent translates natural language into optimized analytical queries against your live database.",
      code: "> Show me high-risk entities in Lagos\nSQL: SELECT * FROM entities WHERE risk_score > 0.8 AND location = 'Lagos'...",
    },
    {
      id: "04",
      title: "Conversational Action Drafts",
      description:
        "Instant Intervention. The agent uses behavioral profiles to draft personalized retention messages or operational plans.",
      code: "ANALYZING: Entity ID 00445\nSIGNAL: 40% drop in usage\nDRAFTING: Personalized SMS...",
    },
    {
      id: "05",
      title: "Self-Hostable Infrastructure",
      description:
        "Privacy First. Deploy the entire stack inside your own VPC using Docker or Kubernetes for total NDPR compliance.",
      code: "DEPLOYING: pulse-engine:latest\nNETWORK: Internal VPC only\nSECURITY: Fernet encryption active",
    },
  ];

  return (
    <div className="bg-white text-zinc-900 min-h-screen p-8 font-mono selection:bg-zinc-200">
      <div className="max-w-7xl mx-auto border-x border-zinc-200">
        
        {/* Top Header Section - Crisp Grid Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-zinc-200">
          <div className="p-12 border-r border-zinc-200">
            <h2 className="text-xl text-zinc-500 font-bold tracking-tight">
              / the enterprise intelligence layer.
            </h2>
          </div>
          <div className="p-10 bg-zinc-50/50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-200">
          <div className="p-12 flex items-center border-r border-zinc-200">
            <p className="text-zinc-600 font-sans font-medium">
              Ships. Fixes. Tests. Refactors. Learns you, all the while.
            </p>
          </div>
          <div className="p-12 flex items-center gap-4">
            <button className="bg-zinc-900 text-white px-6 py-2.5 rounded-full flex items-center gap-2 font-sans font-bold hover:bg-zinc-800 transition-colors shadow-sm">
              Explore all features
            </button>
            <button className="border border-zinc-200 text-zinc-700 px-6 py-2.5 rounded-full font-sans font-semibold hover:bg-zinc-50 transition-colors">
              Docs
            </button>
          </div>
        </div>

        {/* Feature Interaction Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-150">
          
          {/* Left Side: List Block */}
          <div className="border-r border-zinc-200">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                onMouseEnter={() => setActiveFeature(index)}
                className={`p-8 border-b border-zinc-200 cursor-none group transition-colors duration-200 relative ${
                  activeFeature === index
                    ? "bg-zinc-50"
                    : "hover:bg-zinc-50/40"
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`text-xs font-bold ${activeFeature === index ? "text-zinc-500" : "text-zinc-300"}`}
                  >
                    {feature.id}
                  </span>
                  <h3
                    className={`text-lg font-sans font-bold tracking-tight transition-colors ${activeFeature === index ? "text-zinc-900" : "text-zinc-400"}`}
                  >
                    {feature.title}{" "}
                    {feature.cmd && (
                      <code className="text-xs font-mono bg-zinc-200/60 text-zinc-700 px-2 py-0.5 rounded ml-2 font-normal">
                        {feature.cmd}
                      </code>
                    )}
                  </h3>
                </div>

                {/* Custom Cursor Indicator */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none fixed z-50 transition-opacity">
                  <MousePointer2
                    className="text-indigo-600 fill-indigo-600 -rotate-90 translate-x-4 translate-y-4"
                    size={18}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Dynamic Context & Code IDE Interface */}
          <div className="p-12 flex flex-col gap-8 bg-zinc-50/30">
            <div className="mb-1 transition-all duration-500 ease-in-out">
              <p className="text-zinc-600 font-sans text-base leading-relaxed max-w-md">
                <span className="text-zinc-900 font-bold block mb-2">
                  {features[activeFeature].description.split(".")[0]}.
                </span>
                {features[activeFeature].description
                  .split(".")
                  .slice(1)
                  .join(".")}
              </p>
            </div>

            {/* Premium Light-Themed Code IDE Window */}
            <div className="rounded-xl overflow-hidden border border-zinc-200 bg-white shadow-xl shadow-zinc-200/40 transition-all duration-300 transform hover:scale-[1.01]">
              
              {/* Window Header */}
              <div className="bg-zinc-50 px-4 py-3 flex gap-1.5 border-b border-zinc-200 items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-300" />
                  <div className="w-3 h-3 rounded-full bg-zinc-300" />
                  <div className="w-3 h-3 rounded-full bg-zinc-300" />
                </div>
                <span className="text-[11px] font-mono font-medium text-zinc-400 tracking-tight">
                  pulse_engine_session
                </span>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Code Content Canvas */}
              <div className="bg-zinc-950 p-6 min-h-64 font-mono text-xs leading-6 text-zinc-300">
                <div className="flex gap-2 text-indigo-400 mb-4">
                  <span className="select-none font-bold">&gt;</span>
                  <span className="text-zinc-400 font-bold">engine.log</span>
                </div>
                
                <div className="space-y-1">
                  <pre className="text-zinc-300 whitespace-pre-wrap font-mono">
                    {features[activeFeature].code}
                  </pre>
                  
                  {/* Status Prompt footer inside code canvas */}
                  <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center gap-2">
                    <span className="bg-indigo-500 text-white px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                      LIVE RUN
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      Executing user-mode reasoning sequence...
                    </span>
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