import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import Projects from "@/components/Projects";
import WhyStarklabs from "@/components/WhyStarklabs";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ParallaxSection from "@/components/ParallaxSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      <ParallaxSection speed={0.2} offset={100}>
        <WhatWeDo />
      </ParallaxSection>

      <ParallaxSection speed={-0.1} offset={50}>
        <Projects />
      </ParallaxSection>

      <ParallaxSection speed={0.15} offset={80}>
        <WhyStarklabs />
      </ParallaxSection>

      <ParallaxSection speed={-0.05} offset={30}>
        <TechStack />
      </ParallaxSection>

      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
