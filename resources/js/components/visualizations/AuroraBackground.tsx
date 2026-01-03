import React from "react";

export const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-950">
      {/* 1. Deep Base */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* 2. The Moving Orbs */}
      {/* Purple Orb */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
      
      {/* Cyan Orb */}
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
      
      {/* Blue Orb */}
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />

      {/* 3. Embedded Animation Styles (No Tailwind config needed) */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};