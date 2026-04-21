import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Map as MapIcon, LayoutDashboard, Bell, Cpu, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Map', path: '/map', icon: MapIcon },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Alerts', path: '/alerts', icon: Bell },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[5000] px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-secondary p-1.5 rounded-lg">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tighter text-white">SATELLES</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
                ${isActive ? 'bg-secondary text-primary font-bold' : 'text-slate-300 hover:bg-white/10'}
              `}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          ))}
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-24 left-6 right-6 glass rounded-2xl p-4 flex flex-col gap-2"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  ${isActive ? 'bg-secondary text-primary font-bold' : 'text-slate-300'}
                `}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
