import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MagneticElement from "./MagneticElement";
import Scene3D from "./Scene3D";
import Starfield from "./Starfield";
import { fadeUp, stagger } from "@/lib/motion";

const stats = [
  { value: "4+", label: "AI Products Engineered" },
  { value: "100%", label: "Production-Grade Systems" },
  { value: "24/7", label: "Reliability by Design" },
  { value: "∞", label: "Scale-Ready Architecture" },
];

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax the whole background as the user scrolls out of the hero.
  const bgOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.92]);
  const bgY = useTransform(scrollYProgress, [0, 0.6], [0, 120]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated background stack (starfield + WebGL scene), parallaxed on scroll */}
      <motion.div style={{ opacity: bgOpacity, scale: bgScale, y: bgY }} className="absolute inset-0 z-0">
        {/* 2D twinkling starfield */}
        <Starfield />
        {/* three.js / react-three-fiber centerpiece */}
        <Scene3D scrollProgress={scrollYProgress} />
      </motion.div>

      {/* Background Grid Pattern - responds to cursor, fades at the edges */}
      <div
        className="absolute inset-0 grid-pattern grid-fade-mask opacity-20 z-0"
        style={{
          transform: "translate3d(var(--parallax-x, 0), var(--parallax-y, 0), 0)",
          willChange: "transform",
        }}
      />

      {/* Aurora gradient orbs - drift slowly and respond to the cursor for depth */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[128px] animate-aurora z-0"
        style={{
          transform: "translate3d(calc(var(--parallax-x, 0) * -1.5), calc(var(--parallax-y, 0) * -1.5), 0)",
          willChange: "transform",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[110px] animate-aurora z-0"
        style={{
          animationDelay: "3s",
          transform: "translate3d(calc(var(--parallax-x, 0) * 1.2), calc(var(--parallax-y, 0) * 1.2), 0)",
          willChange: "transform",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={stagger(0.14, 0.05)}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/70 backdrop-blur-sm border border-border mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI Engineering & Technology Company</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            Engineering Intelligence{" "}
            <span className="gradient-text-animated">for the Real World</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            AI platforms, tools, and systems built for scale, accuracy, and impact.
          </motion.p>

          {/* CTA Buttons - Magnetic */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MagneticElement intensity={0.25}>
              <Link to="/products">
                <Button size="lg" className="glow-effect shimmer-on-hover text-lg px-8 py-6">
                  Explore Products
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
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

          {/* Trust / Stats band */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 md:grid-cols-4 gap-px mt-20 rounded-2xl overflow-hidden border border-border bg-border/50 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card/80 backdrop-blur-sm px-4 py-6 text-center">
                <div className="font-display text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Animated scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronDown className="w-6 h-6 animate-scroll-cue" />
      </motion.a>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-[1]" />
    </section>
  );
};

export default Hero;
