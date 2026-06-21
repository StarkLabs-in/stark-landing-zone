import { motion } from "framer-motion";
import { Wrench, BookOpen, Shield, Users } from "lucide-react";
import { fadeUp, scaleIn, stagger, inViewProps } from "@/lib/motion";

const reasons = [
  {
    icon: Wrench,
    title: "Engineering-First Mindset",
    description: "We prioritize robust architecture, clean code, and maintainable systems over quick fixes.",
  },
  {
    icon: BookOpen,
    title: "Research-Backed Development",
    description: "Every solution is grounded in the latest AI research, ensuring cutting-edge performance.",
  },
  {
    icon: Shield,
    title: "Secure, Scalable Systems",
    description: "Built with enterprise security standards and designed to scale from day one.",
  },
  {
    icon: Users,
    title: "Built by Practitioners",
    description: "Our team consists of engineers and researchers who build and ship real AI products.",
  },
];

const WhyStarklabs = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div {...inViewProps} variants={stagger(0.08)} className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-primary mb-4"
          >
            Why Choose Us
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold mb-4">
            Why <span className="gradient-text">Starklabs</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We don't just build AI—we engineer intelligent systems that work in the real world.
          </motion.p>
        </motion.div>

        {/* Reasons Grid */}
        <motion.div
          {...inViewProps}
          variants={stagger(0.12)}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          {reasons.map((reason) => (
            <motion.div key={reason.title} variants={fadeUp} className="group text-center">
              <motion.div
                variants={scaleIn}
                whileHover={{ rotate: 6, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors"
              >
                <reason.icon className="w-8 h-8 text-primary" />
              </motion.div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyStarklabs;
