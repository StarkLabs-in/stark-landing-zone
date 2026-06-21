import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, CheckCircle2, Cpu, Brain, Code2,
  Gamepad2, Globe, Sparkles, MapPin, CalendarClock, Laptop, Users,
  GraduationCap, BookOpen, Briefcase, Lightbulb, Hammer, MessageSquare,
  HelpCircle, ChevronDown, Image as ImageIcon, X, Clock, HeartHandshake, Workflow
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendWelcomeEmail, postWhatsAppWebhook } from "@/lib/emailService";
import { toast } from "sonner";
import DemoModeBanner from "@/components/DemoModeBanner";

/* ------------------------------------------------------------------ */
/*  Imagery                                                            */
/*  Swap these URLs for your own photos or AI-generated imagery.       */
/*  Tip: drop files in /public/images/fac/ and use "/images/fac/x.jpg".*/
/*  Every <img> degrades to a branded placeholder if a URL fails.      */
/* ------------------------------------------------------------------ */

const IMAGES = {
  // People-first, collaborative learning imagery (no robotics/hardware/sci-fi).
  hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
  // AI tools / using AI on a laptop (replaces the previous robot-hand image).
  aiProject: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80",
  gameProject: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
  webProject: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1000&q=80",
  galleryCoding: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
  galleryWorkshop: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
  galleryTeam: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
  galleryDemo: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1000&q=80",
};

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

// Stored with each signup (shown in the admin console).
const PROGRAM = "Future AI Club — Workshops";

// Audience pills shown in the hero.
const OPEN_TO = ["Students", "College learners", "Working professionals", "Parents", "Technology enthusiasts"];

// At-a-glance facts (all ages, no prerequisites).
const HERO_FACTS = [
  { icon: Users, label: "All ages welcome", sub: "No age restrictions" },
  { icon: CalendarClock, label: "Weekend workshops", sub: "Morning or evening" },
  { icon: Sparkles, label: "Beginner-friendly", sub: "No experience needed" },
  { icon: MapPin, label: "Prestige Clubhouse", sub: "Small group sessions" },
];

// Quick, scannable proof points.
const TRUST_BAR = [
  { icon: Users, text: "Small Group Learning" },
  { icon: CalendarClock, text: "Weekend Workshops" },
  { icon: Hammer, text: "Project-Based Sessions" },
  { icon: Laptop, text: "Bring Your Own Laptop" },
  { icon: MessageSquare, text: "Community Meetups" },
  { icon: GraduationCap, text: "Mentor Guidance" },
];

// The three reassurances.
const REASSURE = [
  { icon: Users, title: "No age restrictions", desc: "From teenagers to working professionals — everyone curious is welcome." },
  { icon: Sparkles, title: "No prerequisites", desc: "Start from zero. We build up from the very basics, together." },
  { icon: Cpu, title: "No technical background", desc: "No coding or tech experience needed to join and enjoy it." },
];

// The single learning path.
const PATH_TOPICS = [
  "AI Tools", "Prompting", "Scratch Coding", "Python Basics",
  "Website Creation", "Digital Creativity", "Problem Solving",
];

// What You'll Learn cards.
const LEARN = [
  { icon: Brain, title: "Understand AI Tools", desc: "Learn how to use modern AI tools effectively and responsibly." },
  { icon: Gamepad2, title: "Create Interactive Projects", desc: "Build simple games, quizzes, and creative applications." },
  { icon: Code2, title: "Learn Coding Fundamentals", desc: "Explore coding concepts through beginner-friendly activities." },
  { icon: Globe, title: "Build Websites", desc: "Create personal and project websites." },
  { icon: Lightbulb, title: "Improve Problem Solving", desc: "Develop logical thinking and creativity." },
  { icon: Users, title: "Learn With a Community", desc: "Collaborate with other curious learners." },
];

// Who Is This For cards.
const AUDIENCE = [
  { icon: GraduationCap, label: "Students" },
  { icon: BookOpen, label: "College Learners" },
  { icon: Briefcase, label: "Working Professionals" },
  { icon: Users, label: "Parents Exploring AI" },
  { icon: Cpu, label: "Technology Enthusiasts" },
  { icon: Sparkles, label: "Lifelong Learners" },
];

