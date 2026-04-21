import React from 'react';
import { motion } from 'motion/react';
import { Shield, Satellite, Globe, Droplets, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-6">
              PREDICTING <br />
              <span className="text-secondary">WATER RISKS</span> <br />
              FROM SPACE
            </h1>
            <p className="text-xl text-slate-400 max-w-lg mb-10 leading-relaxed">
              Transforming global water management from reactive response into predictive intelligence using advanced Earth Observation data.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/map" className="px-8 py-4 bg-secondary text-primary font-bold rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform">
                Launch Intelligence Map
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-full bg-secondary/10 absolute inset-0 blur-3xl animate-pulse" />
            <img 
              src="https://picsum.photos/seed/earth-water/800/800" 
              alt="Earth Water Visualization" 
              className="relative z-10 rounded-3xl border border-white/10 shadow-2xl grayscale brightness-75 contrast-125"
              referrerPolicy="no-referrer"
            />
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 z-20 glass p-6 rounded-2xl shadow-2xl">
              <div className="text-3xl font-black text-secondary">98.4%</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Prediction Accuracy</div>
            </div>
            <div className="absolute -top-6 -right-6 z-20 glass p-6 rounded-2xl shadow-2xl">
              <div className="text-3xl font-black text-safe">24/7</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Satellite Monitoring</div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Flood Prediction",
              desc: "Early warning systems using soil moisture and precipitation anomalies.",
              icon: Droplets,
              color: "text-blue-400"
            },
            {
              title: "Drought Monitoring",
              desc: "Vegetation stress analysis and groundwater depletion tracking.",
              icon: Globe,
              color: "text-orange-400"
            },
            {
              title: "Pollution Tracking",
              desc: "Spectral analysis to detect chemical anomalies in major river basins.",
              icon: Shield,
              color: "text-emerald-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="glass p-8 rounded-3xl hover:bg-white/15 transition-colors group"
            >
              <feature.icon className={`w-12 h-12 ${feature.color} mb-6 group-hover:scale-110 transition-transform`} />
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
