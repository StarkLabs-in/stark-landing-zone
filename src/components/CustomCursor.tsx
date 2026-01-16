import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

interface CursorState {
  isPointer: boolean;
  isText: boolean;
  isHidden: boolean;
  isPressed: boolean;
  magnetTarget: { x: number; y: number; width: number; height: number } | null;
}

const CustomCursor = () => {
  const [state, setState] = useState<CursorState>({
    isPointer: false,
    isText: false,
    isHidden: false,
    isPressed: false,
    magnetTarget: null,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const trailId = useRef(0);

  // Use motion values for smoother performance
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring configs for different elements
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const trailSpringConfig = { damping: 30, stiffness: 200, mass: 0.8 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const ringXSpring = useSpring(cursorX, trailSpringConfig);
  const ringYSpring = useSpring(cursorY, trailSpringConfig);

  const detectElementType = useCallback((target: HTMLElement): Partial<CursorState> => {
    const isClickable =
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a") ||
      target.getAttribute("role") === "button" ||
      window.getComputedStyle(target).cursor === "pointer";

    const isTextInput =
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable ||
      target.closest("[contenteditable]");

    const isHidden =
      target.tagName === "IFRAME" ||
      target.closest("iframe");

    // Check for magnetic elements
    let magnetTarget = null;
    const magneticEl = target.closest("[data-magnetic]") || 
      (isClickable ? target.closest("button, a") : null);
    
    if (magneticEl && isClickable) {
      const rect = magneticEl.getBoundingClientRect();
      magnetTarget = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      };
    }

    return {
      isPointer: !!isClickable,
      isText: !!isTextInput,
      isHidden: !!isHidden,
      magnetTarget,
    };
  }, []);

  useEffect(() => {
    let trailTimeout: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      
      setIsVisible(true);
      
      const target = e.target as HTMLElement;
      const elementState = detectElementType(target);
      
      setState(prev => ({ ...prev, ...elementState }));

      // Apply magnetic effect
      if (elementState.magnetTarget) {
        const { x: targetX, y: targetY } = elementState.magnetTarget;
        const deltaX = (targetX - clientX) * 0.3;
        const deltaY = (targetY - clientY) * 0.3;
        cursorX.set(clientX + deltaX);
        cursorY.set(clientY + deltaY);
      } else {
        cursorX.set(clientX);
        cursorY.set(clientY);
      }

      // Add trail points
      trailId.current += 1;
      setTrail(prev => [
        ...prev.slice(-5),
        { x: clientX, y: clientY, id: trailId.current }
      ]);

      clearTimeout(trailTimeout);
      trailTimeout = setTimeout(() => {
        setTrail([]);
      }, 150);
    };

    const handleMouseDown = () => setState(prev => ({ ...prev, isPressed: true }));
    const handleMouseUp = () => setState(prev => ({ ...prev, isPressed: false }));
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearTimeout(trailTimeout);
    };
  }, [cursorX, cursorY, detectElementType]);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  const { isPointer, isText, isHidden, isPressed } = state;

  return (
    <>
      {/* Trail effect */}
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="fixed top-0 left-0 pointer-events-none z-[9996]"
            initial={{ 
              x: point.x - 2, 
              y: point.y - 2, 
              opacity: 0.4,
              scale: 1 
            }}
            animate={{ 
              opacity: 0,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              width: 4,
              height: 4,
            }}
          >
            <div 
              className="w-full h-full rounded-full bg-primary/60"
              style={{
                filter: "blur(1px)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Outer ring - follows with delay */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          x: ringXSpring,
          y: ringYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="relative"
          animate={{
            width: isPointer ? 50 : isText ? 2 : 40,
            height: isPointer ? 50 : isText ? 24 : 40,
            opacity: isVisible && !isHidden ? (isPointer ? 0.9 : 0.5) : 0,
            borderRadius: isText ? 1 : 25,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {/* Ring border with gradient */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: isPointer 
                ? "linear-gradient(135deg, hsl(var(--primary)), hsl(200, 100%, 60%))"
                : "transparent",
              padding: 1.5,
              borderRadius: isText ? 1 : 25,
            }}
            animate={{
              rotate: isPointer ? 360 : 0,
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
          >
            <div 
              className="w-full h-full bg-background rounded-full"
              style={{ borderRadius: isText ? 1 : 25 }}
            />
          </motion.div>

          {/* Static border for non-pointer state */}
          {!isPointer && !isText && (
            <div 
              className="absolute inset-0 rounded-full border border-primary/40"
            />
          )}

          {/* Text cursor line */}
          {isText && (
            <motion.div
              className="absolute inset-0 bg-primary"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ borderRadius: 1 }}
            />
          )}

          {/* Corner accents for pointer state */}
          <AnimatePresence>
            {isPointer && (
              <>
                {[0, 90, 180, 270].map((rotation) => (
                  <motion.div
                    key={rotation}
                    className="absolute w-2 h-2"
                    style={{
                      top: rotation === 0 || rotation === 90 ? -1 : "auto",
                      bottom: rotation === 180 || rotation === 270 ? -1 : "auto",
                      left: rotation === 0 || rotation === 270 ? -1 : "auto",
                      right: rotation === 90 || rotation === 180 ? -1 : "auto",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div 
                      className="w-full h-full border-primary"
                      style={{
                        borderWidth: 2,
                        borderStyle: "solid",
                        borderColor: "hsl(var(--primary))",
                        borderTop: rotation === 0 || rotation === 90 ? undefined : "none",
                        borderBottom: rotation === 180 || rotation === 270 ? undefined : "none",
                        borderLeft: rotation === 0 || rotation === 270 ? undefined : "none",
                        borderRight: rotation === 90 || rotation === 180 ? undefined : "none",
                      }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Core dot - precise position */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="relative flex items-center justify-center"
          animate={{
            width: isPressed ? 6 : isPointer ? 8 : isText ? 0 : 6,
            height: isPressed ? 6 : isPointer ? 8 : isText ? 0 : 6,
            opacity: isVisible && !isHidden && !isText ? 1 : 0,
          }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
        >
          {/* Core */}
          <div className="w-full h-full rounded-full bg-white" />
          
          {/* Glow effect on pointer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isPointer 
                ? "0 0 15px 3px hsl(var(--primary) / 0.8), 0 0 30px 6px hsl(var(--primary) / 0.4)"
                : "0 0 8px 2px rgba(255,255,255,0.3)",
              scale: isPressed ? 0.8 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </motion.div>

      {/* Click ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div 
              className="w-10 h-10 rounded-full border-2 border-primary"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global cursor hide */}
      <style>{`
        * {
          cursor: none !important;
        }
        a, button, [role="button"], input, textarea, select {
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
