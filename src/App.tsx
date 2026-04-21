import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import DashboardPage from './pages/DashboardPage';
import AlertsPage from './pages/AlertsPage';
import SimulationPage from './pages/SimulationPage';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen relative">
        <Navbar />
        
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/simulation" element={<SimulationPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Background Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
        </div>
      </div>
    </Router>
  );
}
