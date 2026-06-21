import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
  className?: string;
  speed?: number;
}

const ParallaxSection = ({
  children,
  offset = 50,
  className = "",
  speed = 0.5
}: ParallaxSectionProps) => {
  const ref = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed]);

  return (
    <motion.div ref={ref} style={{ y: (isMobile || shouldReduceMotion) ? 0 : y }} className={className}>
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
