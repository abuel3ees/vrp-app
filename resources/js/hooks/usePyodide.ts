import { useState, useEffect, useRef } from "react";

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

export const usePyodide = () => {
  const [isReady, setIsReady] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const load = async () => {
      if (window.pyodide) {
        pyodideRef.current = window.pyodide;
        setIsReady(true);
        return;
      }

      // Load Pyodide script
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
      script.async = true;
      script.onload = async () => {
        try {
          const pyodide = await window.loadPyodide();
          // Redirect Python print() to our React state
          pyodide.setStdout({ batched: (msg: string) => {
             console.log("Python:", msg);
          }});
          
          await pyodide.loadPackage("micropip");
          pyodideRef.current = pyodide;
          setIsReady(true);
        } catch (e) {
          console.error("Pyodide failed to load", e);
        }
      };
      document.body.appendChild(script);
    };

    load();
  }, []);

  const runCode = async (code: string) => {
    if (!pyodideRef.current) return "Runtime not ready";
    
    // Reset stdout capture for this run
    let cellOutput: string[] = [];
    pyodideRef.current.setStdout({ batched: (msg: string) => cellOutput.push(msg) });

    try {
      // Execute the code
      const result = await pyodideRef.current.runPythonAsync(code);
      
      // Combine stdout and return value
      const finalOutput = [...cellOutput];
      if (result !== undefined && result !== null) {
          finalOutput.push(result.toString());
      }
      return finalOutput.join("\n");
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  };

  return { isReady, runCode };
};