"use client";

import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export default function SlideOverlayPortal({
  children,
  zIndex = 50,
}: {
  children: React.ReactNode;
  zIndex?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const el = useMemo(() => {
    if (typeof document === "undefined") return null;
    const div = document.createElement("div");
    div.setAttribute("data-slide-portal", "true");
    return div;
  }, []);

  useEffect(() => {
    if (!mounted || !el) return;
    document.body.appendChild(el);
    return () => {
      try {
        document.body.removeChild(el);
      } catch {}
    };
  }, [mounted, el]);

  if (!mounted || !el) return null;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex }}
      aria-hidden
    >
      {children}
    </div>,
    el
  );
}