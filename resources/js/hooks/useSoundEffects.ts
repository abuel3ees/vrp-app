import { useCallback, useEffect, useRef } from "react";

// You can use free UI sounds (e.g., from Kenney.nl or Mixkit)
// For now, we will use synthetic sounds using the Web Audio API (No files needed!)
export const useSoundEffects = () => {
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Audio Context on first interaction
    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    window.addEventListener("click", initAudio, { once: true });
    window.addEventListener("keydown", initAudio, { once: true });
  }, []);

  const playOscillator = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(vol, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  };

  const playSlideTransition = useCallback(() => {
    // Sci-fi "Whoosh" (White noise buffer or sweeping sine)
    playOscillator(200, "sine", 0.3, 0.05); // Low hum
    playOscillator(600, "triangle", 0.1, 0.02); // High blip
  }, []);

  const playClick = useCallback(() => {
    // Sharp click
    playOscillator(800, "square", 0.05, 0.02);
  }, []);

  const playSuccess = useCallback(() => {
    // Positive Chime
    if (!audioCtx.current) return;
    const now = audioCtx.current.currentTime;
    playOscillator(440, "sine", 0.5, 0.05); // A4
    setTimeout(() => playOscillator(554, "sine", 0.5, 0.05), 100); // C#5
    setTimeout(() => playOscillator(659, "sine", 0.8, 0.05), 200); // E5
  }, []);

  return { playSlideTransition, playClick, playSuccess };
};