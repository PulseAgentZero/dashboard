"use client";
import { useState } from "react";
import { MousePointer2 } from "lucide-react";

export default function FeatureExplorer() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: "01",
      title: "Industry-Agnostic Modeling",
      cmd: "npx pulse init", // Keep the 'cmd' style for a "pro" feel
      description:
        "// Zero hardcoding. Describe your business in plain English and Pulse builds a custom behavior model on top of your schema.",
      code: "CONTEXT: Reading business_context.txt\nSCHEMA: Identified 'subscriber_id' as Primary Entity\nGOAL: Churn Reduction",
    },
    {
      id: "02",
      title: "Direct-to-Database Introspection",
      description:
        "// Data Sovereignty. Pulse connects to your live DB and reads metadata only. Your customer data never leaves your environment.",
      code: "CONNECTING: postgres://prod-db-01\nSTATUS: Read-only access granted\nMETADATA: 14 tables indexed, 0 rows copied.",
    },
    {
      id: "03",
      title: "Dynamic Query Reasoning",
      description:
        "// No SQL required. The agent translates natural language into optimized analytical queries against your live database.",
      code: "> Show me high-risk entities in Lagos\nSQL: SELECT * FROM entities WHERE risk_score > 0.8 AND location = 'Lagos'...",
    },
    {
      id: "04",
      title: "Conversational Action Drafts",
      description:
        "// Instant Intervention. The agent uses behavioral profiles to draft personalized retention messages or operational plans.",
      code: "ANALYZING: Entity ID 00445\nSIGNAL: 40% drop in usage\nDRAFTING: Personalized SMS...",
    },
    {
      id: "05",
      title: "Self-Hostable Infrastructure",
      description:
        "// Privacy First. Deploy the entire stack inside your own VPC using Docker or Kubernetes for total NDPR compliance.",
      code: "DEPLOYING: pulse-engine:latest\nNETWORK: Internal VPC only\nSECURITY: Fernet encryption active",
    },
  ];

  return (
    <div className="bg-black text-white min-h-screen p-8 font-mono selection:bg-zinc-800">
      <div className="max-w-7xl mx-auto border-x border-zinc-900">
        {/* Top Header Section - Matches Screenshot 2026-05-13 at 11.56.49 PM.jpg */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-y border-zinc-900">
          <div className="p-12 border-r border-zinc-900">
            <h2 className="text-xl text-zinc-400">
              / the enterprise intelligence layer.
            </h2>
          </div>
          <div className="p-10 bg-zinc-950/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-zinc-900">
          <div className="p-12 flex items-center border-r border-zinc-900">
            <p className="text-zinc-400 font-sans">
              Ships. Fixes. Tests. Refactors. Learns you, all the while.
            </p>
          </div>
          <div className="p-12 flex items-center gap-4">
            <button className="bg-white/90 text-black px-6 py-2 rounded-full flex items-center gap-2 font-sans font-bold hover:bg-zinc-400 transition-colors">
              Explore all features
            </button>
            <button className="border border-zinc-800 px-6 py-2 rounded-full font-sans font-medium hover:bg-zinc-900 transition-colors">
              Docs
            </button>
          </div>
        </div>

        {/* Feature Interaction Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-150">
          {/* Left Side: List */}
          <div className="border-r border-zinc-900">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                onMouseEnter={() => setActiveFeature(index)}
                className={`p-8 border-b border-zinc-900 cursor-none group transition-colors duration-300 ${
                  activeFeature === index
                    ? "bg-zinc-900/50"
                    : "hover:bg-zinc-900/30"
                }`}
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`text-xs ${activeFeature === index ? "text-zinc-400" : "text-zinc-700"}`}
                  >
                    {feature.id}
                  </span>
                  <h3
                    className={`text-lg transition-colors ${activeFeature === index ? "text-white" : "text-zinc-500"}`}
                  >
                    {feature.title}{" "}
                    {feature.cmd && (
                      <code className="text-sm bg-zinc-800/50 px-2 py-1 rounded ml-2">
                        {feature.cmd}
                      </code>
                    )}
                  </h3>
                </div>

                {/* Custom Cursor Indicator */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none fixed z-50 transition-opacity">
                  <MousePointer2
                    className="text-indigo-500 fill-indigo-500 -rotate-90 translate-x-4 translate-y-4"
                    size={20}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Dynamic Context & Laptop UI */}
          <div className="p-12 flex flex-col gap-6 bg-zinc-950/10">
            <div className="mb-3 transition-all duration-500 ease-in-out">
              <p className="text-zinc-400 leading-relaxed max-w-sm">
                <span className="text-white font-bold">
                  {features[activeFeature].description.split(".")[0]}.
                </span>
                {features[activeFeature].description
                  .split(".")
                  .slice(1)
                  .join(".")}
              </p>
            </div>

            {/* Laptop UI Terminal - Matches Screenshot 2026-05-13 at 11.56.49 PM.jpg */}
            <div className="rounded-lg overflow-hidden border border-zinc-800 shadow-2xl shadow-indigo-900/10 transition-transform duration-500 transform hover:scale-[1.02]">
              <div className="bg-[#00011f] px-4 py-2 flex gap-1.5 border-b border-zinc-800">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="text-[10px] text-zinc-500 ml-2">
                  ~/project
                </span>
              </div>
              <div className="bg-[#00005ab0] p-6 min-h-62.5 font-mono text-sm leading-6">
                <div className="flex gap-2 text-indigo-400 mb-4">
                  <span>&gt;</span>
                  <span className="text-zinc-300">cmd</span>
                </div>
                <div className="space-y-1">
                  <pre className="text-zinc-400 whitespace-pre-wrap">
                    {features[activeFeature].code}
                  </pre>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      PULSE
                    </span>
                    <span className="text-zinc-500">
                      Executing live reasoning against database...
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
