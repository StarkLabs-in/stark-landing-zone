import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, Cpu, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MagneticElement from "./MagneticElement";
import { fadeUp, stagger, inViewProps } from "@/lib/motion";

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
    icon: Cpu,
    title: "Future AI Club",
    description: "An AI & technology learning community exploring AI, coding, and digital creativity through hands-on workshops. Beginner-friendly and open to all ages.",
    link: "/products/future-ai-club",
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
        <motion.div {...inViewProps} variants={stagger(0.08)} className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-block text-xs font-mono uppercase tracking-[0.25em] text-primary mb-4"
          >
            Our Portfolio
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Products</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Production-grade AI products designed to solve real problems at scale.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          {...inViewProps}
          variants={stagger(0.12)}
          className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        >
          {projects.map((project) => (
            <motion.div key={project.title} variants={fadeUp} className="group">
              <MagneticElement intensity={0.15} className="h-full">
                <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 card-glow flex flex-col">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <project.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-3 text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>
                  <MagneticElement intensity={0.2}>
                    <Link to={project.link}>
                      <Button variant="outline" className="group/btn w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </MagneticElement>
                </div>
              </MagneticElement>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
