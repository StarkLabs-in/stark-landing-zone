import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, Stars, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const projects = [
  {
    icon: FileText,
    title: "StarkLedger",
    description: "Secure, intelligent platform for digital records and automation. Built for enterprises requiring auditable, AI-enhanced document management.",
    link: "/products/starkledger",
  },
  {
    icon: Target,
    title: "Competitive Habit Tracker",
    description: "Gamified productivity and habit engineering platform. Combines behavioral science with AI to drive sustainable habit formation.",
    link: "/products/competitive-habit-tracker",
  },
  {
    icon: Stars,
    title: "Neural Tarot",
    description: "AI-powered astrology and numerology insights platform. Advanced LLM integration for personalized, meaningful interpretations.",
    link: "/products/neural-tarot",
  },
  {
    icon: Rocket,
    title: "Future Products",
    description: "Upcoming AI engineering tools by Starklabs. We're constantly building new solutions for emerging challenges.",
    link: "/products",
  },
];

const Projects = () => {
  return (
    <section id="products" className="py-24 relative">
      {/* Background Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Products</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Production-grade AI products designed to solve real problems at scale.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 card-glow flex flex-col">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <project.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-3 text-foreground">
                  {project.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>
                <Link to={project.link}>
                  <Button variant="outline" className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                    Learn More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
