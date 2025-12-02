// utils.js
import { useEffect, useState } from "react";

export function useVisible(ref){
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if(!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return visible;
}