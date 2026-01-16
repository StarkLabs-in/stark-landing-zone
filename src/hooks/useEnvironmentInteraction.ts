import { useEffect, useRef, useCallback } from "react";

interface EnvironmentConfig {
  parallaxIntensity?: number;
  enabled?: boolean;
}

export const useEnvironmentInteraction = (config: EnvironmentConfig = {}) => {
  const { parallaxIntensity = 1, enabled = true } = config;
  const rafRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

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

      // Apply to CSS variables (max 6px movement)
      const moveX = normalizedX * 6 * parallaxIntensity;
      const moveY = normalizedY * 6 * parallaxIntensity;

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
  }, [enabled, parallaxIntensity]);
};

// Magnetic effect hook for individual elements
export const useMagneticEffect = (intensity: number = 0.3) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isHovering = useRef(false);

  const setRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check for reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Check for touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovering.current) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * intensity;
      const deltaY = (e.clientY - centerY) * intensity;

      // Clamp movement to max 6px
      const clampedX = Math.max(-6, Math.min(6, deltaX));
      const clampedY = Math.max(-6, Math.min(6, deltaY));

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        element.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      });
    };

    const handleMouseEnter = () => {
      isHovering.current = true;
      element.style.transition = "transform 0.1s ease-out";
    };

    const handleMouseLeave = () => {
      isHovering.current = false;
      element.style.transition = "transform 0.3s ease-out";
      element.style.transform = "translate3d(0, 0, 0)";
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [intensity]);

  return setRef;
};
