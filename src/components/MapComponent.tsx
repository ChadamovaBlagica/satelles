import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AnalysisResult, Zone } from '../types';
import { Satellite, Activity, Droplets, AlertTriangle, Thermometer, Wind, Crosshair, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  onAnalyze: (result: AnalysisResult) => void;
}

export default function MapComponent({ onAnalyze }: MapProps) {
  const [zones, setZones] = useState<Zone[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetch('/api/zones')
      .then(res => res.json())
      .then(setZones);
  }, []);

  function MapEvents() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedPos([lat, lng]);
        handleAnalyze(lat, lng);
      },
    });
    return null;
  }

  const handleAnalyze = async (lat: number, lng: number) => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng })
      });
      const data = await res.json();
      // Simulate satellite scan delay
      setTimeout(() => {
        onAnalyze(data);
        setAnalyzing(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setAnalyzing(false);
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <MapContainer 
        center={[50, 10]} 
        zoom={4} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents />
        
        {zones.map(zone => (
          <Circle
            key={zone.id}
            center={[zone.lat, zone.lng]}
            radius={50000}
            pathOptions={{
              fillColor: zone.risk_level === 'High' ? '#FF4D4D' : zone.risk_level === 'Medium' ? '#F27D26' : '#2ECC71',
              color: 'transparent',
              fillOpacity: 0.3
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <h3 className="font-bold text-primary">{zone.name}</h3>
                <p className="text-xs text-slate-600">Risk Level: {zone.risk_level}</p>
                <p className="text-[10px] text-slate-400">Last Scan: {new Date(zone.last_scan).toLocaleDateString()}</p>
              </div>
            </Popup>
          </Circle>
        ))}

        {selectedPos && (
          <Marker position={selectedPos}>
            <Popup>Analysis Point</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
        <div className="glass-dark p-4 rounded-xl flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-medium tracking-widest uppercase">Live Satellite Feed</span>
        </div>
      </div>

      <AnimatePresence>
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[2000] bg-primary/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-secondary animate-spin" />
                <Satellite className="w-6 h-6 text-white absolute inset-0 m-auto" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold tracking-tighter text-white">SATELLITE SCANNING</span>
                <span className="text-xs text-secondary/80 font-mono">ESTABLISHING GALILEO LINK...</span>
              </div>
              
              {/* Scanning lines animation */}
              <motion.div 
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-secondary/50 shadow-[0_0_15px_rgba(0,194,203,0.8)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 right-6 z-[1000] glass-dark p-3 rounded-lg text-[10px] font-mono text-slate-400">
        LAT: {selectedPos ? selectedPos[0].toFixed(4) : '--.----'} | 
        LNG: {selectedPos ? selectedPos[1].toFixed(4) : '--.----'}
      </div>
    </div>
  );
}
