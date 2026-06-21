import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ArrowRight, CheckCircle2, ImageIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import FutureAiClubScene from "@/components/FutureAiClubScene";
import DemoModeBanner from "@/components/DemoModeBanner";

/* ------------------------------------------------------------------ */
/* Centralized image constants — swap any of these for real photos    */
/* later without touching layout code. Style: people-first,           */
/* collaborative learning. No robots, hardware kits, or boardrooms.   */
/* ------------------------------------------------------------------ */
const IMAGES = {
  heroCommunityImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",

  // Who Might Be Interested
  studentsLearningImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
  parentLearningImage: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=600&q=80",
  professionalsImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80",
  techEnthusiastsImage: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=600&q=80",
  curiousBeginnersImage: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=600&q=80",
  lifelongLearnersImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",

  // What We Hope To Explore Together
  aiToolsImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  codingWorkshopImage: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80",
  creativeProjectsImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
  websitesImage: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=600&q=80",
  problemSolvingImage: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&q=80",
  technologyDiscussionImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",

  // Community Gallery
  galleryWorkshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80",
  galleryParentLearning: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=700&q=80",
  galleryStudentsBuilding: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=700&q=80",
  galleryCollaboration: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=700&q=80",
  galleryTechDiscussion: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=700&q=80",
  galleryProjectShowcase: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=700&q=80",

  // What Happens Next
  stepSignupImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=500&q=80",
  stepWorkshopImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500&q=80",
  stepCommunityImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=500&q=80",
  stepBuildImage: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=500&q=80",
  projectShowcaseImage: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=500&q=80",

  // Starting Small trust banner
  communityMeetupImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80",
};

/* ------------------------------------------------------------------ */
/* Image with a graceful on-brand fallback so the layout never breaks  */
/* if a URL fails — shows a dark gradient + icon instead.              */
/* ------------------------------------------------------------------ */
function SmartImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
          <ImageIcon className="w-8 h-8 text-cyan-500/40" />
        </div>
      )}
    </div>
  );
}

/* Visual-led card: image + short label, used for audience & topic grids. */
function ImageCard({ image, label, idx = 0 }: { image: string; label: string; idx?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: idx * 0.05 }}
      className="group relative rounded-2xl overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-colors duration-300"
    >
      <SmartImage
        src={image}
        alt={label}
        className="aspect-[4/3] [&>img]:transition-transform [&>img]:duration-500 group-hover:[&>img]:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/20 to-transparent" />
      <span className="absolute bottom-3 left-4 right-4 font-display font-semibold text-white text-sm sm:text-base">
        {label}
      </span>
    </motion.div>
  );
}

