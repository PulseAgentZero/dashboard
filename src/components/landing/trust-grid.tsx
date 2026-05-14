import {
  Activity,
  Package,
  Truck,
  ShoppingBag,
  Landmark,
  CreditCard,
  Building2,
  Zap,
  Leaf,
  FileEdit,
} from "lucide-react";
import { Github } from "../../../public/icon/github";
import { BladeFan } from "../../../public/icon/bladeFan";

export default function TrustGrid() {
  const sectors = [
    { name: "Healthcare", icon: <Activity className="w-6 h-6" /> },
    { name: "FMCG", icon: <Package className="w-6 h-6" /> },
    { name: "Logistics", icon: <Truck className="w-6 h-6" /> },
    { name: "Retail", icon: <ShoppingBag className="w-6 h-6" /> },
    { name: "Public", icon: <Landmark className="w-6 h-6" /> },
    { name: "Fintech", icon: <CreditCard className="w-6 h-6" /> },
    { name: "Banking", icon: <Building2 className="w-6 h-6" /> },
    { name: "Private", icon: <Landmark className="w-6 h-6" /> },
    { name: "Insurance", icon: <FileEdit className="w-6 h-6" /> },
    { name: "Energy", icon: <Zap className="w-6 h-6" /> },
    { name: "AgriTech", icon: <Leaf className="w-6 h-6" /> },
  ];

  return (
    <div className="bg-black text-white px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid - Matches Screenshot 2026-05-13 at 11.47.47 PM.png */}
        <div className="grid grid-cols-2 md:grid-cols-6 border-t border-l border-zinc-800">
          {/* Headline Cell */}
          <div className="col-span-1 p-8 flex items-center border-r border-b border-zinc-800 min-h-[160px]">
            <p className="text-zinc-400 text-sm leading-relaxed">
              Intelligence layer for <br />
              <span className="text-zinc-200">operations </span>
              <span className="text-zinc-500 italic">that never sleep.</span>
            </p>
          </div>

          {/* Logo Cells */}
          {sectors.map((partner, index) => (
            <div
              key={index}
              className="col-span-1 p-8 flex items-center justify-center border-r border-b border-zinc-800 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all cursor-default"
            >
              <div className="flex items-center gap-2">
                {partner.icon}
                <span className="font-bold tracking-tight text-xl">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Bar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-12 text-center md:text-left">
          <div className="animate-spin" style={{ animationDuration: "1s" }}>
            <BladeFan color="white" strokeWidth={3} size={28} />
            {/* <div className="w-full h-full bg-linear-to-tr from-zinc-700 to-zinc-900" /> */}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-600 text-xl font-serif">“</span>
            <p className="text-zinc-300 text-sm md:text-base">
              Pulse is the first platform that actually lets us hear what our
              operational data is trying to tell us.
              <span className="text-zinc-600 text-xl font-serif"> &quot;</span>
            </p>
          </div>
          <div className="animate-spin" style={{ animationDuration: "1s" }}>
            <BladeFan color="white" strokeWidth={3} size={28} />
            {/* <div className="w-full h-full bg-linear-to-tr from-zinc-700 to-zinc-900" /> */}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-xs text-zinc-400">
                {/* <span className="text-zinc-200 font-medium">
                  It’s like giving our database a voice
                </span> */}
              </p>
            </div>

            {/* <div className="flex items-center gap-1 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-zinc-400 uppercase tracking-widest">
              <Github />
              GitHub
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
