import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import Projects from "@/components/Projects";
import WhyStarklabs from "@/components/WhyStarklabs";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <WhatWeDo />
      <Projects />
      <WhyStarklabs />
      <TechStack />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
