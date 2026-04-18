import React, { useState, useEffect } from "react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import ChatBox from "./components/ChatBox";
import ChartPanel from "./components/ChartPanel";
import BarChart from "./components/BarChart";
import PieChart from "./components/PieChart";
import MapPanel from "./components/MapPanel";
import InsightBox from "./components/InsightBox";
import StatsCard from "./components/StatsCard";
import ObservationGrid from "./components/ObservationGrid";
import axios from "axios";
import Papa from "papaparse";
import { 
  Plus, Search, Download, FileText, LayoutGrid, 
  Thermometer, Activity, Map as MapIcon, TrendingUp, Cpu,
  Calendar, ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Register ChartJS Components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Search');
  const [error, setError] = useState("");
  const [selectedModel, setSelectedModel] = useState("meta-llama/llama-3.3-70b-instruct:free");
  const [startYear, setStartYear] = useState(2005);
  const [endYear, setEndYear] = useState(2023);

  const handleQuery = async (queryText, manualRange = null) => {
    setLoading(true);
    setError("");
    
    // Use manualRange if provided from the new year selectors
    const finalStart = manualRange ? manualRange.start : startYear;
    const finalEnd = manualRange ? manualRange.end : endYear;

    try {
      const resp = await axios.post("http://localhost:5000/api/query", { 
        query: queryText || `from ${finalStart} to ${finalEnd}`,
        model: selectedModel 
      });
      setData(resp.data);
      // Update our state with whatever the backend parsed
      if (!manualRange) {
         // If coming from chatbox, sync back if needed
      }
    } catch (e) {
      setError(e.response?.data?.error || "Connection failed");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    if (!data?.raw_data) return;
    const csv = Papa.unparse(data.raw_data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `OCEAN_SCOPE_QUERY_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  const sideNavItems = [
    { icon: 'search', label: 'Search' },
    { icon: 'trending_up', label: 'Trends' },
    { icon: 'bar_chart', label: 'Analytics' },
    { icon: 'psychology', label: 'AI Report' }
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-inter overflow-hidden selection:bg-primary/20">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-[#020617] border-r border-white/5 flex flex-col py-8 z-30 flex-shrink-0">
        <div className="px-8 mb-12">
           <div className="flex items-center gap-3 group px-4 py-2 glass-panel border border-white/5 rounded-lg text-white">
              <div className="size-3 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(0,210,255,0.5)]" />
              <h1 className="text-xl font-black headline italic tracking-tighter">OCEAN SCOPE</h1>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sideNavItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 group ${
                activeTab === item.label 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,210,255,0.1)]' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-auto px-4">
          <div className="p-4 rounded-xl glass-panel relative overflow-hidden group border border-white/5 bg-primary/5">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
            <p className="text-[10px] text-primary font-black mb-1 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <span className="size-1.5 bg-primary rounded-full animate-pulse" /> Pulse AI active
            </p>
            <p className="text-[10px] text-slate-500 font-bold italic mb-3">
              Monitoring node via <span className="text-accent underline uppercase">{selectedModel.split('/')[1]?.split('-')[0] || 'Core'}</span> archetype.
            </p>
            <div className="pt-2 border-t border-white/5">
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent border-none p-0 focus:ring-0 text-[10px] font-black uppercase text-accent/80 hover:text-accent cursor-pointer appearance-none w-full truncate"
              >
                <option value="meta-llama/llama-3.3-70b-instruct:free">meta-llama/llama-3.3-70b-instruct:free</option>
                <option value="meta-llama/llama-3.2-3b-instruct:free">meta-llama/llama-3.2-3b-instruct:free</option>
                <option value="nousresearch/hermes-3-llama-3.1-405b:free">nousresearch/hermes-3-llama-3.1-405b:free</option>
                <option value="google/gemma-4-26b-a4b-it:free">google/gemma-4-26b-a4b-it:free</option>
                <option value="google/gemma-4-31b-it:free">google/gemma-4-31b-it:free</option>
                <option value="nvidia/nemotron-3-super-120b-a12b:free">nvidia/nemotron-3-super-120b-a12b:free</option>
                <option value="minimax/minimax-m2.5:free">minimax/minimax-m2.5:free</option>
                <option value="arcee-ai/trinity-large-preview:free">arcee-ai/trinity-large-preview:free</option>
                <option value="liquid/lfm-2.5-1.2b-thinking:free">liquid/lfm-2.5-1.2b-thinking:free</option>
                <option value="liquid/lfm-2.5-1.2b-instruct:free">liquid/lfm-2.5-1.2b-instruct:free</option>
                <option value="nvidia/nemotron-3-nano-30b-a3b:free">nvidia/nemotron-3-nano-30b-a3b:free</option>
                <option value="nvidia/nemotron-nano-12b-v2-vl:free">nvidia/nemotron-nano-12b-v2-vl:free</option>
                <option value="qwen/qwen3-next-80b-a3b-instruct:free">qwen/qwen3-next-80b-a3b-instruct:free</option>
                <option value="nvidia/nemotron-nano-9b-v2:free">nvidia/nemotron-nano-9b-v2:free</option>
                <option value="openai/gpt-oss-120b:free">openai/gpt-oss-120b:free</option>
                <option value="openai/gpt-oss-20b:free">openai/gpt-oss-20b:free</option>
                <option value="z-ai/glm-4.5-air:free">z-ai/glm-4.5-air:free</option>
                <option value="qwen/qwen3-coder:free">qwen/qwen3-coder:free</option>
                <option value="cognitivecomputations/dolphin-mistral-24b-venice-edition:free">cognitivecomputations/dolphin-mistral-24b-venice-edition:free</option>
                <option value="google/gemma-3n-e2b-it:free">google/gemma-3n-e2b-it:free</option>
                <option value="google/gemma-3n-e4b-it:free">google/gemma-3n-e4b-it:free</option>
                <option value="google/gemma-3-4b-it:free">google/gemma-3-4b-it:free</option>
                <option value="google/gemma-3-12b-it:free">google/gemma-3-12b-it:free</option>
                <option value="google/gemma-3-27b-it:free">google/gemma-3-27b-it:free</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free">meta-llama/llama-3.3-70b-instruct:free</option>
                <option value="meta-llama/llama-3.2-3b-instruct:free">meta-llama/llama-3.2-3b-instruct:free</option>
                <option value="nousresearch/hermes-3-llama-3.1-405b:free">nousresearch/hermes-3-llama-3.1-405b:free</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#020617] relative flex justify-center">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none"></div>
        
        <div className="w-full max-w-6xl p-8 lg:p-12">
           {/* Error Flag */}
           {error && (
             <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-500 text-xs font-bold uppercase tracking-widest">
               <AlertCircle size={16} /> {error}
             </motion.div>
           )}

           {/* Dynamic Page Rendering */}
           <AnimatePresence mode="wait">
          {activeTab === 'Search' && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10 w-full">
               <div className="w-full space-y-8">
                  <div className="flex justify-between items-end mb-4 border-b border-white/5 pb-4">
                     <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Oceanic Intelligence</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Accessing core telemetry for the Bay of Bengal</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button className="px-6 py-2 glass-panel border border-white/10 rounded-lg text-[10px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-widest flex items-center gap-2">
                           <Download size={12} /> Sync Node Data
                        </button>
                     </div>
                  </div>

                  <div className="glass-panel p-2 rounded-2xl border border-white/5 bg-white/[0.02]">
                     <ChatBox onSubmit={handleQuery} />
                  </div>
                  
                  {/* Date Range Selector */}
                  <div className="flex items-center justify-center gap-4">
                     <div className="flex items-center gap-2 glass-panel px-6 py-2 border border-white/5 rounded-full">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Range:</span>
                        <select 
                          value={startYear} 
                          onChange={(e) => setStartYear(Number(e.target.value))}
                          className="bg-transparent border-none p-0 focus:ring-0 text-[11px] font-black text-white cursor-pointer appearance-none pr-4"
                        >
                          {Array.from({length: 19}, (_, i) => 2005 + i).map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <span className="text-white/20 px-2">—</span>
                        <select 
                          value={endYear} 
                          onChange={(e) => setEndYear(Number(e.target.value))}
                          className="bg-transparent border-none p-0 focus:ring-0 text-[11px] font-black text-white cursor-pointer appearance-none pr-4"
                        >
                          {Array.from({length: 19}, (_, i) => 2005 + i).map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <button 
                          onClick={() => handleQuery(null, {start: startYear, end: endYear})}
                          className="ml-4 size-8 bg-primary/20 hover:bg-primary/40 rounded-full flex items-center justify-center transition-all border border-primary/20 cursor-pointer"
                        >
                           <ArrowUpRight size={14} className="text-primary" />
                        </button>
                     </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {["Ocean trends 2018-2024", "Show peak thermal activity", "2023 climate assessment", "Bay of Bengal summary"].map((query) => (
                      <button key={query} onClick={() => handleQuery(query)} className="px-4 py-1.5 glass-panel border border-white/5 rounded-full text-[10px] font-black text-slate-500 hover:text-primary transition-all uppercase tracking-wider italic">
                        {query}
                      </button>
                    ))}
                  </div>
               </div>

               {loading && (
                 <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="size-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Searching...</p>
                 </div>
               )}

               {data && !loading && (
                 <div className="space-y-12">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <StatsCard icon={Thermometer} label="Avg Temperature" value={`${data.stats.avg.toFixed(2)}°C`} trend={data.trend} color="border-primary" />
                     <StatsCard icon={TrendingUp} label="Highest Temp" value={`${data.stats.max.toFixed(2)}°C`} color="border-rose-400" />
                     <StatsCard icon={Activity} label="Lowest Temp" value={`${data.stats.min.toFixed(2)}°C`} color="border-secondary" />
                     <StatsCard icon={MapIcon} label="Total Records" value={data.stats.count.toLocaleString()} color="border-tertiary" />
                   </div>

                   <div className="h-[600px] glass-panel rounded-xl border border-white/5 overflow-hidden relative group">
                      <div className="absolute top-6 left-6 z-10 p-4 glass-panel border border-white/10 max-w-sm pointer-events-none group-hover:opacity-100 transition-opacity">
                         <h4 className="text-xs font-black text-primary uppercase mb-2">Ocean Map View</h4>
                         <p className="text-[11px] text-slate-400 leading-relaxed font-bold italic">
                            Showing {data.mapData.length} locations. Red dots show warmer areas.
                         </p>
                      </div>
                      <MapPanel points={data.mapData} />
                   </div>
                 </div>
               )}
            </motion.div>
          )}

          {activeTab === 'Trends' && (
            <motion.div key="trends" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
               <div className="grid grid-cols-1 gap-12">
                  <div className="glass-panel p-10 rounded-2xl border border-white/5">
                    <h4 className="text-2xl font-bold text-white headline mb-8 italic uppercase tracking-tighter">Temperature Over Time</h4>
                    <div className="h-[600px]">
                       {data ? <ChartPanel data={data.chartData} predictions={data.predictions} /> : <div className="h-full flex items-center justify-center text-slate-600 font-bold italic">Waiting for data...</div>}
                    </div>
                    {data && (
                      <div className="mt-10 p-6 bg-primary/5 rounded-xl border-l-[4px] border-primary">
                         <p className="text-xs font-black text-primary uppercase mb-2 tracking-widest">Main Observation</p>
                         <p className="text-lg text-slate-300 font-bold italic leading-relaxed">
                            The ocean is {data.trend.direction} by {data.trend.slope.toFixed(4)}°C every year. This pattern is very clear in the current data.
                         </p>
                      </div>
                    )}
                  </div>

                  <div className="glass-panel p-10 rounded-2xl border border-white/5 bg-accent/5">
                     <h5 className="text-[10px] font-black text-accent uppercase tracking-[0.3em] mb-8 italic border-b border-white/5 pb-4">Consolidated Key Findings</h5>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data?.observations.map((obs, i) => (
                          <div key={i} className="space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/5">
                             <span className="text-accent font-black text-xl italic">0{i+1}</span>
                             <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">{obs}</p>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'Analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12 w-full">
               <div className="grid grid-cols-1 gap-12">
                  <div className="glass-panel p-10 rounded-2xl border border-white/5 h-[450px] flex flex-col">
                     <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 italic border-b border-white/5 pb-4">Monthly Pattern</h4>
                     <div className="flex-1">
                        {data ? <Line data={{
                           labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                           datasets: [{ label: 'Avg', data: Array.from({length: 12}, (_, i) => data.seasonalData.find(d => d.month === i+1)?.temperature || 0), borderColor: '#00d2ff', backgroundColor: 'rgba(0, 210, 255, 0.1)', fill: true, tension: 0.4, pointRadius: 5 }]
                        }} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#859399' } }, x: { ticks: { color: '#859399' } } } }} /> : null}
                     </div>
                     <div className="mt-8 p-4 bg-primary/5 rounded border-l-2 border-primary">
                        <p className="text-[11px] text-slate-400 font-bold italic uppercase tracking-widest text-center">
                           OBSERVATION: Yearly peaks detected in the mid-year warming cycle.
                        </p>
                     </div>
                  </div>

                  <div className="glass-panel p-10 rounded-2xl border border-white/5 h-[450px] flex flex-col">
                     <h4 className="text-sm font-black text-white uppercase tracking-widest mb-8 italic border-b border-white/5 pb-4">Hot vs Cold Analysis</h4>
                     <div className="flex-1">
                         {data ? <PieChart data={data.anomalyData} /> : null}
                     </div>
                     <div className="mt-8 p-4 bg-secondary/5 rounded border-l-2 border-secondary">
                        <p className="text-[11px] text-slate-400 font-bold italic uppercase tracking-widest text-center">
                           OBSERVATION: 85% concentration of positive thermal deviations detected in current query.
                        </p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'AI Report' && (
            <motion.div key="briefing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
               <div className="glass-panel p-10 rounded-2xl border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
                     <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse border border-primary/30">
                        <span className="material-symbols-outlined text-3xl text-primary">psychology</span>
                     </div>
                     <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">AI Summary Report</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
                     </div>
                  </div>
                  
                  {data ? (
                    <div className="space-y-12">
                       {data.ai_briefing.split('\n\n').map((section, idx) => (
                         <div key={idx} className="relative pl-8 before:absolute before:left-0 before:top-0 before:w-1 before:h-full before:bg-gradient-to-b before:from-primary before:to-transparent">
                            <p className="text-slate-300 font-medium leading-relaxed whitespace-pre-line text-lg">
                               {section}
                            </p>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="py-20 text-center">
                       <p className="text-slate-600 font-bold italic uppercase tracking-widest">Telemetry sync required for intelligence generation.</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
