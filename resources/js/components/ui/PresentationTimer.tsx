import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

interface PresentationTimerProps {
  durationMinutes?: number; // Default 30
}

export const PresentationTimer = ({ durationMinutes = 30 }: PresentationTimerProps) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const totalSeconds = durationMinutes * 60;
  const percentage = Math.min((seconds / totalSeconds) * 100, 100);

  // Color Logic: Green -> Yellow (at 75%) -> Red (at 95%)
  let strokeColor = "#22c55e"; // Green
  if (percentage > 75) strokeColor = "#eab308"; // Yellow
  if (percentage > 95) strokeColor = "#ef4444"; // Red

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur border border-white/10 rounded-full pl-3 pr-4 py-1.5 hover:bg-slate-900 transition-colors group">
      {/* Circular Progress */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          {/* Background Track */}
          <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="3" fill="none" />
          {/* Progress Line */}
          <circle
            cx="12" cy="12" r="10"
            stroke={strokeColor}
            strokeWidth="3"
            fill="none"
            strokeDasharray="63" // approx circumference of r=10
            strokeDashoffset={63 - (percentage / 100) * 63}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
      </div>

      {/* Digital Readout */}
      <div className="flex flex-col">
        <span className={`text-sm font-mono font-bold leading-none ${percentage > 95 ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
          {formatTime(seconds)}
        </span>
        <span className="text-[8px] text-slate-500 font-mono uppercase leading-none mt-0.5">
          / {durationMinutes} MIN
        </span>
      </div>

      {/* Controls (Hidden until hover) */}
      <div className="flex gap-2 w-0 overflow-hidden group-hover:w-auto transition-all duration-300 border-l border-white/10 pl-2 ml-1">
        <button 
            onClick={() => setIsActive(!isActive)}
            className="text-slate-400 hover:text-white"
            title={isActive ? "Pause" : "Start"}
        >
            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
        <button 
            onClick={() => { setIsActive(false); setSeconds(0); }}
            className="text-slate-400 hover:text-red-400"
            title="Reset"
        >
            <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};