// Project showcase (hands-on, people-first — no robotics/hardware imagery).
const SHOWCASE = [
  {
    image: IMAGES.aiProject,
    icon: Sparkles,
    title: "AI Story Creator",
    desc: "Learn how AI tools work, write better prompts, and create stories, ideas, and content using AI.",
    skills: ["Understanding AI tools", "Writing effective prompts", "Creative thinking"],
  },
  {
    image: IMAGES.gameProject,
    icon: Gamepad2,
    title: "Interactive Game or Quiz",
    desc: "Design and build a simple game or quiz, and learn the logic that makes it work.",
    skills: ["Game logic & rules", "Design & creativity", "Coding basics"],
  },
  {
    image: IMAGES.webProject,
    icon: Globe,
    title: "Personal Website",
    desc: "Create your own web page and publish something you can proudly share online.",
    skills: ["Pages & layout", "Publishing online", "Digital creativity"],
  },
];

// Community gallery — authentic, people-first learning visuals.
const GALLERY = [
  { image: IMAGES.galleryWorkshop, caption: "Small workshop group" },
  { image: IMAGES.galleryTeam, caption: "Learning together" },
  { image: IMAGES.galleryCoding, caption: "Collaborative session" },
  { image: IMAGES.galleryDemo, caption: "Project showcase" },
];

// Why Join Early benefits.
const EARLY_BENEFITS = [
  { icon: Users, text: "Small group learning" },
  { icon: GraduationCap, text: "Direct mentor interaction" },
  { icon: Hammer, text: "Project-based sessions" },
  { icon: MessageSquare, text: "Community discussions" },
  { icon: Sparkles, text: "Early member benefits" },
];

const FAQS = [
  { q: "Do I need any experience to join?", a: "No. Future AI Club is beginner-friendly — there are no prerequisites and no technical background required." },
  { q: "Who can join?", a: "Anyone curious about technology — students, college learners, working professionals, parents, and lifelong learners. There are no age restrictions." },
  { q: "What do I need to bring?", a: "Just a laptop. We'll share simple setup steps before your first session — there's nothing to buy." },
  { q: "When and where are sessions held?", a: "Weekend workshops (morning or evening) at the Prestige Community Clubhouse, in small groups." },
  { q: "How do I get started?", a: "Book a free discovery workshop or join the founding cohort — our team will reach out to confirm your spot." },
];

// How a typical session works (horizontal timeline).
const SESSION_STEPS = [
  { icon: Sparkles, title: "Discover", desc: "Short introduction to the topic." },
  { icon: BookOpen, title: "Learn", desc: "Understand a concept through examples." },
  { icon: Hammer, title: "Build", desc: "Create a small project together." },
  { icon: MessageSquare, title: "Share", desc: "Discuss ideas and showcase progress." },
  { icon: Lightbulb, title: "Take Home", desc: "Practice and continue learning." },
];

// "Why we're starting small" trust cards.
const WHY_SMALL = [
  { icon: Users, title: "Small Group Learning", desc: "Tiny cohorts so everyone gets attention and space to ask questions." },
  { icon: HeartHandshake, title: "Personal Guidance", desc: "Direct, hands-on help from mentors who build with technology." },
  { icon: MessageSquare, title: "Community Driven", desc: "We learn together — sharing ideas, projects, and progress." },
];

// Free discovery workshop quick facts.
const DISCOVERY = [
  { icon: Clock, label: "Duration", value: "60 Minutes" },
  { icon: Users, label: "Who Can Join", value: "Students, Parents, Professionals" },
  { icon: Sparkles, label: "Experience Required", value: "None" },
  { icon: Hammer, label: "Format", value: "Hands-On" },
  { icon: MapPin, label: "Location", value: "Prestige Community Clubhouse" },
  { icon: CheckCircle2, label: "Cost", value: "Free" },
];

// "What happens next" — reduces uncertainty before signing up.
const NEXT_STEPS = [
  "Register interest",
  "Join a free discovery workshop",
  "Meet the community",
  "Build your first project",
  "Decide whether you want to continue",
];

