import { motion } from "framer-motion";
import RevealText from "./RevealText";

const technologies = [
  "Python",
  "PyTorch",
  "TensorFlow",
  "Large Language Models",
  "RAG Systems",
  "Computer Vision",
  "NLP",
  "Cloud-Native",
];

const TechStack = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <RevealText
            text="Technology Stack"
            className="font-display text-2xl md:text-3xl font-bold mb-3 justify-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Built on industry-leading tools and frameworks
          </motion.p>
        </div>

        {/* Tech Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="px-5 py-2.5 rounded-full bg-secondary border border-border text-foreground font-medium text-sm hover:border-primary/50 hover:bg-primary/10 transition-all cursor-default"
            >
              {tech}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TechStack;
