import React, { useState, useEffect, useCallback, useRef } from "react";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Pause, HelpCircle } from "lucide-react";
import { Button } from "@/Components/ui/button"; 
import "katex/dist/katex.min.css"; 

import { slides } from "@/data/slides";
import { QuantumField } from "@/Components/visualizations/QuantumField";
import { SectionBadge } from "@/Components/ui/PresentationPrimitives";
import { FullScreenToggle } from "@/components/fullscreen-toggle";
import { ShortcutsModal } from "@/Components/ui/ShortcutsModal"; 

import { 
    SplitLayout, 
    GridLayout, 
    HeroLayout, 
    TerminalLayout, 
    ArchitectureLayout,
    CodeLayout,
    GraphLayout
} from "@/Components/layouts/SlideLayouts";

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const slide = slides[currentSlide];

  const changeSlide = useCallback((newDir: number) => {
    const next = currentSlide + newDir;
    if (next >= 0 && next < slides.length) {
      setDirection(newDir);
      setCurrentSlide(next);
    } else {
        setIsAutoplay(false); // Stop autoplay at end
    }
  }, [currentSlide]);

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") changeSlide(1);
      if (e.key === "ArrowLeft") changeSlide(-1);
      if (e.key === "?" || e.key === "/") setShowHelp(prev => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeSlide]);

  // Autoplay Effect
  useEffect(() => {
    if (isAutoplay) {
        autoplayTimer.current = setInterval(() => {
            changeSlide(1);
        }, 5000);
    } else {
        if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    }
    return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current); }
  }, [isAutoplay, changeSlide]);

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.5, ease: "circOut" } },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0, transition: { duration: 0.3 } })
  };

  const renderLayout = () => {
    switch (slide.layout) {
      case "split_text_visual":
      case "math_deep_dive": return <SplitLayout slide={slide} />;
      case "grid_cards": return <GridLayout slide={slide} />;
      case "hero": return <HeroLayout slide={slide} />;
      case "terminal_simulation": return <TerminalLayout slide={slide} />;
      case "architecture_flow": return <ArchitectureLayout />;
      case "code_snippet": return <CodeLayout slide={slide} />; // NEW
      case "graph_visual": return <GraphLayout slide={slide} />; // NEW
      default: return slide.content;
    }
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans selection:bg-purple-500/30">
      <Head title={`${slide.category || 'Presentation'} - Slide ${currentSlide + 1}`} />
      
      <QuantumField />
      <ShortcutsModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      
      {/* --- TOP BAR --- */}
      <div className="absolute top-0 left-0 w-full z-50 flex items-start justify-between p-6 pointer-events-none">
          <div className="absolute top-0 left-0 h-1 w-full bg-slate-800">
            <motion.div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.5 }}
            />
          </div>

          <div className="flex items-end gap-2 pointer-events-auto">
            <span className="text-4xl font-black text-white/10 leading-none">{(currentSlide + 1).toString().padStart(2, '0')}</span>
            <span className="text-xs font-bold text-purple-500/50 mb-1">/ {slides.length.toString().padStart(2, '0')}</span>
          </div>

          <div className="pointer-events-auto">
            <FullScreenToggle />
          </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 perspective-[1200px] overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="w-full max-w-7xl min-h-[600px] p-6 md:p-12 pb-32 flex flex-col justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
                key={currentSlide}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full h-full flex flex-col"
            >
                {slide.layout !== 'hero' && (
                <div className="mb-8 border-b border-white/5 pb-6 shrink-0">
                    <SectionBadge text={slide.category} />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">{slide.title}</h2>
                    {slide.subtitle && <p className="text-lg md:text-xl text-slate-400 font-light">{slide.subtitle}</p>}
                </div>
                )}
                
                <div className="flex-1 relative">
                    {renderLayout()}
                </div>
            </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="absolute bottom-8 left-8 z-50 flex gap-3">
         <Button onClick={() => setShowHelp(true)} variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white" title="Keyboard Shortcuts (?)">
            <HelpCircle className="w-5 h-5" />
         </Button>
         
         <Button 
            onClick={() => setIsAutoplay(!isAutoplay)} 
            variant="ghost" 
            size="icon" 
            className={`rounded-full transition-colors ${isAutoplay ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-slate-400'}`}
            title="Autoplay Mode"
        >
            {isAutoplay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
         </Button>
      </div>

      <div className="absolute bottom-8 right-8 z-50 flex gap-4">
        <Button onClick={() => changeSlide(-1)} disabled={currentSlide === 0} variant="outline" size="icon" className="rounded-full w-14 h-14 bg-black/20 backdrop-blur border-white/10 hover:bg-white/10 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button onClick={() => changeSlide(1)} disabled={currentSlide === slides.length - 1} size="icon" className="rounded-full w-14 h-14 bg-purple-600 hover:bg-purple-500 border border-purple-400 transition-all shadow-[0_0_20px_rgba(147,51,234,0.5)]">
          <ArrowRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}