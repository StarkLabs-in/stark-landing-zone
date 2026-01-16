import React, { useRef, useEffect, ReactNode } from "react";

interface MagneticElementProps {
  children: ReactNode;
  intensity?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  intensity = 0.3,
  className = "",
  as: Component = "div",
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isHovering = useRef(false);

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

  return (
    <div ref={elementRef} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
};

export default MagneticElement;
