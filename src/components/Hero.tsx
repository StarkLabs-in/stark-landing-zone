import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MagneticElement from "./MagneticElement";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const backgroundVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.2,
      ease: "easeOut" as const,
    },
  },
};

const Hero = () => {
  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Grid Pattern - responds to cursor */}
      <motion.div
        variants={backgroundVariants}
        className="absolute inset-0 grid-pattern opacity-30"
        style={{
          transform: "translate3d(var(--parallax-x, 0), var(--parallax-y, 0), 0)",
          willChange: "transform",
        }}
      />
      
      {/* Gradient Orbs - respond to cursor with inverted movement for depth */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px] animate-pulse-glow"
        style={{
          transform: "translate3d(calc(var(--parallax-x, 0) * -1.5), calc(var(--parallax-y, 0) * -1.5), 0)",
          willChange: "transform",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" 
        style={{ 
          animationDelay: "1s",
          transform: "translate3d(calc(var(--parallax-x, 0) * 1.2), calc(var(--parallax-y, 0) * 1.2), 0)",
          willChange: "transform",
        }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Engineering & Technology Company</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Engineering Intelligence{" "}
            <span className="gradient-text">for the Real World</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            AI platforms, tools, and systems built for scale, accuracy, and impact.
          </motion.p>

          {/* CTA Buttons - Magnetic */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticElement intensity={0.25}>
              <Link to="/products">
                <Button size="lg" className="glow-effect text-lg px-8 py-6">
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </MagneticElement>
            <MagneticElement intensity={0.25}>
              <a href="#contact">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-border hover:bg-secondary">
                  Contact Starklabs
                </Button>
              </a>
            </MagneticElement>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
      />
    </motion.section>
  );
};

export default Hero;
