import { motion } from "framer-motion";
import { Brain, Atom, Leaf, Shield, Cpu, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description: "Developing next-generation AI systems that understand, learn, and adapt to complex real-world scenarios.",
  },
  {
    icon: Atom,
    title: "Quantum Computing",
    description: "Pioneering quantum algorithms and hardware to solve previously unsolvable computational challenges.",
  },
  {
    icon: Leaf,
    title: "Sustainable Energy",
    description: "Creating clean energy solutions that power the future while protecting our planet.",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Building unbreakable security protocols to protect critical infrastructure and data.",
  },
  {
    icon: Cpu,
    title: "Advanced Robotics",
    description: "Engineering autonomous systems that work alongside humans in manufacturing and exploration.",
  },
  {
    icon: Globe,
    title: "Space Technology",
    description: "Developing technologies for deep space exploration and satellite communication systems.",
  },
];

const Features = () => {
  return (
    <section id="solutions" className="py-32 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Research Areas</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We focus on breakthrough technologies that will shape the next century of human progress.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 card-glow">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
