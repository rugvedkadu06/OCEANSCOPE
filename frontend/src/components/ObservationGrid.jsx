// src/components/ObservationGrid.jsx
import React from "react";
import { motion } from "framer-motion";
import { Search, Info, Thermometer, Globe } from "lucide-react";

export default function ObservationGrid({ observations }) {
  const icons = [Search, Info, Thermometer, Globe];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      {observations.map((obs, idx) => {
        const Icon = icons[idx % icons.length];
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex gap-4 p-5 glass-panel border border-white/5 rounded-xl hover:bg-white/5 transition-all"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-surface-container-high border border-white/5 rounded-lg flex items-center justify-center">
              <Icon size={18} className="text-secondary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Telemetry Hash #{idx + 1}</p>
              <p className="text-on-surface/80 font-medium text-sm leading-relaxed antialiased">{obs}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