export default function FutureAiClub() {
  // Page SEO tags injection
  useEffect(() => {
    document.title = "Future AI Club | Interest List | Stark Labs";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "We're exploring the possibility of building a community where curious people can learn AI, coding, creativity, and technology together. Join the interest list.");

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', "AI Learning Club, Future AI Club, Learn AI, Coding Club, Technology Community, Stark Labs");
  }, []);

  // ──────────────────────────────────────────────────────
  // NEW INTEREST VALIDATION STATES
  // ──────────────────────────────────────────────────────
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isInterestSubmitting, setIsInterestSubmitting] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  // Interest Form Fields
  const [interestName, setInterestName] = useState("");
  const [interestWhatsApp, setInterestWhatsApp] = useState("");
  const [interestEmail, setInterestEmail] = useState("");
  const [interestRole, setInterestRole] = useState("");
  const [interestCommunity, setInterestCommunity] = useState("");
  const [interestSelectedList, setInterestSelectedList] = useState<string[]>([]);
  const [interestTiming, setInterestTiming] = useState("");
  const [interestWorkshop, setInterestWorkshop] = useState("");

  const handleCheckboxToggle = (val: string) => {
    setInterestSelectedList(prev =>
      prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
    );
  };

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interestName || !interestWhatsApp || !interestRole || !interestCommunity || interestSelectedList.length === 0 || !interestTiming || !interestWorkshop) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsInterestSubmitting(true);
    try {
      const payload = {
        parent_name: interestName,
        mobile_number: interestWhatsApp,
        email_address: interestEmail || "",
        student_name: interestRole,
        community: interestCommunity,
        program: interestSelectedList.join(", "),
        preferred_batch: interestTiming,
        status: `interest_list_workshop_${interestWorkshop.toLowerCase().replace(/ /g, "_")}`
      };

      const { error } = await supabase.from("leads").insert(payload);
      if (error) throw error;

      setInterestSubmitted(true);
      toast.success("Thank you for joining the interest list!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred. Please try again.");
    } finally {
      setIsInterestSubmitting(false);
    }
  };

  const resetInterestForm = () => {
    setInterestName("");
    setInterestWhatsApp("");
    setInterestEmail("");
    setInterestRole("");
    setInterestCommunity("");
    setInterestSelectedList([]);
    setInterestTiming("");
    setInterestWorkshop("");
    setInterestSubmitted(false);
    setIsInterestModalOpen(false);
  };

  const scrollToWhyThisExists = () => {
    const el = document.getElementById("why-this-exists");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // ──────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-foreground">
      <Navbar />
      {!isSupabaseConfigured && <DemoModeBanner />}

      {/* 3D Immersive background scene */}
      <FutureAiClubScene isIntro={false} />

      {/* ══════════════════════════════════════════════════ */}
      {/* HERO SECTION                                       */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 mb-8 font-display text-xs font-semibold tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Community Interest List Now Open</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6 leading-tight text-white"
            >
              Future Inventions{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-500 bg-clip-text text-transparent">
                Start Here
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-sans"
            >
              People like you, learning AI, coding, and creativity together.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center"
            >
              <Button
                size="lg"
                onClick={() => setIsInterestModalOpen(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-lg px-8 py-6 rounded-lg w-full sm:w-auto transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
              >
                Join the Interest List
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToWhyThisExists}
                className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900/40 font-semibold text-lg px-8 py-6 rounded-lg w-full sm:w-auto transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>

            {/* Micro Trust Bar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center lg:justify-start gap-6 mt-8 text-slate-400 text-sm flex-wrap font-display font-medium"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" /> All Ages Welcome
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" /> No Experience Needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" /> Community Driven
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="text-cyan-400 w-4 h-4" /> Free Discovery Workshop Planned
              </span>
            </motion.div>
          </div>

          {/* Floating hero image panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
            transition={{ opacity: { duration: 0.7, delay: 0.2 }, scale: { duration: 0.7, delay: 0.2 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/15 to-amber-500/10 rounded-[2rem] blur-2xl pointer-events-none" />
            <SmartImage
              src={IMAGES.heroCommunityImage}
              alt="Students, parents, and professionals learning together around laptops"
              className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-3xl border border-cyan-500/20 shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800/80">
              <span className="w-9 h-9 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </span>
              <span className="text-xs text-slate-300">People like you, exploring AI together.</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHY WE'RE EXPLORING THIS                           */}
      {/* ══════════════════════════════════════════════════ */}
      <section id="why-this-exists" className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <SmartImage
              src={IMAGES.communityMeetupImage}
              alt="A small group discussing ideas together"
              className="aspect-[4/3] rounded-2xl border border-slate-800/80 order-last md:order-none"
            />
            <div>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white mb-4">
                Why We&apos;re Exploring This
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mb-6 rounded-full" />
              <p className="text-lg text-slate-300 leading-relaxed font-sans">
                AI is changing how people learn and create — before organizing workshops, we want to see if
                enough curious people would like to explore it together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHO MIGHT BE INTERESTED?                           */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
              Who Might Be Interested?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "Students", image: IMAGES.studentsLearningImage },
              { label: "Parents", image: IMAGES.parentLearningImage },
              { label: "Working Professionals", image: IMAGES.professionalsImage },
              { label: "Technology Enthusiasts", image: IMAGES.techEnthusiastsImage },
              { label: "Curious Beginners", image: IMAGES.curiousBeginnersImage },
              { label: "Lifelong Learners", image: IMAGES.lifelongLearnersImage },
            ].map((card, idx) => (
              <ImageCard key={card.label} image={card.image} label={card.label} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHAT WE HOPE TO EXPLORE TOGETHER                   */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-cyan-500 font-display text-sm font-semibold tracking-wider uppercase mb-2 block">
              Exploratory Tracks
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
              What We Hope To Explore Together
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { label: "AI Tools", image: IMAGES.aiToolsImage },
              { label: "Coding Basics", image: IMAGES.codingWorkshopImage },
              { label: "Creative Projects", image: IMAGES.creativeProjectsImage },
              { label: "Websites", image: IMAGES.websitesImage },
              { label: "Problem Solving", image: IMAGES.problemSolvingImage },
              { label: "Technology Discussions", image: IMAGES.technologyDiscussionImage },
            ].map((card, idx) => (
              <ImageCard key={card.label} image={card.image} label={card.label} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* COMMUNITY GALLERY                                  */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
              Imagine What We Could Build Together
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="columns-2 md:columns-3 gap-4 [&>*]:mb-4">
            {[
              { image: IMAGES.galleryWorkshop, caption: "Small workshop group", ratio: "aspect-[4/5]" },
              { image: IMAGES.galleryParentLearning, caption: "Parent learning AI", ratio: "aspect-square" },
              { image: IMAGES.galleryStudentsBuilding, caption: "Students building projects", ratio: "aspect-[4/3]" },
              { image: IMAGES.galleryCollaboration, caption: "People collaborating", ratio: "aspect-square" },
              { image: IMAGES.galleryTechDiscussion, caption: "Technology discussion", ratio: "aspect-[4/5]" },
              { image: IMAGES.galleryProjectShowcase, caption: "Project showcase", ratio: "aspect-[4/3]" },
            ].map((g, idx) => (
              <motion.div
                key={g.caption}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="relative rounded-2xl overflow-hidden border border-slate-800/80 break-inside-avoid"
              >
                <SmartImage src={g.image} alt={g.caption} className={g.ratio} />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 right-3 px-2.5 py-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white">
                  {g.caption}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* STARTING SMALL — VISUAL TRUST BANNER               */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/80">
            <SmartImage
              src={IMAGES.communityMeetupImage}
              alt="A small group discussion"
              className="aspect-[16/9] md:aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/30" />
            <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-14 max-w-lg">
              <span className="text-amber-500 font-display text-sm font-semibold tracking-wider uppercase mb-3 block">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-white mb-4">
                We&apos;re Intentionally Starting Small
              </h2>
              <p className="text-slate-300 leading-relaxed font-sans">
                Future AI Club is being shaped together with its earliest members.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHAT HAPPENS NEXT — VISUAL STEP CARDS               */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <span className="text-cyan-500 font-display text-sm font-semibold tracking-wider uppercase mb-2 block">
              The Roadmap
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
              What Happens Next?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {[
              { step: "01", title: "Join Interest List", image: IMAGES.stepSignupImage },
              { step: "02", title: "Discovery Workshop", image: IMAGES.stepWorkshopImage },
              { step: "03", title: "Meet Community", image: IMAGES.stepCommunityImage },
              { step: "04", title: "Build Together", image: IMAGES.stepBuildImage },
              { step: "05", title: "Continue Learning", image: IMAGES.projectShowcaseImage },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="group relative rounded-2xl overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-colors duration-300"
              >
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  className="aspect-[3/4] [&>img]:transition-transform [&>img]:duration-500 group-hover:[&>img]:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  Step {item.step}
                </span>
                <span className="absolute bottom-3 left-3 right-3 font-display font-semibold text-white text-sm leading-snug">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* INTEREST FORM MODAL                                */}
      {/* ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isInterestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-950 border border-cyan-500/40 rounded-2xl w-full max-w-xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.15)] max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-slate-900/60 px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="font-display font-semibold text-cyan-400 text-sm tracking-wider uppercase">
                    Join the Interest List
                  </span>
                </div>
                <button
                  onClick={resetInterestForm}
                  className="text-slate-400 hover:text-white transition-colors font-bold text-lg p-1"
                >
                  ✕
                </button>
              </div>

              {/* Form Content / Success panel */}
              <div className="p-6 md:p-8 overflow-y-auto flex-grow">
                {!interestSubmitted ? (
                  <form onSubmit={handleInterestSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={interestName}
                        onChange={(e) => setInterestName(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                      />
                    </div>

                    {/* WhatsApp + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98401 23456"
                          value={interestWhatsApp}
                          onChange={(e) => setInterestWhatsApp(e.target.value)}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          value={interestEmail}
                          onChange={(e) => setInterestEmail(e.target.value)}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        You Are *
                      </label>
                      <select
                        required
                        value={interestRole}
                        onChange={(e) => setInterestRole(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="" className="bg-slate-950 text-slate-500">Select your role...</option>
                        <option value="Student" className="bg-slate-950 text-white">Student</option>
                        <option value="College Student" className="bg-slate-950 text-white">College Student</option>
                        <option value="Parent" className="bg-slate-950 text-white">Parent</option>
                        <option value="Working Professional" className="bg-slate-950 text-white">Working Professional</option>
                        <option value="Other" className="bg-slate-950 text-white">Other</option>
                      </select>
                    </div>

                    {/* Community */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        Which Community Do You Belong To? *
                      </label>
                      <select
                        required
                        value={interestCommunity}
                        onChange={(e) => setInterestCommunity(e.target.value)}
                        className="w-full bg-slate-900/60 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      >
                        <option value="" className="bg-slate-950 text-slate-500">Select your community...</option>
                        <option value="Prestige Eden Park" className="bg-slate-950 text-white">Prestige Eden Park</option>
                        <option value="Prestige Avalon Park" className="bg-slate-950 text-white">Prestige Avalon Park</option>
                        <option value="Prestige Glenbrook" className="bg-slate-950 text-white">Prestige Glenbrook</option>
                        <option value="Prestige High Fields" className="bg-slate-950 text-white">Prestige High Fields</option>
                        <option value="Other" className="bg-slate-950 text-white">Other</option>
                      </select>
                    </div>

                    {/* Interests */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Interested In (Select all that apply) *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["AI", "Coding", "Websites", "Games", "Creative Projects", "General Technology"].map(
                          (interest) => (
                            <label
                              key={interest}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                interestSelectedList.includes(interest)
                                  ? "bg-cyan-500/10 border-cyan-500 text-white"
                                  : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={interestSelectedList.includes(interest)}
                                onChange={() => handleCheckboxToggle(interest)}
                                className="accent-cyan-500 h-4 w-4"
                              />
                              <span className="text-sm font-medium">{interest}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    {/* Timing */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Preferred Timing *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Weekend Morning", "Weekend Evening", "Weekday Evening", "No Preference"].map((t) => (
                          <label
                            key={t}
                            className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                              interestTiming === t
                                ? "bg-amber-500/10 border-amber-500 text-white"
                                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="timing"
                              value={t}
                              checked={interestTiming === t}
                              onChange={() => setInterestTiming(t)}
                              className="accent-amber-500 h-4 w-4"
                            />
                            <span className="text-sm font-medium">{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Workshop */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Would You Attend A Free Discovery Workshop? *
                      </label>
                      <div className="flex gap-4">
                        {["Yes", "Maybe", "Not Sure"].map((opt) => (
                          <label
                            key={opt}
                            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all text-center ${
                              interestWorkshop === opt
                                ? "bg-cyan-500/10 border-cyan-500 text-white"
                                : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name="workshop"
                              value={opt}
                              checked={interestWorkshop === opt}
                              onChange={() => setInterestWorkshop(opt)}
                              className="accent-cyan-500 h-4 w-4"
                            />
                            <span className="text-sm font-semibold">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 border-t border-slate-900 mt-6">
                      <Button
                        type="submit"
                        disabled={isInterestSubmitting}
                        className="w-full bg-gradient-to-r from-cyan-500 to-amber-500 text-slate-950 font-bold hover:scale-[1.02] transition-transform py-6 text-base shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      >
                        {isInterestSubmitting ? "Submitting..." : "Join the Interest List"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  /* ── SUCCESS SCREEN ── */
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-6 py-6 px-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>

                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold font-display text-white">Thank You</h3>
                      <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
                        Thank you for your interest in Future AI Club.
                      </p>
                      <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                        We&apos;re currently exploring whether there is enough community interest to launch
                        workshops and learning events.
                      </p>
                      <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                        We&apos;ll keep you informed about future discovery workshops and community activities.
                      </p>
                    </div>

                    <div className="pt-6">
                      <Button
                        asChild
                        className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-8 py-3 rounded-lg transition-colors"
                      >
                        <Link to="/">Return to Homepage</Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
