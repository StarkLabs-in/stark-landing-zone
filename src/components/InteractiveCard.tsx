import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef } from "react";

interface InteractiveCardProps {
  children: ReactNode;
  className?: string;
}

const InteractiveCard = ({ children, className = "" }: InteractiveCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile || shouldReduceMotion) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    x.set(mouseXPos / width - 0.5);
    y.set(mouseYPos / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: (isMobile || shouldReduceMotion) ? 0 : rotateX,
        rotateY: (isMobile || shouldReduceMotion) ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="h-full">
        {children}
      </div>

      {/* Light Tracking Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([xValue, yValue]) => `radial-gradient(600px circle at ${((xValue as number) + 0.5) * 100}% ${((yValue as number) + 0.5) * 100}%, rgba(59, 130, 246, 0.1), transparent 40%)`
          ),
        }}
      />
    </motion.div>
  );
};

export default InteractiveCard;
