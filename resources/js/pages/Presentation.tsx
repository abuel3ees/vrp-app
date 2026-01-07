import React, { useState, useEffect, useCallback, useRef } from "react";
import { Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Pause, HelpCircle, Grid, Wand2, PenTool, Focus, Mic, Search, Lock } from "lucide-react";
import { Button } from "@/Components/ui/button"; 
import "katex/dist/katex.min.css"; 

// --- DATA ---
import { slides as mainSlides } from "@/data/slides";
import { vaultedSlides } from "@/data/vaultedSlides";

// --- MERGE ---
const allSlides = [...mainSlides, ...vaultedSlides];
const MAIN_SLIDE_COUNT = mainSlides.length; // The boundary marker

// --- HOOKS ---
import { useSoundEffects } from "@/hooks/useSoundEffects";

// --- VISUAL ENVIRONMENT ---
import { QuantumField } from "@/Components/visualizations/QuantumField";
import { SectionBadge } from "@/Components/ui/PresentationPrimitives";
import { FullScreenToggle } from "@/components/fullscreen-toggle";
import { ChapterRail } from "@/Components/ui/ChapterRail"; 
import { PresentationTimer } from "@/Components/ui/PresentationTimer"; 

// --- INTERACTIVE TOOLS ---
import { BackupVault } from "@/Components/ui/BackupVault";
import { ShortcutsModal } from "@/Components/ui/ShortcutsModal"; 
import { SlideOverview } from "@/Components/ui/SlideOverview";
import { LaserPointer } from "@/Components/ui/LaserPointer";
import { DrawingOverlay } from "@/Components/ui/DrawingOverlay";
import { SpotlightOverlay } from "@/Components/ui/SpotlightOverlay";
import { SpeakerNotes } from "@/Components/ui/SpeakerNotes";
import { VoiceControl } from "@/Components/ui/VoiceControl";
import { CommandMenu } from "@/Components/ui/CommandMenu";

// --- LAYOUTS ---
import { 
    SplitLayout, GridLayout, HeroLayout, TerminalLayout, ArchitectureLayout,
    CodeLayout, GraphLayout, PipelineLayout, LandscapeLayout,
    SystemLayout, MobileLayout, MatrixLayout, NotebookLayout
} from "@/Components/layouts/SlideLayouts";

