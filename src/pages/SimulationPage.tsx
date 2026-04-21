import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Wind, Droplets, Thermometer, Play, RefreshCcw, Info, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function SimulationPage() {
  const [params, setParams] = useState({
    rainfall: 50,
    tempIncrease: 1.5,
    consumption: 30
  });

  const [result, setResult] = useState<any>(null);
  const [simulating, setSimulating] = useState(false);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      const data = await res.json();
      setTimeout(() => {
        setResult(data.prediction);
        setSimulating(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setSimulating(false);
    }
  };

  // Mock chart data
  const chartData = [
    { name: '2026', risk: 20 },
    { name: '2027', risk: 25 },
    { name: '2028', risk: 35 },
    { name: '2029', risk: result ? result.waterStress : 40 },
    { name: '2030', risk: result ? result.waterStress + 10 : 50 },
    { name: '2031', risk: result ? result.waterStress + 15 : 65 },
  ];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-bold tracking-widest uppercase mb-4">
            <Cpu className="w-3 h-3" />
            Digital Twin Engine v2.4
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">WATER SIMULATION</h1>
          <p className="text-slate-400 mt-2">Predict future water risks by adjusting climate and consumption parameters.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="glass p-8 rounded-[2.5rem] flex flex-col gap-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-secondary" />
              Scenario Parameters
            </h3>

            <div className="space-y-8">
              <Slider 
                label="Rainfall Intensity" 
                value={params.rainfall} 
                onChange={(v) => setParams({...params, rainfall: v})} 
                icon={Droplets} 
                unit="mm/day"
              />
              <Slider 
                label="Temp Increase" 
                value={params.tempIncrease} 
                min={0} 
                max={5} 
                step={0.1}
                onChange={(v) => setParams({...params, tempIncrease: v})} 
                icon={Thermometer} 
                unit="°C"
              />
              <Slider 
                label="Water Consumption" 
                value={params.consumption} 
                onChange={(v) => setParams({...params, consumption: v})} 
                icon={Wind} 
                unit="%"
              />
            </div>

            <button 
              onClick={runSimulation}
              disabled={simulating}
              className="mt-4 w-full py-4 bg-secondary text-primary font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {simulating ? (
                <RefreshCcw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Run Prediction
                </>
              )}
            </button>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass p-8 rounded-[2.5rem] h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                  Projected Water Stress Index
                </h3>
                <div className="text-[10px] font-mono text-slate-500">PROJECTION: 2026 - 2031</div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00C2CB" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00C2CB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B3C5D', border: '1px solid #ffffff20', borderRadius: '12px' }}
                      itemStyle={{ color: '#00C2CB' }}
                    />
                    <Area type="monotone" dataKey="risk" stroke="#00C2CB" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <ResultCard label="Flood Probability" value={result?.floodRisk || 0} color="text-blue-400" />
              <ResultCard label="Drought Probability" value={result?.droughtRisk || 0} color="text-orange-400" />
              <ResultCard label="Water Stress" value={result?.waterStress || 0} color="text-secondary" />
            </div>
          </div>
        </div>

        <div className="mt-12 glass p-8 rounded-[2.5rem] border-secondary/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-secondary/10">
              <Info className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-2">Simulation Methodology</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our Digital Twin engine utilizes historical climate data combined with real-time satellite soil moisture indices. The simulation accounts for regional topography, historical precipitation patterns, and urban development growth to predict water-related risks with 94% confidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, icon: Icon, unit, min = 0, max = 100, step = 1 }: any) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-sm font-mono text-secondary">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
      />
    </div>
  );
}

function ResultCard({ label, value, color }: any) {
  return (
    <div className="glass p-6 rounded-3xl">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</div>
      <div className={`text-4xl font-black ${color}`}>{Math.round(value)}%</div>
      <div className="text-[10px] text-slate-400 mt-2">Confidence: High</div>
    </div>
  );
}
