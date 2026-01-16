import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-32 relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="gradient-text">Collaborate?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Whether you're a researcher, investor, or visionary company, we're always 
            looking for partners who share our passion for innovation.
          </p>

          {/* CTA Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card border border-border rounded-3xl p-10 glow-effect"
          >
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">Email Us</span>
                <span className="text-foreground font-medium">contact@starklabs.io</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">Call Us</span>
                <span className="text-foreground font-medium">+1 (555) 123-4567</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground mb-1">Visit Us</span>
                <span className="text-foreground font-medium">Silicon Valley, CA</span>
              </div>
            </div>

            <Button size="lg" className="glow-effect text-lg px-10 py-6">
              Schedule a Visit
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
