import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ReactorIgnitionProps {
  onComplete: () => void;
}

const IGNITION_PHASES = [
  { text: "Intelligence Engine Offline", subtext: "Awaiting Ignition" },
  { text: "Igniting Core…", subtext: "Power Signature Detected" },
  { text: "Power Levels Rising…", subtext: "Calibrating Systems" },
  { text: "Systems Online…", subtext: "Neural Networks Active" },
  { text: "STARKLABS CORE ACTIVE", subtext: "Welcome" },
];

const ReactorIgnition = ({ onComplete }: ReactorIgnitionProps) => {
  const [isIgniting, setIsIgniting] = useState(false);
  const [phase, setPhase] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isHoveringReactor, setIsHoveringReactor] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    if (mediaQuery.matches) {
      onComplete();
    }
  }, [onComplete]);

  // Custom cursor tracking for entry screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Ignition sequence
  useEffect(() => {
    if (!isIgniting) return;

    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2400),
      setTimeout(() => setPhase(4), 3600),
      setTimeout(() => setIsExiting(true), 4200),
      setTimeout(() => onComplete(), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isIgniting, onComplete]);

  const handleIgnite = useCallback(() => {
    if (!isIgniting) {
      setIsIgniting(true);
    }
  }, [isIgniting]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (prefersReducedMotion) {
    return null;
  }

  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Deep space background */}
      <div className="absolute inset-0 bg-[#030712]">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
        
        {/* Ambient glow during ignition */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: isIgniting
              ? [
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0) 0%, transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)",
                  "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                ]
              : "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 40%)",
          }}
          transition={{ duration: 3, times: [0, 0.5, 1] }}
        />

        {/* Energy particles during ignition */}
        <AnimatePresence>
          {isIgniting && phase >= 2 && (
            <>
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-primary"
                  initial={{
                    x: "50vw",
                    y: "50vh",
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 100}vw`,
                    y: `${50 + (Math.random() - 0.5) * 100}vh`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Light streaks during final phase */}
        <AnimatePresence>
          {isExiting && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`streak-${i}`}
                  className="absolute top-1/2 left-1/2 h-[2px] bg-gradient-to-r from-primary via-cyan-400 to-transparent"
                  style={{
                    width: "150vw",
                    rotate: `${i * 45}deg`,
                    transformOrigin: "left center",
                  }}
                  initial={{ scaleX: 0, opacity: 0, x: "-50%", y: "-50%" }}
                  animate={{ scaleX: 1, opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Custom cursor for entry screen */}
      {!isTouchDevice && (
        <>
          <motion.div
            className="fixed z-[150] pointer-events-none mix-blend-screen"
            animate={{
              x: cursorPos.x - 10,
              y: cursorPos.y - 10,
              scale: isHoveringReactor ? 1.5 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 28,
            }}
          >
            <div 
              className="w-5 h-5 rounded-full border-2 border-primary"
              style={{
                boxShadow: isHoveringReactor 
                  ? "0 0 20px 4px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(59, 130, 246, 0.3)"
                  : "0 0 10px 2px rgba(59, 130, 246, 0.3)",
              }}
            />
          </motion.div>
          <motion.div
            className="fixed z-[149] pointer-events-none"
            animate={{
              x: cursorPos.x - 3,
              y: cursorPos.y - 3,
            }}
            transition={{
              type: "spring",
              stiffness: 800,
              damping: 35,
            }}
          >
            <div 
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
              style={{
                boxShadow: "0 0 8px 2px rgba(34, 211, 238, 0.8)",
              }}
            />
          </motion.div>
          <style>{`
            .reactor-screen * {
              cursor: none !important;
            }
          `}</style>
        </>
      )}

      {/* Main content */}
      <div className="reactor-screen relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Reactor Core */}
        <motion.div
          className="relative w-64 h-64 md:w-80 md:h-80"
          onMouseEnter={() => setIsHoveringReactor(true)}
          onMouseLeave={() => setIsHoveringReactor(false)}
          animate={{
            scale: isExiting ? 3 : 1,
            opacity: isExiting ? 0 : 1,
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Outer energy field */}
          <motion.div
            className="absolute -inset-8 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
            }}
            animate={{
              scale: isIgniting ? [1, 1.2, 1.1, 1.3, 1.2] : [1, 1.05, 1],
              opacity: isIgniting ? [0.3, 0.6, 0.5, 0.8, 1] : [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: isIgniting ? 3 : 4,
              repeat: isIgniting ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Outer ring 3 */}
          <motion.div
            className="absolute -inset-4 rounded-full border border-primary/20"
            animate={{
              rotate: 360,
              borderColor: isIgniting && phase >= 2 
                ? "rgba(59, 130, 246, 0.6)" 
                : "rgba(59, 130, 246, 0.2)",
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 0.5 },
            }}
          />

          {/* Outer ring 2 */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              rotate: -360,
              borderColor: isIgniting && phase >= 1 
                ? "rgba(59, 130, 246, 0.7)" 
                : "rgba(59, 130, 246, 0.3)",
              boxShadow: isIgniting && phase >= 3
                ? "0 0 30px rgba(59, 130, 246, 0.4)"
                : "0 0 0 transparent",
            }}
            transition={{
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 0.5 },
              boxShadow: { duration: 0.5 },
            }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-6 rounded-full border-2 border-primary/40"
            animate={{
              rotate: 360,
              borderColor: isIgniting && phase >= 2 
                ? "rgba(59, 130, 246, 0.9)" 
                : "rgba(59, 130, 246, 0.4)",
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 0.5 },
            }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-12 rounded-full border-2 border-primary/50"
            animate={{
              rotate: -360,
              borderColor: isIgniting && phase >= 2 
                ? "rgba(34, 211, 238, 0.8)" 
                : "rgba(59, 130, 246, 0.5)",
              scale: isIgniting ? [1, 1.02, 1] : 1,
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 0.5 },
              scale: { duration: 0.5, repeat: Infinity },
            }}
          />

          {/* Arc segments */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, i) => (
            <motion.div
              key={rotation}
              className="absolute inset-8 flex items-center justify-center"
              style={{ rotate: `${rotation}deg` }}
            >
              <motion.div
                className="w-1.5 h-6 rounded-full origin-bottom"
                style={{ 
                  marginBottom: "100px",
                  background: "linear-gradient(to top, rgba(59, 130, 246, 0.8), rgba(34, 211, 238, 0.6))",
                }}
                animate={{
                  opacity: isIgniting && phase >= 1 ? 1 : 0.4,
                  scaleY: isIgniting && phase >= 2 ? [1, 1.2, 1] : 1,
                  boxShadow: isIgniting && phase >= 2
                    ? "0 0 15px rgba(59, 130, 246, 0.8)"
                    : "0 0 5px rgba(59, 130, 246, 0.3)",
                }}
                transition={{
                  opacity: { duration: 0.3, delay: i * 0.05 },
                  scaleY: { duration: 0.5, repeat: Infinity, delay: i * 0.1 },
                  boxShadow: { duration: 0.3 },
                }}
              />
            </motion.div>
          ))}

          {/* Core outer glow */}
          <motion.div
            className="absolute inset-[72px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
            }}
            animate={{
              scale: isIgniting && phase >= 3 ? [1, 1.5, 1.3] : [1, 1.1, 1],
              opacity: isIgniting && phase >= 3 ? [0.5, 1, 0.8] : [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: isIgniting ? 1 : 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Core center */}
          <motion.div
            className="absolute inset-[88px] rounded-full bg-primary/30"
            animate={{
              scale: isHoveringReactor && !isIgniting ? 1.1 : 1,
              backgroundColor: isIgniting
                ? phase >= 4
                  ? "rgba(34, 211, 238, 0.9)"
                  : phase >= 3
                    ? "rgba(59, 130, 246, 0.7)"
                    : "rgba(59, 130, 246, 0.5)"
                : "rgba(59, 130, 246, 0.3)",
              boxShadow: isIgniting
                ? phase >= 4
                  ? "0 0 80px 30px rgba(34, 211, 238, 0.8), 0 0 120px 60px rgba(59, 130, 246, 0.4)"
                  : phase >= 3
                    ? "0 0 60px 20px rgba(59, 130, 246, 0.6)"
                    : "0 0 30px 10px rgba(59, 130, 246, 0.4)"
                : isHoveringReactor
                  ? "0 0 40px 15px rgba(59, 130, 246, 0.3)"
                  : "0 0 20px 5px rgba(59, 130, 246, 0.2)",
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
          />

          {/* Core pulse effect */}
          <motion.div
            className="absolute inset-[80px] rounded-full"
            animate={{
              scale: isIgniting && phase >= 3 ? [1, 1.8, 1] : [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: isIgniting && phase >= 3 ? 0.8 : 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{
              border: "2px solid rgba(59, 130, 246, 0.5)",
            }}
          />
        </motion.div>

        {/* Text content */}
        <motion.div
          className="mt-12 text-center"
          animate={{
            opacity: isExiting ? 0 : 1,
            y: isExiting ? -20 : 0,
          }}
          transition={{ duration: 0.4 }}
        >
          <motion.h1
            className="font-display text-2xl md:text-3xl font-bold tracking-wider"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-foreground">STARK</span>
            <span className="text-primary">LABS</span>
            <span className="text-foreground"> CORE</span>
          </motion.h1>
          
          <motion.div
            className="mt-4 h-16 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                className="text-sm md:text-base text-muted-foreground tracking-wide"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {IGNITION_PHASES[phase].text}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${phase}`}
                className="text-xs text-muted-foreground/60 mt-1 tracking-widest uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {IGNITION_PHASES[phase].subtext}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Ignite button */}
          <AnimatePresence>
            {!isIgniting && (
              <motion.button
                onClick={handleIgnite}
                className="mt-8 px-8 py-3 relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="absolute inset-0 border-2 border-primary rounded-lg" />
                <motion.span
                  className="absolute inset-0 bg-primary/10 rounded-lg"
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10 font-display font-semibold text-sm tracking-[0.2em] text-primary group-hover:text-cyan-400 transition-colors">
                  IGNITE REACTOR
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scaleX: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Progress indicator during ignition */}
          <AnimatePresence>
            {isIgniting && !isExiting && (
              <motion.div
                className="mt-8 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    animate={{
                      backgroundColor: phase >= i 
                        ? "rgba(59, 130, 246, 1)" 
                        : "rgba(59, 130, 246, 0.2)",
                      scale: phase === i ? [1, 1.3, 1] : 1,
                      boxShadow: phase >= i
                        ? "0 0 10px rgba(59, 130, 246, 0.5)"
                        : "none",
                    }}
                    transition={{
                      duration: 0.3,
                      scale: { duration: 0.5, repeat: phase === i ? Infinity : 0 },
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Skip intro button */}
        <motion.button
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors tracking-wider uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Skip Intro
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ReactorIgnition;
