import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, Users, AlertTriangle, Globe, TrendingUp, Droplets, Thermometer, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zone } from '../types';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/zones')
      .then(res => res.json())
      .then(data => {
        setZones(data);
        setLoading(false);
      });
  }, []);

  const riskData = [
    { name: 'High', value: zones.filter(z => z.risk_level === 'High').length },
    { name: 'Medium', value: zones.filter(z => z.risk_level === 'Medium').length },
    { name: 'Low', value: zones.filter(z => z.risk_level === 'Low').length },
  ];

  const COLORS = ['#FF4D4D', '#F27D26', '#2ECC71'];

  const regionalData = [
    { name: 'North', flood: 45, drought: 20 },
    { name: 'South', flood: 15, drought: 85 },
    { name: 'East', flood: 65, drought: 30 },
    { name: 'West', flood: 30, drought: 45 },
    { name: 'Central', flood: 55, drought: 40 },
  ];

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-bold tracking-widest uppercase mb-4">
            <LayoutDashboard className="w-3 h-3" />
            Government Authority Access
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">REGIONAL OVERVIEW</h1>
          <p className="text-slate-400 mt-2">Aggregated water intelligence metrics for EU environmental agencies.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Monitored Zones" value={zones.length} icon={Globe} color="text-secondary" />
          <StatCard label="Active Alerts" value={3} icon={AlertTriangle} color="text-alert" />
          <StatCard label="Avg Soil Moisture" value="42.5%" icon={Droplets} color="text-blue-400" />
          <StatCard label="Satellites Online" value={12} icon={Activity} color="text-safe" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Risk Distribution */}
          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-secondary" />
              Risk Level Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B3C5D', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {riskData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-slate-400">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Trends */}
          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <Activity className="w-5 h-5 text-secondary" />
              Regional Risk Comparison
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B3C5D', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  />
                  <Bar dataKey="flood" fill="#00C2CB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="drought" fill="#F27D26" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-xs text-slate-400">Flood Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-400" />
                <span className="text-xs text-slate-400">Drought Risk</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zone Table */}
        <div className="mt-12 glass p-8 rounded-[2.5rem] overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-8">Monitored Zones Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Zone Name</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Risk Level</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Coordinates</th>
                  <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Last Scan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {zones.map((zone) => (
                  <tr key={zone.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-4 text-sm font-bold text-white">{zone.name}</td>
                    <td className="py-4">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        zone.risk_level === 'High' ? 'bg-alert/10 text-alert' : zone.risk_level === 'Medium' ? 'bg-orange-400/10 text-orange-400' : 'bg-safe/10 text-safe'
                      )}>
                        {zone.risk_level}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-mono text-slate-400">{zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</td>
                    <td className="py-4 text-xs text-slate-500">{new Date(zone.last_scan).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="glass p-6 rounded-3xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-white/5">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-3xl font-black text-white">{value}</div>
    </div>
  );
}
