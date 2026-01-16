import { motion } from "framer-motion";
import { ArrowLeft, Target, Trophy, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  { icon: Trophy, title: "Gamified Tracking", description: "Points, streaks, and achievements that motivate" },
  { icon: Users, title: "Social Competition", description: "Challenge friends and compete on leaderboards" },
  { icon: TrendingUp, title: "AI Insights", description: "Personalized recommendations for habit optimization" },
];

const CompetitiveHabitTracker = () => {
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
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-muted-foreground">
                  In Development
                </span>
              </div>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Competitive <span className="gradient-text">Habit Tracker</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Gamified productivity and habit engineering platform. Combines behavioral science with AI to drive sustainable habit formation through competition and accountability.
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
              Competitive Habit Tracker is currently in active development. Contact us at{" "}
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

export default CompetitiveHabitTracker;
