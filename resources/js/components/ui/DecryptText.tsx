import React, { useEffect, useState, useRef } from "react";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export const DecryptText = ({ text, className = "" }: { text: string, className?: string }) => {
  const [displayText, setDisplayText] = useState(text.split("").map(() => " "));
  const [iteration, setIteration] = useState(0);
  
  useEffect(() => {
    let interval: any = null;
    
    interval = setInterval(() => {
      setDisplayText((prev) => 
        text.split("").map((letter, index) => {
          if (index < iteration) {
            return letter; // Locked in
          }
          // Random scramble
          return characters[Math.floor(Math.random() * characters.length)];
        })
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      setIteration(prev => prev + 1/3); // Speed control (lower = slower)
    }, 30);

    return () => clearInterval(interval);
  }, [text, iteration]);

  return (
    <span className={`font-mono ${className}`}>
      {displayText.join("")}
    </span>
  );
};