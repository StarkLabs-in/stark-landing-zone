import { motion } from "framer-motion";
import { Cpu, Sparkles, Cog, FlaskConical } from "lucide-react";
import { fadeUp, stagger, inViewProps } from "@/lib/motion";

const services = [
  {
    icon: Cpu,
    title: "AI Engineering Platforms",
    description: "Production-ready infrastructure for deploying, managing, and scaling AI systems across enterprise environments.",
  },
  {
    icon: Sparkles,
    title: "Generative AI Systems",
    description: "Custom LLM integrations, RAG pipelines, and intelligent content generation systems built for accuracy and reliability.",
  },
  {
    icon: Cog,
    title: "Intelligent Automation",
    description: "End-to-end automation solutions that combine AI reasoning with robust engineering for operational excellence.",
  },
  {
    icon: FlaskConical,
    title: "Research-to-Production AI",
    description: "Bridging the gap between cutting-edge research and production systems that deliver real business value.",
  },
];

const WhatWeDo = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div {...inViewProps} variants={stagger(0.08)} className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-primary mb-4"
          >
            What We Do
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold mb-4">
            What We <span className="gradient-text">Build</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Starklabs is an AI engineering company focused on building production-grade systems for real-world use cases.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          {...inViewProps}
          variants={stagger(0.12)}
          className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 card-glow">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhatWeDo;
