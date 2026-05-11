import { Zap, Plus } from "lucide-react";
import PulseFanRotate from "../auth/rotating-logo";
import { BladeFan } from "../../../public/icon/bladeFan";

const pressLogos = [
  {
    id: "forbes",
    node: (
      <span className="flex items-baseline gap-1">
        <span className="text-[15px] font-black italic tracking-tight text-slate-800">Forbes</span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Africa</span>
      </span>
    ),
  },
  {
    id: "techcrunch",
    node: (
      <span className="flex items-center gap-1.5">
        <span className="text-[13px] font-black text-white bg-[#1a9641] px-1.5 py-0.5 rounded">TC</span>
        <span className="text-[14px] font-bold text-slate-800">TechCrunch</span>
      </span>
    ),
  },
  {
    id: "guardian",
    node: (
      <span className="flex items-center gap-1.5">
        <span className="text-[11px] text-slate-400">⚑</span>
        <span className="text-[14px] font-medium text-slate-800 font-serif">TheGuardian</span>
      </span>
    ),
  },
  {
    id: "techpoint",
    node: (
      <span className="flex items-baseline gap-1">
        <span className="text-[14px] font-bold text-slate-800">◉ Techpoint</span>
        <span className="text-[10px] font-medium text-slate-500">Africa</span>
      </span>
    ),
  },
  {
    id: "techcity",
    node: (
      <span className="text-[13px] font-black tracking-[0.2em] text-slate-800 uppercase">
        TechCity
      </span>
    ),
  },
];

export default function PressSection() {
  return (
    <section className="bg-white">
      {/* AS SEEN ON strip */}
      <div className="border-b border-slate-100 px-8 md:px-16 py-5">
        <div className="mx-auto flex items-center justify-between overflow-x-auto">
          <span className="shrink-0 text-[10px] font-semibold tracking-[0.18em] text-slate-400 uppercase">
            As seen on
          </span>
          <div className="flex items-center gap-6">
            {pressLogos.map((logo, i) => (
              <div key={logo.id} className="flex items-center gap-6">
                {i > 0 && <span className="h-4 w-px bg-slate-200 block" />}
                {logo.node}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main hero content */}
      <div className="relative max-w-5xl mx-auto px-6 py-28 text-center overflow-hidden">
        {/* Scattered sparkle decorators */}
        <Plus
          size={20}
          strokeWidth={1.5}
          className="absolute top-20 left-10 text-slate-300 md:left-20"
        />
        <Plus
          size={13}
          strokeWidth={1.5}
          className="absolute top-36 right-16 text-purple-300 md:right-32"
        />
        <Plus
          size={16}
          strokeWidth={1.5}
          className="absolute bottom-32 left-20 text-blue-200 md:left-40"
        />
        <Plus
          size={11}
          strokeWidth={1.5}
          className="absolute bottom-20 right-12 text-slate-300 md:right-28"
        />

        {/* Certification badge */}
        <div className="flex justify-center mb-12">
          <div className="relative flex h-25 w-25 items-center justify-center">
            <div
          className="absolute top-0 left-0 z-20 animate-spin"
          style={{ animationDuration: "1s" }}
        >
          <BladeFan color="#7a1c1c" size={100}/>
        </div>
          </div>
        </div>

        {/* Main heading */}
        <h2 className="text-6xl md:text-[80px] font-black leading-none tracking-tight text-slate-900 mb-3">
          No Limits, No Borders
        </h2>

        {/* Subline with toggle widget */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="text-5xl md:text-[72px] font-black leading-none tracking-tight text-[#6d28d9]">
            Go global
          </span>

          {/* Toggle-switch widget */}
          <div className="flex h-14 w-24 items-center rounded-full bg-slate-100 p-1 shadow-inner">
            <div className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 shadow-lg">
              <Zap size={20} className="text-white" fill="white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