export default function Presentation() {
  // --- STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  
  // Tools
  const [zenMode, setZenMode] = useState(false);
  const [laserMode, setLaserMode] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [spotlightMode, setSpotlightMode] = useState(false);
  
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);
  const slide = allSlides[currentSlide];
  const { playSlideTransition, playClick } = useSoundEffects();

  // Helper: Are we in the vault?
  const isVaultSlide = currentSlide >= MAIN_SLIDE_COUNT;

  // --- NAVIGATION ---
  const changeSlide = useCallback((newDir: number) => {
    const next = currentSlide + newDir;
    if (next >= 0 && next < allSlides.length) {
      playSlideTransition();
      setDirection(newDir);
      setCurrentSlide(next);
    } else {
        setIsAutoplay(false);
    }
  }, [currentSlide, playSlideTransition]);

  const jumpToSlide = (target: number | string) => {
      playClick();
      let newIndex = 0;
      if (typeof target === 'string') {
          newIndex = allSlides.findIndex(s => s.id === target);
      } else {
          newIndex = target;
      }

      if (newIndex !== -1 && newIndex !== currentSlide) {
          setDirection(newIndex > currentSlide ? 1 : -1);
          setCurrentSlide(newIndex);
          setShowOverview(false);
          setShowVault(false);
          setShowCmdPalette(false);
      }
  };

  // --- INPUT HANDLERS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); setShowCmdPalette(prev => !prev); return;
      }
      if (showCmdPalette || showVault || drawMode || showOverview) {
         if (e.key === "Escape") {
             setShowCmdPalette(false); setShowVault(false); setDrawMode(false); setShowOverview(false);
         }
         return; 
      }

      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") changeSlide(1);
      else if (e.key === "ArrowLeft") changeSlide(-1);
      else if (e.key === "b") setShowVault(prev => !prev);
      else if (e.key === "?" || e.key === "/") setShowHelp(prev => !prev);
      else if (e.key === "g") setShowOverview(true);
      else if (e.key === "l") { setLaserMode(p => !p); setSpotlightMode(false); playClick(); }
      else if (e.key === "d") { setDrawMode(true); setLaserMode(false); setSpotlightMode(false); playClick(); }
      else if (e.key === "s") { setSpotlightMode(p => !p); setLaserMode(false); playClick(); }
      else if (e.key === "n") setShowNotes(p => !p);
      else if (e.key === "z") setZenMode(p => !p);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [changeSlide, showOverview, drawMode, showCmdPalette, playClick, showVault]);

  useEffect(() => {
    if (isAutoplay) autoplayTimer.current = setInterval(() => changeSlide(1), 5000);
    else if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    return () => { if (autoplayTimer.current) clearInterval(autoplayTimer.current); }
  }, [isAutoplay, changeSlide]);

  // --- RENDER ---
  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0, scale: 0.98, filter: "blur(8px)" }),
    center: { x: 0, opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
    exit: (direction: number) => ({ x: direction < 0 ? 50 : -50, opacity: 0, scale: 0.98, filter: "blur(8px)", transition: { duration: 0.4, ease: "easeIn" } })
  };

  const renderLayout = () => {
    switch (slide.layout) {
      case "split_text_visual": case "math_deep_dive": return <SplitLayout slide={slide} />;
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
      case "center": return <div className="w-full h-full flex items-center justify-center">{slide.content}</div>;
      default: return slide.content;
    }
  };

  return (
    <div className={`relative w-screen h-screen bg-slate-950 overflow-hidden text-slate-200 font-sans selection:bg-purple-500/30 ${laserMode ? 'cursor-none' : ''}`}>
      <Head title={`${slide.category || 'Presentation'} - Slide ${currentSlide + 1}`} />
      
      {/* BACKGROUND & OVERLAYS */}
      <QuantumField />
      <LaserPointer active={laserMode} />
      <DrawingOverlay active={drawMode} onClose={() => setDrawMode(false)} />
      <SpotlightOverlay active={spotlightMode} />
      
      <BackupVault isOpen={showVault} onClose={() => setShowVault(false)} onJumpTo={jumpToSlide} />
      <SpeakerNotes isOpen={showNotes} notes={slide.notes} onClose={() => setShowNotes(false)} />
      <ShortcutsModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <SlideOverview isOpen={showOverview} slides={allSlides} currentIndex={currentSlide} onSelect={jumpToSlide} onClose={() => setShowOverview(false)} />
      <CommandMenu slides={allSlides} isOpen={showCmdPalette} onClose={() => setShowCmdPalette(false)} onSelect={jumpToSlide} />
      <ChapterRail currentCategory={slide.category} />
      
      <VoiceControl onNext={() => changeSlide(1)} onPrev={() => changeSlide(-1)} onOverview={() => setShowOverview(true)} />

      {/* --- TOP BAR --- */}
      <div className={`absolute top-0 left-0 w-full z-50 flex items-start justify-between p-6 transition-all duration-500 ${zenMode ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'} pointer-events-none`}>
          <div className="flex items-center gap-6 pointer-events-auto">
             {/* SMART COUNTER LOGIC */}
             <div 
                className="flex items-end gap-2 text-white/20 hover:text-white transition-colors cursor-pointer group"
                onClick={() => setShowCmdPalette(true)}
             >
                {isVaultSlide ? (
                    // VAULT MODE: Show Warning Badge instead of numbers
                    <div className="flex items-center gap-2 text-red-500 font-bold bg-red-500/10 px-3 py-1 rounded border border-red-500/20 animate-pulse">
                        <Lock className="w-3 h-3" /> APPENDIX MODE
                    </div>
                ) : (
                    // NORMAL MODE: Show 01 / 15
                    <>
                        <span className="text-4xl font-black leading-none group-hover:text-purple-400 transition-colors">
                            {(currentSlide + 1).toString().padStart(2, '0')}
                        </span>
                        <span className="text-xs font-bold mb-1">/ {MAIN_SLIDE_COUNT.toString().padStart(2, '0')}</span>
                    </>
                )}
                <Search className="w-4 h-4 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>

             <PresentationTimer durationMinutes={30} />
          </div>

          <div className="pointer-events-auto flex gap-2">
            <Button onClick={() => setShowNotes(!showNotes)} variant="ghost" size="icon" className={`rounded-full ${showNotes ? 'text-yellow-400 bg-yellow-400/10' : 'hover:bg-white/10 text-slate-400'}`}><Mic className="w-5 h-5" /></Button>
            <Button onClick={() => setDrawMode(true)} variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-slate-400"><PenTool className="w-5 h-5" /></Button>
            <Button onClick={() => setSpotlightMode(!spotlightMode)} variant="ghost" size="icon" className={`rounded-full ${spotlightMode ? 'text-cyan-400 bg-cyan-400/10' : 'hover:bg-white/10 text-slate-400'}`}><Focus className="w-5 h-5" /></Button>
            <Button onClick={() => setLaserMode(!laserMode)} variant="ghost" size="icon" className={`rounded-full ${laserMode ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/10 text-slate-400'}`}><Wand2 className="w-5 h-5" /></Button>
            <Button onClick={() => setShowOverview(true)} variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-slate-400"><Grid className="w-5 h-5" /></Button>
            <FullScreenToggle />
          </div>
      </div>

      {/* --- CONTENT STAGE --- */}
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
                <div className="mb-6 border-b border-white/5 pb-4 shrink-0">
                    <SectionBadge text={slide.category} />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight tracking-tight">{slide.title}</h2>
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

      {/* --- BOTTOM BAR --- */}
      <div className={`absolute bottom-0 left-0 w-full z-50 transition-all duration-500 ${zenMode ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
          {/* Progress Bar - ONLY SHOWS FOR MAIN SLIDES */}
          <div className="flex w-full h-1.5 bg-slate-900 gap-[1px]">
              {mainSlides.map((_, idx) => (
                  <div key={idx} className={`h-full flex-1 transition-all duration-300 ${
                      !isVaultSlide && idx <= currentSlide ? 'bg-purple-500' : 
                      isVaultSlide ? 'bg-slate-800' : 'bg-slate-800'
                  }`} />
              ))}
              {/* If in Vault, show a red line across bottom */}
              {isVaultSlide && <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none" />}
          </div>
          
          <div className="absolute bottom-4 left-6 flex gap-3">
             <Button onClick={() => setShowHelp(true)} variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"><HelpCircle className="w-5 h-5" /></Button>
             <Button onClick={() => setIsAutoplay(!isAutoplay)} variant="ghost" size="icon" className={`rounded-full transition-colors ${isAutoplay ? 'bg-purple-600/20 text-purple-400 border border-purple-500/50' : 'bg-white/5 text-slate-400'}`}>{isAutoplay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</Button>
          </div>
          
          <div className="absolute bottom-4 right-6 flex gap-4">
            <Button onClick={() => changeSlide(-1)} disabled={currentSlide === 0} variant="outline" size="icon" className="rounded-full w-12 h-12 bg-black/20 backdrop-blur border-white/10 hover:bg-white/10"><ArrowLeft className="w-5 h-5" /></Button>
            <Button onClick={() => changeSlide(1)} disabled={currentSlide === allSlides.length - 1} size="icon" className="rounded-full w-12 h-12 bg-purple-600 hover:bg-purple-500 border border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.5)]"><ArrowRight className="w-5 h-5" /></Button>
          </div>
      </div>
    </div>
  );
}