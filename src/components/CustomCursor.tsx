import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        window.getComputedStyle(target).cursor === "pointer";
      
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        animate={{
          x: position.x - 6,
          y: position.y - 6,
          scale: isClicking ? 0.8 : isPointer ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <div 
          className="w-3 h-3 rounded-full bg-white"
          style={{
            boxShadow: isPointer ? "0 0 20px 4px hsl(var(--primary))" : "none",
          }}
        />
      </motion.div>

      {/* Cursor ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isClicking ? 0.8 : isPointer ? 1.5 : 1,
          opacity: isVisible ? 0.5 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
          mass: 0.8,
        }}
      >
        <div 
          className="w-10 h-10 rounded-full border border-primary"
          style={{
            boxShadow: isPointer ? "0 0 15px 2px hsl(var(--primary) / 0.3)" : "none",
          }}
        />
      </motion.div>

      {/* Global cursor hide */}
      <style>{`
        * {
          cursor: none !important;
        }
        @media (pointer: coarse) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
