import { motion } from "framer-motion";
import { ArrowRight, FileText, Target, Stars, Rocket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const products = [
  {
    icon: FileText,
    title: "StarkLedger",
    description: "Secure, intelligent platform for digital records and automation. Built for enterprises requiring auditable, AI-enhanced document management with full compliance support.",
    link: "/products/starkledger",
    status: "In Development",
  },
  {
    icon: Target,
    title: "Competitive Habit Tracker",
    description: "Gamified productivity and habit engineering platform. Combines behavioral science with AI to drive sustainable habit formation through competition and accountability.",
    link: "/products/competitive-habit-tracker",
    status: "In Development",
  },
  {
    icon: Stars,
    title: "Neural Tarot",
    description: "AI-powered astrology and numerology insights platform. Advanced LLM integration for personalized, meaningful interpretations based on cosmic patterns.",
    link: "/products/neural-tarot",
    status: "In Development",
  },
  {
    icon: Rocket,
    title: "More Coming Soon",
    description: "We're constantly building new AI engineering tools and products. Stay tuned for upcoming releases that push the boundaries of what's possible.",
    link: "/products",
    status: "Upcoming",
  },
];

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Link */}
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Our <span className="gradient-text">Products</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Production-grade AI products engineered for real-world impact.
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 card-glow flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <product.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
                      {product.status}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold mb-3 text-foreground">
                    {product.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {product.description}
                  </p>
                  <Link to={product.link}>
                    <Button variant="outline" className="w-full border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