// Registration form options.
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];
const INTEREST_OPTIONS = ["AI", "Coding", "Websites", "Games", "Creative Projects"];
const TIMING_OPTIONS = ["Weekend Morning", "Weekend Evening"];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const digitsOnly = (v: string) => v.replace(/[^0-9]/g, "");

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FutureAiClubProduct() {
  useEffect(() => {
    document.title = "Future AI Club | Stark Labs — An AI & Technology Learning Community";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute(
      "content",
      "A beginner-friendly community where curious minds learn AI, coding, technology, and digital creativity through hands-on workshops and collaborative learning. Open to all ages."
    );
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1-3 form, 4 success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form state
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [laptopAvailable, setLaptopAvailable] = useState<boolean | null>(null);
  const [timing, setTiming] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    if (sameAsPhone) setWhatsapp(phone);
  }, [phone, sameAsPhone]);

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const openModal = () => {
    setIsModalOpen(true);
    setStep(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (step === 4) resetForm();
  };

  const resetForm = () => {
    setStep(1);
    setFullName(""); setAge(""); setOccupation("");
    setPhone(""); setWhatsapp(""); setSameAsPhone(true); setEmail("");
    setExperience(""); setInterests([]); setLaptopAvailable(null);
    setTiming(""); setConsent(false); setRegistrationId(null);
  };

  const validateStep = () => {
    if (step === 1) {
      const ageNum = parseInt(age, 10);
      if (!fullName.trim() || !age || !occupation.trim()) {
        toast.error("Please complete your name, age, and occupation.");
        return false;
      }
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 100) {
        toast.error("Please enter a valid age.");
        return false;
      }
    }
    if (step === 2) {
      if (!phone.trim() || !whatsapp.trim() || !email.trim()) {
        toast.error("Please complete all contact fields.");
        return false;
      }
      if (digitsOnly(phone).length < 10) {
        toast.error("Enter a valid phone number.");
        return false;
      }
      if (!isValidEmail(email)) {
        toast.error("Enter a valid email address.");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience) {
      toast.error("Please choose your experience level.");
      return;
    }
    if (!timing) {
      toast.error("Please choose a preferred workshop timing.");
      return;
    }
    if (laptopAvailable === null) {
      toast.error("Please tell us about laptop availability.");
      return;
    }
    if (!consent) {
      toast.error("Please accept the terms to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate ids client-side so we don't need to read rows back from
      // tables the anon role isn't granted SELECT on (parents/students are
      // insert-only for public). This also avoids a race condition where a
      // concurrent signup with the same name/email could be matched instead
      // of the one we just created.
      const parentId = crypto.randomUUID();
      const studentId = crypto.randomUUID();

      // 1. Member contact
      const { error: parentError } = await supabase.from("parents").insert({
        id: parentId,
        parent_name: fullName.trim(),
        mobile_number: phone.trim(),
        whatsapp_number: whatsapp.trim(),
        email_address: email.trim(),
        occupation: occupation.trim(),
      });
      if (parentError) throw parentError;

      // 2. Member profile
      const { error: studentError } = await supabase.from("students").insert({
        id: studentId,
        student_name: fullName.trim(),
        age: parseInt(age, 10),
        date_of_birth: null,
        school_name: "N/A",
        grade_class: "N/A",
      });
      if (studentError) throw studentError;

      // 3. Membership / workshop interest
      const { data: savedReg, error: regError } = await supabase
        .from("registrations")
        .insert({
          student_id: studentId,
          parent_id: parentId,
          interests: [`Experience: ${experience}`, ...interests],
          laptop_available: laptopAvailable === true,
          operating_system: "N/A",
          internet_available: true,
          program: PROGRAM,
          preferred_batch: timing,
          consent_project_based: consent,
          consent_communication: consent,
          consent_terms_privacy: consent,
          status: "interested",
        })
        .select()
        .single();
      if (regError) throw regError;

      // 4. Notifications
      await sendWelcomeEmail(email.trim(), fullName.trim(), savedReg.registration_id);
      await postWhatsAppWebhook({
        studentName: fullName.trim(),
        studentAge: parseInt(age, 10),
        parentName: fullName.trim(),
        phone: whatsapp.trim(),
        program: PROGRAM,
        batch: timing,
      });

      setRegistrationId(savedReg.registration_id);
      setStep(4);
      toast.success("You're on the list — welcome to the community!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      {!isSupabaseConfigured && <DemoModeBanner />}

      <main className="pt-28 pb-24">
        <div className="container mx-auto px-6">
          <Link
            to="/products"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>

          {/* ---------------- HERO ---------------- */}
          <section className="relative">
            <div className="absolute -top-20 -left-20 w-[420px] h-[420px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: copy + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs font-mono uppercase tracking-widest text-primary mb-6">
                  <Cpu className="w-3.5 h-3.5" />
                  Stark Labs · Learning Community
                </div>

                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-5">
                  Future Inventions <span className="gradient-text">Start Here</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-4">
                  Explore AI, coding, digital tools, and creative technology projects in a
                  practical, beginner-friendly learning community.
                </p>

                {/* Audience line */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {OPEN_TO.map((a) => (
                    <span key={a} className="px-2.5 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground">
                      {a}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={openModal}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_30px_-8px_hsl(var(--primary))]"
                  >
                    Book a Free Discovery Workshop
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    onClick={openModal}
                    size="lg"
                    variant="outline"
                    className="border-border hover:bg-secondary"
                  >
                    Join the Founding Cohort
                  </Button>
                </div>
                <WorkshopTrustLine className="mt-5" />
              </motion.div>

              {/* Right: premium hero image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-3 bg-gradient-to-tr from-primary/20 to-purple-500/10 rounded-[2rem] blur-2xl pointer-events-none" />
                <SmartImage
                  src={IMAGES.hero}
                  alt="A community of learners exploring AI and coding together"
                  icon={Users}
                  className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5] rounded-3xl border border-border shadow-2xl"
                />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 p-3 rounded-xl bg-background/70 backdrop-blur-md border border-border">
                  <span className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Come explore AI and technology with us — hands-on, together.
                  </span>
                </div>
              </motion.div>
            </div>

            {/* At-a-glance facts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-border/60"
            >
              {HERO_FACTS.map((fact) => (
                <div key={fact.label} className="bg-card px-4 py-5 flex items-start gap-3">
                  <fact.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold leading-tight">{fact.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{fact.sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </section>

          {/* ---------------- TRUST BAR ---------------- */}
          <section className="mt-14">
            <div className="rounded-2xl border border-border bg-card/60 px-6 py-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {TRUST_BAR.map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <item.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- POSITIONING ---------------- */}
          <section className="mt-28 max-w-5xl">
            <SectionLabel icon={Sparkles}>An open learning community</SectionLabel>
            <div className="grid md:grid-cols-2 gap-10 items-start">
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                A community where curious minds learn{" "}
                <span className="gradient-text">AI, coding & digital creativity</span> together.
              </h2>
              <div className="space-y-3">
                {REASSURE.map((r) => (
                  <div key={r.title} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                    <span className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <r.icon className="w-4.5 h-4.5 text-primary" />
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{r.title}</div>
                      <div className="text-sm text-muted-foreground">{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- WHAT WE'LL EXPLORE ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={Sparkles}>An invitation, not a syllabus</SectionLabel>
            <div className="relative rounded-3xl border border-border bg-card overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-[0.04] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-[360px] h-[360px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="relative p-8 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold">What We'll Explore Together</h2>
                </div>
                <p className="text-muted-foreground mb-8 max-w-xl">
                  A relaxed, hands-on look at the tools and ideas we'll play with — no age limits,
                  no prior experience, and no pressure to keep up.
                </p>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                  Things we'll try
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {PATH_TOPICS.map((t) => (
                    <span
                      key={t}
                      className="px-3.5 py-1.5 rounded-full bg-secondary border border-border text-sm font-medium hover:border-primary/40 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- WHAT YOU'LL LEARN ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={Brain}>What you'll learn</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 max-w-2xl">
              Practical skills, learned by <span className="gradient-text">building</span>.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {LEARN.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ---------------- WHO IS THIS FOR ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={Users}>Who is this for?</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 max-w-2xl">
              If you're curious about technology, <span className="gradient-text">you belong here</span>.
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {AUDIENCE.map((a, i) => (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex items-center gap-3 p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors"
                >
                  <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <a.icon className="w-5 h-5 text-primary" />
                  </span>
                  <span className="font-medium">{a.label}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ---------------- PROJECT SHOWCASE ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={Gamepad2}>Project showcase</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 max-w-2xl">
              The kinds of things you'll <span className="gradient-text">build</span>.
            </h2>
            <p className="text-muted-foreground mb-12 max-w-xl">
              Hands-on projects you'll create and share across workshops — start simple, grow from there.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SHOWCASE.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 card-glow overflow-hidden flex flex-col"
                >
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    icon={item.icon}
                    className="aspect-[16/10] w-full"
                  />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <item.icon className="w-4 h-4 text-primary" />
                      </span>
                      <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                    <div className="flex-grow">
                      <span className="block text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                        What you'll practise
                      </span>
                      <ul className="space-y-1.5">
                        {item.skills.map((skill) => (
                          <li key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ---------------- COMMUNITY GALLERY ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={ImageIcon}>Inside the community</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 max-w-2xl">
              Real workshops, real builds, real <span className="gradient-text">people</span>.
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {GALLERY.map((g, i) => (
                <motion.div
                  key={g.caption}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  className={`group relative rounded-2xl border border-border overflow-hidden ${
                    i === 0 ? "col-span-2 lg:col-span-2 lg:row-span-2" : ""
                  }`}
                >
                  <SmartImage
                    src={g.image}
                    alt={g.caption}
                    icon={ImageIcon}
                    className={i === 0 ? "aspect-[4/3] lg:aspect-square" : "aspect-[4/3]"}
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-background/70 backdrop-blur-sm border border-border text-[11px] font-medium">
                    {g.caption}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ---------------- WHY JOIN EARLY ---------------- */}
          <section className="mt-28">
            <div className="relative rounded-3xl border border-border bg-card overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />
              <div className="absolute -top-24 -left-24 w-[360px] h-[360px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
              <div className="relative p-10 md:p-14">
                <SectionLabel icon={Sparkles}>Why join early?</SectionLabel>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 max-w-2xl">
                  Help shape the community from <span className="gradient-text">day one</span>.
                </h2>
                <p className="text-muted-foreground mb-10 max-w-2xl">
                  Join the founding cohort and help shape a learning community focused on practical
                  technology skills.
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {EARLY_BENEFITS.map((b) => (
                    <div key={b.text} className="p-4 rounded-xl bg-background/40 border border-border">
                      <b.icon className="w-5 h-5 text-primary mb-3" />
                      <span className="text-sm font-medium leading-snug">{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- FOUNDING COHORT DETAILS ---------------- */}
          <section className="mt-28">
            <div className="rounded-3xl border border-border bg-card/60 p-10 md:p-14">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono uppercase tracking-widest text-primary mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Limited Seats · Founding Cohort
              </span>
              <div className="grid md:grid-cols-4 gap-8">
                <FoundingItem icon={MapPin} label="Location" value="Prestige Community Clubhouse" />
                <FoundingItem icon={CalendarClock} label="Format" value="Weekend Workshops" />
                <FoundingItem icon={Laptop} label="Bring" value="Your Own Laptop" />
                <FoundingItem icon={Users} label="Group" value="Small Cohort" />
              </div>
            </div>
          </section>

          {/* ---------------- HOW A SESSION WORKS ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={Workflow}>How a typical session works</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 max-w-2xl">
              Simple, practical, and <span className="gradient-text">beginner-friendly</span>.
            </h2>
            <p className="text-muted-foreground mb-12 max-w-xl">
              Here's what a typical workshop looks like — from first idea to taking something home.
            </p>

            <div className="flex flex-col lg:flex-row lg:items-stretch gap-4">
              {SESSION_STEPS.map((s, i) => (
                <Fragment key={s.title}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex-1 p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/40 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <s.icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
                      Step {i + 1}
                    </span>
                    <h3 className="font-display font-semibold mt-1 mb-1.5">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </motion.div>

                  {i < SESSION_STEPS.length - 1 && (
                    <div className="flex items-center justify-center text-primary/40 shrink-0">
                      <ArrowRight className="hidden lg:block w-5 h-5" />
                      <ChevronDown className="lg:hidden w-5 h-5" />
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          </section>

          {/* ---------------- FAQ ---------------- */}
          <section className="mt-28 max-w-3xl mx-auto">
            <SectionLabel icon={HelpCircle}>Common questions</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
              Everything you might <span className="gradient-text">wonder</span>.
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={faq.q} className="rounded-2xl bg-card border border-border overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="font-display font-semibold">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ---------------- BUILDING SOMETHING NEW ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={HeartHandshake}>Building something new</SectionLabel>
            <div className="grid lg:grid-cols-2 gap-10 items-start mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
                We're just getting started — and we're being <span className="gradient-text">honest about it</span>.
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Future AI Club is starting with a small founding cohort.</p>
                <p>
                  We're beginning with practical workshops, collaborative learning, and simple
                  projects. The first members will help shape future workshops, projects, and
                  community events.
                </p>
                <p className="text-foreground font-medium">
                  No fake testimonials, no fake numbers — just a real community being built together.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {WHY_SMALL.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <c.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-1.5">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ---------------- FREE DISCOVERY WORKSHOP ---------------- */}
          <section className="mt-28">
            <div className="relative rounded-3xl border border-primary/30 bg-card overflow-hidden">
              <div className="absolute inset-0 grid-pattern opacity-[0.05] pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-[360px] h-[360px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
              <div className="relative p-10 md:p-14">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono uppercase tracking-widest text-primary mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Free · No commitment
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 max-w-2xl">
                  Start With a Free <span className="gradient-text">Discovery Workshop</span>
                </h2>
                <p className="text-muted-foreground mb-10 max-w-2xl">
                  See if Future AI Club is right for you before joining the founding cohort.
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-border bg-border/60 mb-10">
                  {DISCOVERY.map((d) => (
                    <div key={d.label} className="bg-card px-5 py-5 flex items-start gap-3">
                      <d.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                          {d.label}
                        </div>
                        <div className="text-sm font-semibold leading-tight">{d.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={openModal}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 shadow-[0_0_30px_-8px_hsl(var(--primary))]"
                >
                  Reserve My Seat
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <WorkshopTrustLine className="mt-5" />
              </div>
            </div>
          </section>

          {/* ---------------- WHAT HAPPENS NEXT ---------------- */}
          <section className="mt-28">
            <SectionLabel icon={Workflow}>What happens next?</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 max-w-2xl">
              A simple, low-pressure <span className="gradient-text">first step</span>.
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {NEXT_STEPS.map((stepText, i) => (
                <motion.div
                  key={stepText}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <span className="font-display text-2xl font-bold gradient-text">{i + 1}</span>
                  <p className="text-sm font-medium mt-2 leading-snug">{stepText}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ---------------- REGISTRATION CTA ---------------- */}
          <section className="mt-28 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-5">
              Come Explore <span className="gradient-text">With Us</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-4">
              Come explore AI and technology with us — a beginner-friendly community learning
              through hands-on workshops and projects.
            </p>
            <p className="text-sm text-muted-foreground mb-10">
              Start with a free workshop. <span className="text-foreground font-medium">No experience, no commitment</span> — just curiosity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={openModal}
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary font-semibold px-8 order-2 sm:order-1"
              >
                Join the Founding Cohort
              </Button>
              <Button
                onClick={openModal}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-10 shadow-[0_0_30px_-8px_hsl(var(--primary))] order-1 sm:order-2"
              >
                Book a Free Discovery Workshop
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <WorkshopTrustLine className="justify-center mt-6" />
          </section>
        </div>
      </main>

      <Footer />

      {/* ---------------- REGISTRATION MODAL ---------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col"
            >
              {/* header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/40">
                <div>
                  <span className="font-display font-bold text-sm">Future AI Club</span>
                  <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-primary">
                    {step === 4 ? "You're In" : `Step ${step} of 3`}
                  </span>
                </div>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* progress */}
              {step < 4 && (
                <div className="h-1 bg-secondary">
                  <motion.div
                    className="h-full bg-primary"
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}

              <div className="p-6 overflow-y-auto">
                {/* STEP 1: ABOUT YOU */}
                {step === 1 && (
                  <div className="space-y-4">
                    <StepTitle>About you</StepTitle>
                    <Field label="Full Name">
                      <input className={inputCls} value={fullName}
                        onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Age">
                        <input type="number" min={5} max={100} className={inputCls} value={age}
                          onChange={(e) => setAge(e.target.value)} placeholder="Your age" />
                      </Field>
                      <Field label="Occupation / Student">
                        <input className={inputCls} value={occupation}
                          onChange={(e) => setOccupation(e.target.value)} placeholder="e.g. Student, Engineer" />
                      </Field>
                    </div>
                  </div>
                )}

                {/* STEP 2: CONTACT */}
                {step === 2 && (
                  <div className="space-y-4">
                    <StepTitle>How can we reach you?</StepTitle>
                    <Field label="Phone Number">
                      <input className={inputCls} value={phone}
                        onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." />
                    </Field>
                    <Field label="WhatsApp Number">
                      <input className={inputCls} value={whatsapp} disabled={sameAsPhone}
                        onChange={(e) => setWhatsapp(e.target.value)} placeholder="+91 ..." />
                      <label className="flex items-center gap-2 mt-2 text-xs text-muted-foreground cursor-pointer">
                        <input type="checkbox" checked={sameAsPhone}
                          onChange={(e) => setSameAsPhone(e.target.checked)} className="accent-primary" />
                        Same as phone
                      </label>
                    </Field>
                    <Field label="Email">
                      <input type="email" className={inputCls} value={email}
                        onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
                    </Field>
                  </div>
                )}

                {/* STEP 3: PREFERENCES */}
                {step === 3 && (
                  <div className="space-y-5">
                    <StepTitle>Your interests</StepTitle>

                    <Field label="Experience Level">
                      <div className="grid grid-cols-3 gap-3">
                        {EXPERIENCE_LEVELS.map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setExperience(lvl)}
                            className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                              experience === lvl
                                ? "bg-primary/15 border-primary/50 text-primary"
                                : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Areas of Interest">
                      <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((opt) => {
                          const active = interests.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => toggleInterest(opt)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                active
                                  ? "bg-primary/15 border-primary/50 text-primary"
                                  : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </Field>

                    <Field label="Laptop Available">
                      <div className="grid grid-cols-2 gap-3">
                        {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map((o) => (
                          <button
                            key={o.l}
                            type="button"
                            onClick={() => setLaptopAvailable(o.v)}
                            className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                              laptopAvailable === o.v
                                ? "bg-primary/15 border-primary/50 text-primary"
                                : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {o.l}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Preferred Workshop Timing">
                      <div className="grid grid-cols-2 gap-3">
                        {TIMING_OPTIONS.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTiming(t)}
                            className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                              timing === t
                                ? "bg-primary/15 border-primary/50 text-primary"
                                : "bg-secondary border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer pt-1">
                      <input type="checkbox" checked={consent}
                        onChange={(e) => setConsent(e.target.checked)} className="accent-primary mt-0.5" />
                      I'd like to join the community and agree to be contacted by Stark Labs about
                      Future AI Club workshops.
                    </label>
                  </div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 4 && (
                  <div className="text-center py-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="w-8 h-8 text-primary" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-2">Welcome to the community!</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Thanks for your interest — our team will reach out shortly with next steps.
                    </p>
                    <div className="rounded-xl bg-secondary border border-border p-4 mb-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                        Reference ID
                      </span>
                      <span className="font-mono text-lg font-bold text-primary">{registrationId}</span>
                    </div>
                    <Button
                      onClick={closeModal}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    >
                      Done
                    </Button>
                  </div>
                )}
              </div>

              {/* footer nav */}
              {step < 4 && (
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border bg-secondary/40">
                  {step > 1 ? (
                    <Button variant="ghost" onClick={() => setStep((s) => s - 1)}
                      className="text-muted-foreground hover:text-foreground">
                      <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
                    </Button>
                  ) : <span />}

                  {step < 3 ? (
                    <Button onClick={handleNext}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      Continue <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={isSubmitting}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                      {isSubmitting ? "Submitting…" : "Join the Community"}
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small presentational helpers                                       */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors disabled:opacity-50";

// Consistent trust line shown beneath the "Book a Free Discovery Workshop" CTA.
function WorkshopTrustLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground ${className}`}>
      {["Free", "No experience required", "No commitment"].map((t) => (
        <span key={t} className="inline-flex items-center gap-1.5">
          <Check className="w-4 h-4 text-primary" /> {t}
        </span>
      ))}
    </div>
  );
}

function SectionLabel({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-6 text-xs font-mono uppercase tracking-[0.2em] text-primary">
      <Icon className="w-4 h-4" />
      {children}
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-lg font-semibold mb-1">{children}</h3>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function FoundingItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </span>
      <span className="block font-display font-semibold">{value}</span>
    </div>
  );
}

/**
 * Image with a graceful, on-brand fallback. If the source fails to load,
 * it shows a dark gradient + icon instead of a broken-image glyph, so the
 * premium look survives even before real photos are dropped in.
 */
function SmartImage({
  src,
  alt,
  className = "",
  icon: Icon = ImageIcon,
}: {
  src: string;
  alt: string;
  className?: string;
  icon?: any;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden bg-secondary ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary via-card to-background">
          <Icon className="w-10 h-10 text-primary/40" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-transparent pointer-events-none" />
    </div>
  );
}
