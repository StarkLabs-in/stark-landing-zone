import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ArcReactorLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1400),
      setTimeout(() => setPhase(4), 2000),
      setTimeout(() => onComplete(), 2800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-64 h-64">
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-primary/30"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: phase >= 1 ? 1 : 0, 
            opacity: phase >= 1 ? 1 : 0,
            rotate: phase >= 2 ? 360 : 0
          }}
          transition={{ duration: 0.5, rotate: { duration: 2, repeat: Infinity, ease: "linear" } }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute inset-4 rounded-full border-2 border-primary/50"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: phase >= 2 ? 1 : 0, 
            opacity: phase >= 2 ? 1 : 0,
            rotate: phase >= 2 ? -360 : 0
          }}
          transition={{ duration: 0.4, rotate: { duration: 1.5, repeat: Infinity, ease: "linear" } }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute inset-10 rounded-full border-2 border-primary"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: phase >= 2 ? 1 : 0, 
            opacity: phase >= 2 ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Arc Segments */}
        {[0, 60, 120, 180, 240, 300].map((rotation, i) => (
          <motion.div
            key={rotation}
            className="absolute inset-6 flex items-center justify-center"
            style={{ rotate: `${rotation}deg` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <motion.div
              className="w-2 h-8 bg-primary rounded-full origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ 
                scaleY: phase >= 2 ? 1 : 0,
                boxShadow: phase >= 3 ? "0 0 20px hsl(var(--primary))" : "none"
              }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              style={{ marginBottom: "80px" }}
            />
          </motion.div>
        ))}

        {/* Core */}
        <motion.div
          className="absolute inset-[72px] rounded-full bg-primary/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: phase >= 3 ? 1 : 0, 
            opacity: phase >= 3 ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Core Center */}
        <motion.div
          className="absolute inset-[88px] rounded-full bg-primary"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: phase >= 3 ? [0, 1.2, 1] : 0, 
            opacity: phase >= 3 ? 1 : 0,
            boxShadow: phase >= 4 ? "0 0 60px 20px hsl(var(--primary) / 0.6)" : "0 0 0 0 transparent"
          }}
          transition={{ duration: 0.4, boxShadow: { duration: 0.5 } }}
        />

        {/* Power Surge Effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: phase >= 4 ? [0, 0.8, 0] : 0,
            scale: phase >= 4 ? [1, 1.5, 2] : 1
          }}
          transition={{ duration: 0.6 }}
          style={{ 
            background: "radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)" 
          }}
        />

        {/* Text */}
        <motion.div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 10 }}
          transition={{ duration: 0.4 }}
        >
          <span className="font-display font-bold text-xl text-foreground">
            Stark<span className="text-primary">labs</span>
          </span>
          <motion.div
            className="text-xs text-muted-foreground mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 2 ? 1 : 0 }}
          >
            {phase < 3 ? "Initializing..." : phase < 4 ? "Powering up..." : "Online"}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ArcReactorLoader;
