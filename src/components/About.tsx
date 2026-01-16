import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const About = () => {
  const milestones = [
    "Founded by leading researchers from MIT and Stanford",
    "State-of-the-art facilities spanning 500,000 sq ft",
    "Partnerships with Fortune 500 companies worldwide",
    "Commitment to open-source and knowledge sharing",
  ];

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background Element */}
      <div className="absolute top-1/2 right-0 w-1/2 h-96 bg-primary/5 rounded-l-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Driving <span className="gradient-text">Scientific Breakthroughs</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              At Starklabs, we believe that the greatest challenges facing humanity 
              require bold thinking and relentless innovation. Our multidisciplinary 
              teams work at the intersection of science, engineering, and creativity 
              to develop solutions that matter.
            </p>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-foreground">{milestone}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden">
              {/* Animated Grid Background */}
              <div className="absolute inset-0 bg-secondary grid-pattern" />
              
              {/* Floating Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-64 h-64 border border-primary/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-48 h-48 border border-primary/50 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-32 h-32 bg-primary/20 rounded-full glow-effect"
                />
                <div className="absolute w-8 h-8 bg-primary rounded-full glow-effect" />
              </div>

              {/* Corner Accents */}
              <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/50 rounded-tl-xl" />
              <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary/50 rounded-br-xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
