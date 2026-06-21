import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gradient progress bar pinned to the top of the viewport that tracks
 * page scroll. Gives the whole site a continuous, "alive" feel.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary via-cyan-400 to-purple-500"
    />
  );
};

export default ScrollProgress;
