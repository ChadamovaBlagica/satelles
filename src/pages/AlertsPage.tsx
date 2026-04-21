import React, { useEffect, useState } from 'react';
import { Alert } from '../types';
import { motion } from 'motion/react';
import { AlertTriangle, Bell, MapPin, Clock, ShieldAlert, CheckCircle2, Filter } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-alert/20 border border-alert/30 text-alert text-[10px] font-bold tracking-widest uppercase mb-4">
              <ShieldAlert className="w-3 h-3" />
              Live Monitoring Active
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">ALERT CENTER</h1>
            <p className="text-slate-400 mt-2">Real-time water risk notifications from the global satellite network.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="glass px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="glass px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
              <CheckCircle2 className="w-4 h-4" />
              Mark All Read
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="glass h-32 rounded-3xl animate-pulse" />
            ))
          ) : alerts.length > 0 ? (
            alerts.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "glass p-6 rounded-3xl border-l-4 flex flex-col md:flex-row gap-6 items-start md:items-center group hover:bg-white/15 transition-colors",
                  alert.severity === 'High' ? 'border-l-alert' : alert.severity === 'Medium' ? 'border-l-orange-400' : 'border-l-safe'
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  alert.severity === 'High' ? 'bg-alert/10 text-alert' : alert.severity === 'Medium' ? 'bg-orange-400/10 text-orange-400' : 'bg-safe/10 text-safe'
                )}>
                  <AlertTriangle className="w-8 h-8" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      alert.severity === 'High' ? 'text-alert' : alert.severity === 'Medium' ? 'text-orange-400' : 'text-safe'
                    )}>
                      {alert.severity} SEVERITY • {alert.type}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">#{alert.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{alert.message}</h3>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {alert.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                <button className="px-6 py-2 glass rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Details
                </button>
              </motion.div>
            ))
          ) : (
            <div className="glass p-12 rounded-[3rem] text-center">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white">No active alerts</h3>
              <p className="text-slate-400">All monitored zones are currently within safety parameters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
