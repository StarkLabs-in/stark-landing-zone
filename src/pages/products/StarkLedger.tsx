import { motion } from "framer-motion";
import { ArrowLeft, FileText, Shield, Zap, Database } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  { icon: Shield, title: "Enterprise Security", description: "End-to-end encryption and audit trails" },
  { icon: Zap, title: "AI-Powered Automation", description: "Intelligent document processing and workflows" },
  { icon: Database, title: "Scalable Storage", description: "Cloud-native architecture for unlimited growth" },
];

const StarkLedger = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Link */}
          <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Platforms
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
                  In Development
                </span>
              </div>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Stark<span className="gradient-text">Ledger</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Secure, intelligent platform for digital records and automation. Built for enterprises requiring auditable, AI-enhanced document management with full compliance support.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 max-w-4xl"
          >
            {features.map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl bg-card border border-border">
                <feature.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 p-8 rounded-2xl bg-secondary/50 border border-border max-w-4xl"
          >
            <h2 className="font-display text-2xl font-semibold mb-3">Coming Soon</h2>
            <p className="text-muted-foreground">
              StarkLedger is currently in active development. Contact us at{" "}
              <a href="mailto:contact@starklabs.in" className="text-primary hover:underline">
                contact@starklabs.in
              </a>{" "}
              to learn more or request early access.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StarkLedger;
