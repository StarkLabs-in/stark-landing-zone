import { useEffect, useRef } from "react";

/**
 * Environment Interaction System
 * 
 * This component tracks cursor position and updates CSS variables
 * for subtle environment responses. The native cursor remains untouched.
 * 
 * Movement is applied ONLY to background elements via CSS variables.
 */
const CustomCursor = () => {
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Check for touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const updateCSSVariables = () => {
      const { x, y } = mouseRef.current;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Normalized values from -1 to 1
      const normalizedX = (x - centerX) / centerX;
      const normalizedY = (y - centerY) / centerY;

      // Apply to CSS variables (max 6px movement for parallax)
      const moveX = normalizedX * 6;
      const moveY = normalizedY * 6;

      document.documentElement.style.setProperty("--mouse-x", `${x}px`);
      document.documentElement.style.setProperty("--mouse-y", `${y}px`);
      document.documentElement.style.setProperty("--parallax-x", `${moveX}px`);
      document.documentElement.style.setProperty("--parallax-y", `${moveY}px`);
      document.documentElement.style.setProperty("--normalized-x", `${normalizedX}`);
      document.documentElement.style.setProperty("--normalized-y", `${normalizedY}`);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(updateCSSVariables);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // No visual elements rendered - only CSS variable updates
  return null;
};

export default CustomCursor;
