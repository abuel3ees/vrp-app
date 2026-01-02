import React, { useState, useEffect, useCallback, useRef } from "react";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Pause, HelpCircle, Grid, Wand2, PenTool, Focus, Mic } from "lucide-react";
import { Button } from "@/Components/ui/button"; 
import "katex/dist/katex.min.css"; 

import { slides } from "@/data/slides";
import { QuantumField } from "@/Components/visualizations/QuantumField";
import { SectionBadge } from "@/Components/ui/PresentationPrimitives";
import { FullScreenToggle } from "@/components/fullscreen-toggle";
import { ShortcutsModal } from "@/Components/ui/ShortcutsModal"; 
import { SlideOverview } from "@/Components/ui/SlideOverview";
import { LaserPointer } from "@/Components/ui/LaserPointer";
import { DrawingOverlay } from "@/Components/ui/DrawingOverlay";
import { SpotlightOverlay } from "@/Components/ui/SpotlightOverlay";
import { SpeakerNotes } from "@/Components/ui/SpeakerNotes";

// Import Layouts
import { 
    SplitLayout, GridLayout, HeroLayout, TerminalLayout, ArchitectureLayout,
    CodeLayout, GraphLayout, PipelineLayout, LandscapeLayout,
    SystemLayout, MobileLayout, MatrixLayout, NotebookLayout
} from "@/Components/layouts/SlideLayouts";

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  
  // UI States
  const [showHelp, setShowHelp] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  
  // Tool States
  const [zenMode, setZenMode] = useState(false);
  const [laserMode, setLaserMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [spotlightMode, setSpotlightMode] = useState(false);
  
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const slide = slides[currentSlide];

  const changeSlide = useCallback((newDir: number) => {
    const next = currentSlide + newDir;
    if (next >= 0 && next < slides.length) {
      setDirection(newDir);
      setCurrentSlide(next);
    } else {
        setIsAutoplay(false);
    }
  }, [currentSlide]);

  const jumpToSlide = (index: number) => {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
      setShowOverview(false);
  };

  // Keyboard Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Blocker Keys (Input modes)
      if (drawMode) {
          if (e.key === "Escape") setDrawMode(false);
          return;
      }
      if (showOverview) {
          if (e.key === "Escape") setShowOverview(false);
          return;
      }

      // 2. Navigation
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") changeSlide(1);
      else if (e.key === "ArrowLeft") changeSlide(-1);
      
      // 3. Tools
      else if (e.key === "?" || e.key === "/") setShowHelp(prev => !prev);
      else if (e.key === "g") setShowOverview(true);
      else if (e.key === "l") { setLaserMode(prev => !prev); setSpotlightMode(false); }
      else if (e.key === "d") { setDrawMode(true); setLaserMode(false); setSpotlightMode(false); }
      else if (e.key === "s") { setSpotlightMode(prev => !prev); setLaserMode(false); }
      else if (e.key === "n") setShowNotes(prev => !prev);
      else if (e.key === "z") setZenMode(prev => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeSlide, showOverview, drawMode]);

  // Autoplay Effect
  useEffect(() => {
    if (isAutoplay) {
        autoplayTimer.current = setInterval(() => changeSlide(1), 5000);
    } else {
        if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    }
    return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current); }
  }, [isAutoplay, changeSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      filter: "blur(8px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.98,
      filter: "blur(8px)",
      transition: { duration: 0.4, ease: "easeIn" }
    })
  };

  const renderLayout = () => {
    switch (slide.layout) {
      case "split_text_visual":
      case "math_deep_dive": return <SplitLayout slide={slide} />;
      case "grid_cards": return <GridLayout slide={slide} />;
      case "hero": return <HeroLayout slide={slide} />;
      case "terminal_simulation": return <TerminalLayout slide={slide} />;
      case "architecture_flow": return <ArchitectureLayout />;
      case "code_snippet": return <CodeLayout slide={slide} />;
      case "graph_visual": return <GraphLayout slide={slide} />;
      case "pipeline_flow": return <PipelineLayout slide={slide} />;
      case "landscape_visual": return <LandscapeLayout slide={slide} />;
      case "system_visual": return <SystemLayout slide={slide} />;
      case "mobile_visual": return <MobileLayout slide={slide} />;
      case "matrix_visual": return <MatrixLayout slide={slide} />;
      case "notebook_viewer": return <NotebookLayout slide={slide} />;
      default: return slide.content;
    }
  };

  return (
    <div className={`relative w-screen h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans selection:bg-purple-500/30 ${laserMode ? 'cursor-none' : ''}`}>
      <Head title={`${slide.category || 'Presentation'} - Slide ${currentSlide + 1}`} />
      
      {/* OVERLAYS & TOOLS */}
      <QuantumField />
      <LaserPointer active={laserMode} />
      <DrawingOverlay active={drawMode} onClose={() => setDrawMode(false)} />
      <SpotlightOverlay active={spotlightMode} />
      
      {/* FLOATING PANELS */}
      <SpeakerNotes isOpen={showNotes} notes={slide.notes} onClose={() => setShowNotes(false)} />
      <ShortcutsModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <SlideOverview isOpen={showOverview} slides={slides} currentIndex={currentSlide} onSelect={jumpToSlide} onClose={() => setShowOverview(false)} />
      
      {/* TOP BAR (Hidden in Zen Mode) */}
      <div className={`absolute top-0 left-0 w-full z-50 flex items-start justify-between p-6 transition-all duration-500 ${zenMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} pointer-events-none`}>
          <div className="flex items-center gap-4 pointer-events-auto">
             <div className="flex items-end gap-2 text-white/20 hover:text-white transition-colors cursor-default">
                <span className="text-4xl font-black leading-none">{(currentSlide + 1).toString().padStart(2, '0')}</span>
                <span className="text-xs font-bold mb-1">/ {slides.length.toString().padStart(2, '0')}</span>
             </div>
          </div>
          <div className="pointer-events-auto flex gap-2">
            <Button onClick={() => setShowNotes(!showNotes)} variant="ghost" size="icon" className={`rounded-full ${showNotes ? 'text-yellow-400 bg-yellow-400/10' : 'hover:bg-white/10 text-slate-400'}`}>
                <Mic className="w-5 h-5" />
            </Button>
            <Button onClick={() => setDrawMode(true)} variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-slate-400">
                <PenTool className="w-5 h-5" />
            </Button>
            <Button onClick={() => setSpotlightMode(!spotlightMode)} variant="ghost" size="icon" className={`rounded-full ${spotlightMode ? 'text-cyan-400 bg-cyan-400/10' : 'hover:bg-white/10 text-slate-400'}`}>
                <Focus className="w-5 h-5" />
            </Button>
            <Button onClick={() => setLaserMode(!laserMode)} variant="ghost" size="icon" className={`rounded-full ${laserMode ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-slate-400'}`}>
                <Wand2 className="w-5 h-5" />
            </Button>
            <Button onClick={() => setShowOverview(true)} variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-slate-400">
                <Grid className="w-5 h-5" />
            </Button>
            <FullScreenToggle />
          </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="w-full h-full flex flex-col items-center justify-center relative z-10 overflow-hidden">
        <div className="w-full max-w-7xl h-full max-h-[85vh] p-6 md:p-12 flex flex-col justify-center">
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
                <div className={`mb-6 border-b border-white/5 pb-4 shrink-0 transition-opacity duration-300 ${zenMode ? 'opacity-0' : 'opacity-100'}`}>
                    <SectionBadge text={slide.category} />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">{slide.title}</h2>
                    {slide.subtitle && <p className="text-lg md:text-xl text-slate-400 font-light">{slide.subtitle}</p>}
                </div>
                )}
                
                <div className="flex-1 min-h-0 relative">
                    {renderLayout()}
                </div>
            </motion.div>
            </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM BAR (Hidden in Zen Mode) */}
      <div className={`absolute bottom-0 left-0 w-full z-50 transition-all duration-500 ${zenMode ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="flex w-full h-1.5 bg-slate-900 gap-[1px]">
              {slides.map((_, idx) => (
                  <div key={idx} className={`h-full flex-1 transition-all duration-300 ${idx <= currentSlide ? 'bg-purple-500' : 'bg-slate-800'}`} />
              ))}
          </div>
          <div className="absolute bottom-4 left-6 flex gap-3">
             <Button onClick={() => setShowHelp(true)} variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
                <HelpCircle className="w-5 h-5" />
             </Button>
             <Button onClick={() => setIsAutoplay(!isAutoplay)} variant="ghost" size="icon" className={`rounded-full transition-colors ${isAutoplay ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-slate-400'}`}>
                {isAutoplay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
             </Button>
          </div>
          <div className="absolute bottom-4 right-6 flex gap-4">
            <Button onClick={() => changeSlide(-1)} disabled={currentSlide === 0} variant="outline" size="icon" className="rounded-full w-12 h-12 bg-black/20 backdrop-blur border-white/10 hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button onClick={() => changeSlide(1)} disabled={currentSlide === slides.length - 1} size="icon" className="rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-500 border border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.5)]">
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
      </div>
    </div>
  );
}