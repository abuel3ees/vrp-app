import React from "react";
import { motion } from "framer-motion";

export const RevealText = ({ 
    text, 
    className = "", 
    delay = 0,
    stagger = 0.05
}: { text: string, className?: string, delay?: number, stagger?: number }) => {
  
  // Split text into words for granular control
  const words = text.split(" ");

  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, rotate: 5 }} // Start below and slightly rotated
            whileInView={{ y: "0%", opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: [0.33, 1, 0.68, 1], // Cubic-bezier for smooth snap
              delay: delay + (i * stagger)
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};