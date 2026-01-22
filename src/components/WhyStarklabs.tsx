import { motion } from "framer-motion";
import { Wrench, BookOpen, Shield, Users } from "lucide-react";
import RevealText from "./RevealText";

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
        <div className="text-center mb-16">
          <RevealText
            text="Why Starklabs"
            className="font-display text-3xl md:text-5xl font-bold mb-4 justify-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            We don't just build AI—we engineer intelligent systems that work in the real world.
          </motion.p>
        </div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <reason.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                {reason.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyStarklabs;
