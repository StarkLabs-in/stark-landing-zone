import { motion } from "framer-motion";
import { Mail, MapPin, Github } from "lucide-react";
import { fadeUp, scaleIn, stagger, inViewProps } from "@/lib/motion";

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div {...inViewProps} variants={stagger(0.1)} className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={fadeUp} className="font-display text-3xl md:text-5xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Ready to build production-grade AI systems? Let's discuss how Starklabs can help.
          </motion.p>

          {/* Contact Box */}
          <motion.div
            variants={scaleIn}
            className="bg-card border border-border rounded-3xl p-10"
          >
            <div className="grid sm:grid-cols-3 gap-8">
              <motion.a
                href="mailto:starklabs.in@gmail.com"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">Email</span>
                <span className="text-foreground font-medium group-hover:text-primary transition-colors text-sm">starklabs.in@gmail.com</span>
              </motion.a>

              <motion.a
                href="https://github.com/StarkLabs-in"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">GitHub</span>
                <span className="text-foreground font-medium group-hover:text-primary transition-colors">StarkLabs-in</span>
              </motion.a>

              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">Location</span>
                <span className="text-foreground font-medium">India (Global Delivery)</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
