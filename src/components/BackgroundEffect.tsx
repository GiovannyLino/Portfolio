// src/components/BackgroundEffect.tsx
import { useEffect, useRef } from "react";
import "./BackgroundEffect.css";

const BackgroundEffect = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const glow = glowRef.current;
  if (!glow) return;

  const handleMouseMove = (e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    requestAnimationFrame(() => {
      if (glow) {
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
      }
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);

  return <div className="background-glow" ref={glowRef} />;
};

export default BackgroundEffect;
