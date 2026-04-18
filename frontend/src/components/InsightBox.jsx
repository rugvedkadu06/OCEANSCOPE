// src/components/InsightBox.jsx
import React from "react";
import { Terminal } from "lucide-react";

export default function InsightBox({ text }) {
  return (
    <div className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-none p-8 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
      <div className="flex items-start gap-6">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-none">
          <Terminal className="text-primary" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-1 border border-zinc-800 bg-zinc-900">
              System Observation Engine v2.0
            </span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-red-500/50 rounded-full" />
              <div className="w-2 h-2 bg-yellow-500/50 rounded-full" />
              <div className="w-2 h-2 bg-green-500/50 rounded-full" />
            </div>
          </div>
          <p className="text-xl font-bold text-white leading-relaxed font-mono">
            <span className="text-primary mr-2">{">>>"}</span>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
