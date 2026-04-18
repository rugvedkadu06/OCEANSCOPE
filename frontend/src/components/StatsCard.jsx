// src/components/StatsCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function StatsCard({ icon: Icon, label, value, color, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-panel p-6 rounded-xl border-l-[4px] ${color} group flex items-center justify-between gap-6 hover:bg-white/[0.02] transition-all`}
    >
      <div className="flex items-center gap-4">
        <div className="size-12 bg-white/5 rounded-full flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
          <Icon size={24} className="text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.direction === "increasing" ? "text-emerald-400" : "text-rose-400"}`}>
               <span className="material-symbols-outlined text-[14px]">{trend.direction === "increasing" ? "trending_up" : "trending_down"}</span>
               {trend.direction === "increasing" ? "UP-TRAJECTORY" : "DOWN-SHIFT"}
            </div>
          )}
        </div>
      </div>

      <div className="text-right">
        <h3 className="text-3xl font-black text-white headline italic tracking-tighter">{value}</h3>
        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Calculated Node Output</p>
      </div>
    </motion.div>
  );
}
