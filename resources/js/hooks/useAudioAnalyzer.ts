import { useEffect, useRef } from "react";

export const useAudioAnalyzer = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const initAudio = async () => {
      try {
        // Request Mic Access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Setup Audio Context
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        // Create Analyzer
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64; // Low resolution is fine for volume
        analyserRef.current.smoothingTimeConstant = 0.8; // Smooth out the jitter
        
        // Connect Mic to Analyzer
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        
        // Buffer for data
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
      } catch (e) {
        console.warn("Audio/Mic access denied or failed.", e);
      }
    };

    // Browsers block AudioContext until a user gesture. 
    // We bind it to the first click/keypress.
    const start = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'suspended') {
            initAudio();
        }
        // Cleanup listeners
        window.removeEventListener('click', start);
        window.removeEventListener('keydown', start);
    };

    window.addEventListener('click', start);
    window.addEventListener('keydown', start);

    return () => {
        // Don't close context aggressively or it breaks slide transitions,
        // just disconnect streams if needed.
    };
  }, []);

  const getVolume = (): number => {
      if (!analyserRef.current || !dataArrayRef.current) return 0;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      // Calculate Average Volume
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
      }
      
      // Normalize to roughly 0-100 range
      const average = sum / dataArrayRef.current.length;
      return average;
  };

  return { getVolume };
};