"use client"
import React from 'react';
import { X, MessageSquare, ArrowRight } from 'lucide-react';
import { Github } from '../../../public/icon/github';
import { Linkedin } from '../../../public/icon/linkedin';

export default function MainFooter() {
  const navGroups = [
    ["Login", "Platform", "Solutions", "Enterprise"],
    ["Documentation", "API Reference", "Self-Hosting", "Connectors"],
    ["Security", "Terms of Service", "Privacy Policy", "Trust Center"],
    ["Changelog", "System Status", "Blog", "Open Source"]
  ];

  const socialLinks = [
    { icon: <X size={18} />, label: "X" },
    { icon: <Github />, label: "GitHub" },
    { icon: <Linkedin />, label: "LinkedIn" },
    { icon: <MessageSquare size={18} />, label: "Discord" }
  ];

  return (
    <footer className="bg-black text-zinc-500 font-sans border-t border-zinc-900">
      <div className="max-w-7xl mx-auto border-x border-zinc-900">
        
        {/* Main Grid Content */}
        <div className="grid grid-cols-12">
          
          {/* Navigation Grid (8 columns) */}
          <div className="col-span-12 md:col-span-8 grid grid-cols-2 md:grid-cols-4 border-b md:border-b-0 border-zinc-900">
            {navGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="border-r border-zinc-900 last:border-r-0 md:last:border-r-1">
                {group.map((item, itemIndex) => (
                  <div 
                    key={itemIndex} 
                    className="h-24 flex items-center px-8 border-b border-zinc-900 last:border-b-0 hover:text-white transition-all cursor-pointer group relative overflow-hidden"
                  >
                    {/* Hover Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                    
                    <span className="relative z-10 text-sm font-medium tracking-tight">
                      {item}
                    </span>

                    {/* Badge for high-priority links */}
                    {item === "Changelog" && (
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-black border border-zinc-800 rounded-full px-3 py-1 flex items-center gap-2 z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-all group-hover:right-4">
                        <span className="text-[10px] text-white font-bold uppercase tracking-widest italic">New</span>
                        <div className="bg-white rounded-full p-0.5">
                          <ArrowRight size={10} className="text-black" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Brand Visual (4 columns) */}
          <div className="col-span-12 md:col-span-4 relative h-auto border-b md:border-b-0 border-zinc-900 overflow-hidden group bg-zinc-950/20">
            
            {/* Pulsing Grid Layer */}
            <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
              <div 
                className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite]"
                style={{
                  backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
                  backgroundSize: '16px 16px',
                  maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                }} 
              />
            </div>
            
            <div className="relative h-full flex flex-col items-center justify-center p-12 py-20">
              <h2 className="text-white font-black text-6xl tracking-tighter uppercase text-center leading-[0.8] select-none italic">
                PULSE
              </h2>
              <p className="text-[9px] text-zinc-600 font-mono tracking-[0.5em] mt-4 uppercase">
                Intelligence Engine
              </p>
            </div>

            {/* Social Sidebar */}
            <div className="absolute right-0 top-0 bottom-0 w-16 border-l border-zinc-900 flex flex-col bg-black">
              {socialLinks.map((social, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer border-b border-zinc-900 last:border-b-0"
                  title={social.label}
                >
                  {social.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Footer - Centered and Clean */}
        <div className="py-12 border-t border-zinc-900 bg-zinc-950/30">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] text-zinc-600 font-medium tracking-wide">
              © 2026 Pulse Intelligence Engine. Built in Lagos for the World.
            </p>
            <div className="flex gap-6 text-[10px] text-zinc-700 uppercase tracking-widest font-bold">
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Status: Operational</span>
            </div>
          </div>
        </div>

      </div>

      {/* Tailwind handles the pulse, but we can add a custom refined one if needed */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
      `}</style>
    </footer>
  );
}