import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';
import { AnalysisResult } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, Droplets, AlertTriangle, Thermometer, Satellite, Info } from 'lucide-react';

export default function MapPage() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <div className="h-screen pt-24 pb-6 px-6 flex flex-col md:flex-row gap-6 overflow-hidden">
      <div className="flex-1 relative">
        <MapComponent onAnalyze={setAnalysis} />
      </div>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-full md:w-96 glass-dark rounded-2xl p-6 flex flex-col gap-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Satellite className="w-5 h-5 text-secondary" />
                <span className="text-xs font-bold tracking-widest uppercase text-slate-400">Analysis Report</span>
              </div>
              <button 
                onClick={() => setAnalysis(null)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter mb-1">REGIONAL SCAN</h2>
              <p className="text-[10px] font-mono text-secondary">ID: {analysis.timestamp.slice(0, 8)}-{Math.random().toString(36).slice(2, 6).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <RiskCard 
                label="Flood Risk" 
                value={analysis.metrics.floodRisk} 
                icon={Droplets} 
                color={analysis.metrics.floodRisk > 70 ? 'text-alert' : analysis.metrics.floodRisk > 40 ? 'text-orange-400' : 'text-safe'}
              />
              <RiskCard 
                label="Drought Risk" 
                value={analysis.metrics.droughtRisk} 
                icon={Thermometer} 
                color={analysis.metrics.droughtRisk > 70 ? 'text-alert' : analysis.metrics.droughtRisk > 40 ? 'text-orange-400' : 'text-safe'}
              />
            </div>

            <div className="space-y-4">
              <MetricRow label="Soil Moisture" value={`${analysis.metrics.soilMoisture}%`} icon={Activity} />
              <MetricRow label="Water Level" value={`${analysis.metrics.waterLevel}m`} icon={Droplets} />
              <MetricRow label="Temp Anomaly" value={`${analysis.metrics.tempAnomaly}°C`} icon={Thermometer} />
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">AI Recommendation</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {(analysis as any).recommendation || "Normal environmental parameters detected. Continue routine satellite monitoring cycles."}
              </p>
            </div>

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>SENSOR: {analysis.satellite}</span>
                <span>{new Date(analysis.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!analysis && (
        <div className="hidden md:flex w-96 glass-dark rounded-2xl p-8 flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Crosshair className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ready for Scan</h3>
          <p className="text-sm text-slate-400">Click any location on the map to initiate a high-resolution satellite analysis.</p>
        </div>
      )}
    </div>
  );
}

function RiskCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      </div>
      <div className={`text-2xl font-black ${color}`}>{value}%</div>
      <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color.replace('text', 'bg')}`}
        />
      </div>
    </div>
  );
}

function MetricRow({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-white/5">
          <Icon className="w-4 h-4 text-slate-400" />
        </div>
        <span className="text-xs text-slate-300">{label}</span>
      </div>
      <span className="text-sm font-bold text-white">{value}</span>
    </div>
  );
}

function Crosshair({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  );
}
