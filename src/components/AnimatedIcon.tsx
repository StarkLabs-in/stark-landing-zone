import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

const AnimatedIcon = ({ icon: Icon, className = "", delay = 0 }: AnimatedIconProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`relative ${className}`}
    >
      <motion.div
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { delay, duration: 1.5, ease: "easeInOut" },
              opacity: { delay, duration: 0.5 },
            },
          },
        }}
      >
        <Icon className={className} />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedIcon;
