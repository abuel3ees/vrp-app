import React, { useEffect, useState, useRef } from "react";
import { Mic, MicOff, Activity } from "lucide-react";

interface VoiceControlProps {
  onNext: () => void;
  onPrev: () => void;
  onOverview: () => void;
}

export const VoiceControl = ({ onNext, onPrev, onOverview }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  // REFS: We use refs to hold the latest state/callbacks without triggering re-renders
  // This prevents the SpeechRecognition instance from being destroyed when slides change.
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(isListening);
  const callbacksRef = useRef({ onNext, onPrev, onOverview });

  // Update callbacks ref whenever props change
  useEffect(() => {
    callbacksRef.current = { onNext, onPrev, onOverview };
  }, [onNext, onPrev, onOverview]);

  // Update listening ref whenever state changes
  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    // 1. Browser Support Check
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Browser not supported (Use Chrome)");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    
    rec.continuous = true;      // Keep listening even after the user stops talking
    rec.interimResults = false; // Only trigger on final results
    rec.lang = "en-US";

    // 2. Result Handler
    rec.onresult = (event: any) => {
      const resultsLength = event.results.length - 1;
      const transcript = event.results[resultsLength][0].transcript.toLowerCase().trim();
      
      console.log("Heard:", transcript); // Debugging log
      setLastCommand(transcript);

      // Simple Command Matching
      if (transcript.includes("next") || transcript.includes("forward") || transcript.includes("go")) {
        callbacksRef.current.onNext();
      } else if (transcript.includes("back") || transcript.includes("previous")) {
        callbacksRef.current.onPrev();
      } else if (transcript.includes("overview") || transcript.includes("grid") || transcript.includes("show all")) {
        callbacksRef.current.onOverview();
      }

      setTimeout(() => setLastCommand(""), 2000);
    };

    // 3. Error Handler
    rec.onerror = (event: any) => {
      console.error("Speech Error:", event.error);
      if (event.error === 'not-allowed') {
        setError("Mic blocked");
        setIsListening(false);
      }
    };

    // 4. "Keep-Alive" Handler
    // If the browser stops listening (silence timeout), restart it if we are still supposed to be listening.
    rec.onend = () => {
      if (isListeningRef.current) {
        try {
            rec.start();
        } catch (e) {
            // Ignore errors if it's already started
        }
      }
    };

    recognitionRef.current = rec;

    // Cleanup
    return () => {
      rec.stop();
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setLastCommand("");
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } catch (e) {
        console.error("Start error:", e);
      }
    }
  };

  if (error === "Browser not supported (Use Chrome)") return null;

  return (
    <div className="fixed bottom-6 right-24 z-[60] flex items-center gap-3">
      {/* Visual Feedback Bubble */}
      {lastCommand && (
        <div className="px-4 py-2 bg-slate-900/90 border border-purple-500/50 rounded-xl text-purple-300 text-sm font-mono font-bold animate-in fade-in slide-in-from-right-5 shadow-xl flex items-center gap-2">
          <Activity className="w-4 h-4 animate-pulse text-purple-500" />
          "{lastCommand}"
        </div>
      )}

      {/* Error Bubble */}
      {error && (
        <div className="px-3 py-1 bg-red-900/80 border border-red-500/50 rounded-full text-red-200 text-xs font-bold animate-pulse">
          {error}
        </div>
      )}

      {/* Mic Button */}
      <button 
        onClick={toggleListening}
        className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-2xl backdrop-blur-sm
        ${isListening 
            ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_30px_rgba(239,68,68,0.4)] scale-110' 
            : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:text-white hover:border-white/50'
        }`}
      >
        {isListening ? (
            <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-red-500/20 animate-ping"></span>
                <Mic className="w-6 h-6 relative z-10" />
            </div>
        ) : (
            <MicOff className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};