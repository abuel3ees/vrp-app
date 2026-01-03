import React from "react";
import { motion } from "framer-motion";
import { Navigation, MapPin, Menu, Battery, Wifi } from "lucide-react";

export const MobileAppMockup = () => {
  return (
    <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-20"></div>

        {/* Status Bar */}
        <div className="flex justify-between px-6 py-3 text-[10px] text-white z-10 font-bold">
            <span>9:41</span>
            <div className="flex gap-1">
                <Wifi className="w-3 h-3"/>
                <Battery className="w-3 h-3"/>
            </div>
        </div>

        {/* App Header */}
        <div className="px-4 py-2 flex justify-between items-center bg-slate-800/50 backdrop-blur z-10">
            <Menu className="w-5 h-5 text-white"/>
            <span className="text-sm font-bold text-white">Quantum Driver</span>
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold">AD</div>
        </div>

        {/* Map Area (Simulated) */}
        <div className="flex-1 bg-slate-800 relative overflow-hidden group">
            {/* Map Grid */}
            <div className="absolute inset-0 opacity-20" 
                style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
            />
            
            {/* Streets */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-600 stroke-2 fill-none">
                <path d="M50 0 V600 M150 0 V600 M250 0 V600 M0 100 H300 M0 300 H300 M0 500 H300" opacity="0.3"/>
            </svg>

            {/* The Route Path */}
            <svg className="absolute inset-0 w-full h-full overflow-visible">
                <motion.path 
                    d="M 150 300 L 150 100 L 250 100 L 250 300 L 150 500"
                    stroke="#a855f7" 
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="1000"
                    strokeDashoffset="1000"
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
                />
            </svg>

            {/* Driver Marker */}
            <motion.div 
                className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-10"
                animate={{ 
                    x: [134, 134, 234, 234, 134], 
                    y: [284, 84, 84, 284, 484] 
                }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
            >
                <Navigation className="w-4 h-4 text-purple-600 fill-purple-600 transform rotate-0" />
            </motion.div>

            {/* Stops */}
            <div className="absolute top-[100px] left-[150px] -translate-x-1/2 -translate-y-1/2"><MapPin className="text-red-400 w-6 h-6"/></div>
            <div className="absolute top-[500px] left-[150px] -translate-x-1/2 -translate-y-1/2"><MapPin className="text-green-400 w-6 h-6"/></div>

            {/* Toast Notification */}
            <motion.div 
                className="absolute top-4 left-4 right-4 bg-slate-900/90 border border-purple-500/50 p-3 rounded-xl backdrop-blur-md shadow-xl z-20"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ delay: 1, type: "spring" }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                    <div>
                        <div className="text-xs text-slate-400">Route Optimized</div>
                        <div className="text-sm font-bold text-white">Savings: 12% Fuel</div>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Bottom Sheet */}
        <div className="h-32 bg-slate-900 p-4 rounded-t-3xl border-t border-white/5 z-10">
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4"/>
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-xs text-slate-500">Next Stop</div>
                    <div className="text-lg font-bold text-white">PSUT Main Gate</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500">ETA</div>
                    <div className="text-lg font-bold text-green-400">14 min</div>
                </div>
            </div>
            <div className="mt-4 w-full h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                Navigate
            </div>
        </div>
    </div>
  );
};