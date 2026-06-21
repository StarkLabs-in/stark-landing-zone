import { motion } from "framer-motion";
import { fadeUp, stagger, inViewProps } from "@/lib/motion";

const technologies = [
  "Python",
  "PyTorch",
  "TensorFlow",
  "Large Language Models",
  "RAG Systems",
  "Computer Vision",
  "NLP",
  "Cloud-Native",
  "Vector Databases",
  "MLOps",
  "Kubernetes",
  "Edge AI",
];

const Pill = ({ tech }: { tech: string }) => (
  <span className="px-5 py-2.5 rounded-full bg-secondary border border-border text-foreground font-medium text-sm whitespace-nowrap hover:border-primary/50 hover:bg-primary/10 transition-all cursor-default">
    {tech}
  </span>
);

const TechStack = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div {...inViewProps} variants={stagger(0.08)} className="text-center mb-12">
          <motion.h2 variants={fadeUp} className="font-display text-2xl md:text-3xl font-bold mb-3">
            Technology <span className="gradient-text">Stack</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
            Built on industry-leading tools and frameworks
          </motion.p>
        </motion.div>
      </div>

      {/* Infinite marquee track (duplicated content for a seamless loop) */}
      <div className="relative marquee-mask">
        <div className="flex w-max gap-3 animate-marquee hover:[animation-play-state:paused]">
          {[...technologies, ...technologies].map((tech, i) => (
            <Pill key={`${tech}-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
