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
import { BladeFan } from "../../../public/icon/bladeFan";

export default function TrustGrid() {
  const sectors = [
    { name: "Healthcare", icon: <Activity className="w-5 h-5" /> },
    { name: "FMCG", icon: <Package className="w-5 h-5" /> },
    { name: "Logistics", icon: <Truck className="w-5 h-5" /> },
    { name: "Retail", icon: <ShoppingBag className="w-5 h-5" /> },
    { name: "Public", icon: <Landmark className="w-5 h-5" /> },
    { name: "Fintech", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Banking", icon: <Building2 className="w-5 h-5" /> },
    { name: "Private", icon: <Landmark className="w-5 h-5" /> },
    { name: "Insurance", icon: <FileEdit className="w-5 h-5" /> },
    { name: "Energy", icon: <Zap className="w-5 h-5" /> },
    { name: "AgriTech", icon: <Leaf className="w-5 h-5" /> },
  ];

  return (
    <div className="bg-white text-zinc-900 px-4 font-sans py-16">
      <div className="max-w-7xl mx-auto">
        {/* Main Grid - Light Industrial Borders */}
        <div className="grid grid-cols-2 md:grid-cols-6 border-t border-l border-zinc-200">
          
          {/* Headline Cell */}
          <div className="col-span-1 p-8 flex items-center bg-zinc-50/50 border-r border-b border-zinc-200 min-h-[160px]">
            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
              Intelligence layer for <br />
              <span className="text-zinc-900 font-bold">operations </span>
              <span className="text-zinc-400 italic">that never sleep.</span>
            </p>
          </div>

          {/* Logo Cells */}
          {sectors.map((partner, index) => (
            <div
              key={index}
              className="col-span-1 p-8 flex items-center justify-center border-r border-b border-zinc-200 text-zinc-400 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:text-indigo-600 hover:bg-zinc-50/30 transition-all duration-200 cursor-default"
            >
              <div className="flex items-center gap-2.5">
                {partner.icon}
                <span className="font-bold tracking-tight text-lg text-zinc-800 transition-colors">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Bar - Clean Light Sub-block */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-16 text-center md:text-left rounded-2xl max-w-4xl mx-auto">
          <div className="animate-spin text-zinc-400" style={{ animationDuration: "12s" }}>
            <BladeFan color="#a1a1aa" strokeWidth={2.5} size={24} />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-zinc-300 text-2xl font-serif leading-none">“</span>
            <p className="text-zinc-600 text-sm md:text-base font-medium">
              Pulse is the first platform that actually lets us hear what our
              operational data is trying to tell us.
              <span className="text-zinc-300 text-2xl font-serif leading-none"> ”</span>
            </p>
          </div>
          
          <div className="animate-spin text-zinc-400" style={{ animationDuration: "12s" }}>
            <BladeFan color="#a1a1aa" strokeWidth={2.5} size={24} />
          </div>
        </div>

      </div>
    </div>
  );
}