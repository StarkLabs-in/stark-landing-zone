import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MagneticElement from "./MagneticElement";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Grid Pattern - responds to cursor */}
      <div 
        className="absolute inset-0 grid-pattern opacity-30"
        style={{
          transform: "translate3d(var(--parallax-x, 0), var(--parallax-y, 0), 0)",
          willChange: "transform",
        }}
      />
      
      {/* Gradient Orbs - respond to cursor with inverted movement for depth */}
      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px] animate-pulse-glow"
        style={{
          transform: "translate3d(calc(var(--parallax-x, 0) * -1.5), calc(var(--parallax-y, 0) * -1.5), 0)",
          willChange: "transform",
        }}
      />
      <div 
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-glow" 
        style={{ 
          animationDelay: "1s",
          transform: "translate3d(calc(var(--parallax-x, 0) * 1.2), calc(var(--parallax-y, 0) * 1.2), 0)",
          willChange: "transform",
        }} 
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Engineering & Technology Company</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Engineering Intelligence{" "}
            <span className="gradient-text">for the Real World</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            AI platforms, tools, and systems built for scale, accuracy, and impact.
          </motion.p>

          {/* CTA Buttons - Magnetic */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
