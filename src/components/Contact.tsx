import { motion } from "framer-motion";
import { Mail, MapPin, Github } from "lucide-react";
import RevealText from "./RevealText";

const Contact = () => {
  return (
    <section id="contact" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <RevealText
            text="Get in Touch"
            className="font-display text-3xl md:text-5xl font-bold mb-4 justify-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto"
          >
            Ready to build production-grade AI systems? Let's discuss how Starklabs can help.
          </motion.p>

          {/* Contact Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-3xl p-10"
          >
            <div className="grid sm:grid-cols-3 gap-8">
              <a 
                href="mailto:starklabs.in@gmail.com"
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">Email</span>
                <span className="text-foreground font-medium group-hover:text-primary transition-colors text-sm">starklabs.in@gmail.com</span>
              </a>
              
              <a 
                href="https://github.com/StarkLabs-in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Github className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">GitHub</span>
                <span className="text-foreground font-medium group-hover:text-primary transition-colors">StarkLabs-in</span>
              </a>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">Location</span>
                <span className="text-foreground font-medium">India (Global Delivery)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
