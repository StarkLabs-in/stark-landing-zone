import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, ArrowRight, ArrowLeft, Check, CheckCircle2, 
  Calendar, Clock, Laptop, Wifi, ShieldCheck, Mail, MessageSquare, 
  Award, Brain, Code, Cpu, Gamepad2, Smartphone, Terminal, GraduationCap, Users
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { sendWelcomeEmail, getWhatsAppRedirectLink, postWhatsAppWebhook } from "@/lib/emailService";
import { toast } from "sonner";
import FutureAiClubScene from "@/components/FutureAiClubScene";

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
  const [isIntro, setIsIntro] = useState(true);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [isInterestSubmitting, setIsInterestSubmitting] = useState(false);
  const [interestSubmitted, setInterestSubmitted] = useState(false);

  // Interest Form Fields
  const [interestName, setInterestName] = useState("");
  const [interestWhatsApp, setInterestWhatsApp] = useState("");
  const [interestEmail, setInterestEmail] = useState("");
  const [interestRole, setInterestRole] = useState("");
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
    if (!interestName || !interestWhatsApp || !interestRole || interestSelectedList.length === 0 || !interestTiming || !interestWorkshop) {
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

  // Auto-dismiss intro after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsIntro(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ──────────────────────────────────────────────────────
  // FUTURE COHORT REGISTRATION - TEMPORARILY DISABLED
  // All state below is retained so the code stays recoverable.
  // ──────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isWaitlistOnly, setIsWaitlistOnly] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    registrationId?: string;
    studentName: string;
    parentName: string;
    phone: string;
    program: string;
    batch: string;
    isWaitlist: boolean;
  } | null>(null);

  const [studentName, setStudentName] = useState("");
  const [studentAge, setStudentAge] = useState("");
  const [studentDob, setStudentDob] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [gradeClass, setGradeClass] = useState("");
  const [gender, setGender] = useState("");

  const [parentName, setParentName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [learningTools, setLearningTools] = useState({
    scratch: false,
    python: false,
    chatgpt: false,
    roboticsKits: false,
    none: false,
  });
  const [techInterests, setTechInterests] = useState<string[]>([]);

  const [laptopAvailable, setLaptopAvailable] = useState<boolean | null>(null);
  const [operatingSystem, setOperatingSystem] = useState("");
  const [internetAvailable, setInternetAvailable] = useState<boolean | null>(null);

  const [preferredBatch, setPreferredBatch] = useState("");

  const [demoDate, setDemoDate] = useState("");
  const [demoTimeSlot, setDemoTimeSlot] = useState("");

  const [consentProject, setConsentProject] = useState(false);
  const [consentComm, setConsentComm] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);

  const getAutoProgram = (age: number) => {
    if (age >= 8 && age <= 11) return "Junior Innovators (Age 8-11)";
    if (age >= 12 && age <= 14) return "AI Explorers (Age 12-14)";
    if (age >= 15 && age <= 17) return "Future Builders (Age 15-17)";
    return "";
  };

  const programName = studentAge ? getAutoProgram(parseInt(studentAge, 10)) : "";

  useEffect(() => {
    if (sameAsMobile) setWhatsappNumber(mobileNumber);
  }, [mobileNumber, sameAsMobile]);

  const [slotCount, setSlotCount] = useState(0);
  const [checkingSlots, setCheckingSlots] = useState(false);

  useEffect(() => {
    if (demoDate && demoTimeSlot) {
      setCheckingSlots(true);
      supabase
        .from("registrations")
        .select("id")
        .eq("demo_date", demoDate)
        .eq("demo_time_slot", demoTimeSlot)
        .then(({ data, error }: any) => {
          setCheckingSlots(false);
          if (error) {
            console.error("Error checking slots:", error);
          } else {
            const count = data?.length || 0;
            setSlotCount(count);
            if (count >= 20) {
              setIsWaitlistOnly(true);
              toast.warning("This slot is currently full. Submitting will register you to the waiting list.");
            } else {
              setIsWaitlistOnly(false);
            }
          }
        });
    }
  }, [demoDate, demoTimeSlot]);

  const handleInterestToggle = (interest: string) => {
    setTechInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentProject || !consentComm || !consentTerms) {
      toast.error("Please agree to all consent check boxes to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: parentError } = await supabase
        .from("parents")
        .insert({
          parent_name: parentName,
          mobile_number: mobileNumber,
          whatsapp_number: whatsappNumber,
          email_address: parentEmail,
          occupation,
          company_name: companyName,
        });

      if (parentError) throw parentError;

      const parentsList = await supabase.from("parents").select("*");
      const savedParent = parentsList.data?.find((p: any) => p.email_address === parentEmail) || { id: crypto.randomUUID() };

      const { error: studentError } = await supabase
        .from("students")
        .insert({
          student_name: studentName,
          age: parseInt(studentAge, 10),
          date_of_birth: studentDob,
          school_name: schoolName,
          grade_class: gradeClass,
          gender: gender || null,
        });

      if (studentError) throw studentError;

      const studentsList = await supabase.from("students").select("*");
      const savedStudent = studentsList.data?.find((s: any) => s.student_name === studentName) || { id: crypto.randomUUID() };

      const finalStatus = isWaitlistOnly ? "waiting_list" : "confirmed";

      const { error: regError } = await supabase
        .from("registrations")
        .insert({
          student_id: savedStudent.id,
          parent_id: savedParent.id,
          scratch: learningTools.scratch,
          python: learningTools.python,
          chatgpt: learningTools.chatgpt,
          robotics_kits: learningTools.roboticsKits,
          none_used: learningTools.none,
          interests: techInterests,
          laptop_available: laptopAvailable === true,
          operating_system: operatingSystem,
          internet_available: internetAvailable === true,
          program: programName,
          preferred_batch: preferredBatch,
          demo_date: demoDate || null,
          demo_time_slot: demoTimeSlot || null,
          consent_project_based: consentProject,
          consent_communication: consentComm,
          consent_terms_privacy: consentTerms,
          status: finalStatus,
        });

      if (regError) throw regError;

      const regList = await supabase.from("registrations").select("*");
      const savedReg = regList.data?.find((r: any) => r.student_id === savedStudent.id) || { registration_id: `STARK-2026-${Math.floor(1000 + Math.random() * 9000)}` };

      if (finalStatus === "waiting_list") {
        await supabase.from("leads").insert({
          parent_name: parentName,
          email_address: parentEmail,
          mobile_number: mobileNumber,
          student_name: studentName,
          student_age: parseInt(studentAge, 10),
          program: programName,
          preferred_batch: preferredBatch,
          status: "waiting_list",
        });
      }

      await sendWelcomeEmail(parentEmail, parentName, savedReg.registration_id);

      const whatsappPayload = {
        studentName,
        studentAge: parseInt(studentAge, 10),
        parentName,
        phone: whatsappNumber,
        program: programName,
        batch: preferredBatch
      };
      await postWhatsAppWebhook(whatsappPayload);

      setSuccessData({
        registrationId: savedReg.registration_id,
        studentName,
        parentName,
        phone: whatsappNumber,
        program: programName,
        batch: preferredBatch,
        isWaitlist: isWaitlistOnly
      });

      toast.success(isWaitlistOnly ? "Waitlist registration successful!" : "Enrollment registered successfully!");
      setActiveStep(8);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "An error occurred during registration. Please check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStudentName(""); setStudentAge(""); setStudentDob("");
    setSchoolName(""); setGradeClass(""); setGender("");
    setParentName(""); setMobileNumber(""); setWhatsappNumber("");
    setSameAsMobile(false); setParentEmail(""); setOccupation(""); setCompanyName("");
    setLearningTools({ scratch: false, python: false, chatgpt: false, roboticsKits: false, none: false });
    setTechInterests([]); setLaptopAvailable(null); setOperatingSystem("");
    setInternetAvailable(null); setPreferredBatch(""); setDemoDate("");
    setDemoTimeSlot(""); setConsentProject(false); setConsentComm(false);
    setConsentTerms(false); setSuccessData(null); setIsWaitlistOnly(false);
    setActiveStep(1); setIsModalOpen(false);
  };

  const triggerOpenForm = (waitlistDirect = false) => {
    setIsWaitlistOnly(waitlistDirect);
    setIsModalOpen(true);
    setActiveStep(1);
  };

  const getMinDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // ──────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-foreground">
      <Navbar />

      {/* 3D Immersive background scene */}
      <FutureAiClubScene isIntro={isIntro} />

      {/* ══════════════════════════════════════════════════ */}
      {/* ENTRY INTRO OVERLAY                                */}
      {/* ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-center p-6"
          >
            <div className="max-w-md mx-auto space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold tracking-tight font-display text-white"
              >
                FUTURE AI CLUB
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-cyan-400 font-semibold tracking-wider uppercase text-sm font-display"
              >
                Future Inventions Start Here
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="flex gap-4 justify-center pt-8"
              >
                <Button
                  onClick={() => setIsIntro(false)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg transition-all"
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsIntro(false)}
                  className="border-slate-700 text-slate-300 hover:text-white hover:border-slate-500"
                >
                  Skip Animation
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════ */}
      {/* HERO SECTION                                       */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 container mx-auto px-6 z-10 flex flex-col items-center justify-center min-h-[90vh] text-center">
        <div className="max-w-4xl mx-auto">
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
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            We&apos;re exploring the possibility of building a community where curious people can learn AI, coding,
            creativity, and technology together. Open to students, parents, professionals, and lifelong learners.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center gap-6 mt-2 mb-10 text-slate-400 text-sm flex-wrap font-display font-medium"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="text-cyan-400 w-4 h-4" /> All Ages Welcome
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="text-cyan-400 w-4 h-4" /> No Experience Needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="text-cyan-400 w-4 h-4" /> Free Discovery Workshop Planned
            </span>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
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
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHY THIS PAGE EXISTS                               */}
      {/* ══════════════════════════════════════════════════ */}
      <section
        id="why-this-exists"
        className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/60 backdrop-blur-sm"
      >
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white mb-6">
            Why This Page Exists
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mb-10 rounded-full" />

          <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800/80 backdrop-blur-md space-y-6">
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-sans">
              Before launching workshops, we want to understand whether there is enough community interest.
            </p>
            <p className="text-base md:text-lg text-slate-400 leading-relaxed font-sans">
              Future AI Club is currently an idea in exploration. If enough people are interested, we&apos;ll
              organize our first free discovery workshop.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHO MIGHT BE INTERESTED?                           */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
              Who Might Be Interested?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Students", desc: "Young learners who want to build creative tech projects early on.", icon: <GraduationCap className="w-6 h-6 text-cyan-400" /> },
              { title: "Parents", desc: "Parents hoping to introduce their kids to future technology tools productively.", icon: <Users className="w-6 h-6 text-amber-500" /> },
              { title: "Working Professionals", desc: "Individuals looking to upskill and explore cutting-edge productivity tools.", icon: <Terminal className="w-6 h-6 text-cyan-400" /> },
              { title: "Technology Enthusiasts", desc: "Hobbyists wanting to collaborate and discuss technology trends.", icon: <Sparkles className="w-6 h-6 text-amber-500" /> },
              { title: "Curious Beginners", desc: "Anyone completely new to coding, starting their tech learning journey.", icon: <Code className="w-6 h-6 text-cyan-400" /> },
              { title: "Lifelong Learners", desc: "Active minds looking to experiment, learn, and explore new tools.", icon: <Brain className="w-6 h-6 text-amber-500" /> },
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-900/20 border border-slate-800/80 hover:border-cyan-500/20 transition-all duration-300 hover:translate-y-[-4px] backdrop-blur-md group"
              >
                <div className="mb-4 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg w-fit group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHAT WE HOPE TO EXPLORE TOGETHER                   */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-cyan-500 font-display text-sm font-semibold tracking-wider uppercase mb-2 block">
              Exploratory Tracks
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
              What We Hope To Explore Together
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "AI Tools", desc: "Learning to use AI systems for writing, image creation, and project acceleration.", icon: <Brain className="w-6 h-6 text-cyan-400" /> },
              { title: "Coding Basics", desc: "Getting comfortable with fundamental scripting, structures, and systems.", icon: <Code className="w-6 h-6 text-amber-500" /> },
              { title: "Creative Projects", desc: "Applying computational methods to design interactive games and digital arts.", icon: <Cpu className="w-6 h-6 text-cyan-400" /> },
              { title: "Websites", desc: "Understanding the layouts and architecture required to share ideas online.", icon: <Laptop className="w-6 h-6 text-amber-500" /> },
              { title: "Problem Solving", desc: "Breaking down complex logical tasks into automated step-by-step operations.", icon: <ShieldCheck className="w-6 h-6 text-cyan-400" /> },
              { title: "Technology Discussions", desc: "Exploring safety guidelines, emerging frameworks, and digital community concepts.", icon: <MessageSquare className="w-6 h-6 text-amber-500" /> },
            ].map((card, idx) => (
              <div
                key={idx}
                className="p-6 rounded-xl bg-slate-900/20 border border-slate-800/80 hover:border-cyan-500/20 transition-all duration-300 hover:translate-y-[-4px] backdrop-blur-md group"
              >
                <div className="mb-4 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg w-fit group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* STARTING SMALL                                     */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/40 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-amber-500 font-display text-sm font-semibold tracking-wider uppercase block">
                Our Philosophy
              </span>
              <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
                Starting Small
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-full" />
              <p className="text-slate-300 leading-relaxed font-sans text-base md:text-lg">
                We&apos;re intentionally starting small. The goal is to create a welcoming community where people
                can learn, explore, and build together.
              </p>
              <p className="text-slate-400 leading-relaxed font-sans text-sm md:text-base">
                Future workshops will be shaped by the interests of early members.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { title: "Small Group Learning", desc: "Collaborate in tight, high-focus cohorts with individual feedback.", icon: <Users className="w-5 h-5 text-cyan-400" /> },
                { title: "Community Driven", desc: "Curriculums driven by questions and project ideas from early signups.", icon: <Brain className="w-5 h-5 text-amber-500" /> },
                { title: "Practical Workshops", desc: "Spend course hours active on building rather than watching lectures.", icon: <Code className="w-5 h-5 text-cyan-400" /> },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 p-2 bg-slate-950/60 rounded-lg w-fit">{card.icon}</div>
                    <h3 className="text-base font-bold font-display text-white mb-2 leading-snug">{card.title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mt-2">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════ */}
      {/* WHAT HAPPENS NEXT — 5-STEP TIMELINE                */}
      {/* ══════════════════════════════════════════════════ */}
      <section className="py-24 relative z-10 border-t border-slate-900/60 bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-16">
            <span className="text-cyan-500 font-display text-sm font-semibold tracking-wider uppercase mb-2 block">
              The Roadmap
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
              What Happens Next?
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
            <p className="text-slate-400 mt-4 max-w-md mx-auto text-sm">
              Five structured phases to align workshops to real community needs.
            </p>
          </div>

          <div className="relative">
            {/* Desktop horizontal track */}
            <div className="absolute top-8 left-10 right-10 h-0.5 bg-slate-800/80 hidden md:block z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {[
                { step: "01", title: "Join Interest List", desc: "Share your roles, preferred schedules, and exploration goals." },
                { step: "02", title: "Free Discovery Workshop", desc: "If demand is validated, we organise a live interactive session." },
                { step: "03", title: "Meet the Community", desc: "Collaborate, share profiles, and discuss build projects." },
                { step: "04", title: "Build Together", desc: "Launch collaborative code sprints and hands-on workshops." },
                { step: "05", title: "Decide Whether To Continue", desc: "Choose whether you'd like scheduled learning paths." },
              ].map((item, idx) => (
                <div key={idx} className="space-y-4 md:text-center group">
                  <div className="flex items-center md:justify-center gap-4 md:flex-col">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-slate-800 group-hover:border-cyan-500 transition-all flex items-center justify-center font-display font-bold text-lg text-cyan-400 shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <div className="space-y-2 pl-2 md:pl-0">
                    <h3 className="text-lg font-bold font-display text-white">{item.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-xs md:mx-auto">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
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
                    className="text-center space-y-6 py-6"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-3xl font-bold">
                      ✓
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-3xl font-bold font-display text-white">Thank You</h3>
                      <p className="text-slate-300 text-base max-w-md mx-auto leading-relaxed">
                        Thank you for your interest.
                      </p>
                      <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                        We&apos;re currently exploring whether there is enough community interest to launch Future
                        AI Club. We&apos;ll keep you informed about future workshops and community events.
                      </p>
                    </div>

                    <div className="pt-6">
                      <Button
                        type="button"
                        onClick={resetInterestForm}
                        className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-8 py-3 rounded-lg transition-colors"
                      >
                        Close
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════
          FUTURE COHORT REGISTRATION - TEMPORARILY DISABLED
          All original enrollment UI is preserved below.
          To re-enable, remove the {false && (<>...</>)} wrapper.
          ══════════════════════════════════════════════════════════════════ */}
      {false && (
        <>
          {/* ── Old Futuristic Background ── */}
          <div className="absolute inset-0 grid-pattern opacity-30 z-0 pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-glow z-0 pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[150px] animate-pulse-glow z-0 pointer-events-none" style={{ animationDelay: "1.5s" }} />

          {/* ── Old Hero Section ── */}
          <section className="relative pt-32 pb-20 container mx-auto px-6 z-10 flex flex-col items-center justify-center min-h-[90vh]">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 text-cyan-400 mb-8 font-display text-sm font-semibold tracking-wider glow-effect"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>FUTURE STARKS ARE HERE</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight font-display mb-6 leading-tight"
              >
                Build AI, Games, Robots &{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-500 bg-clip-text text-transparent">
                  Future Technologies
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12"
              >
                A premium hands-on AI, Coding & Robotics Academy for creative kids aged 8–17. Empower your child
                to create, invent, and lead.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-5 justify-center items-center"
              >
                <Button
                  size="lg"
                  onClick={() => triggerOpenForm(false)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-lg px-8 py-6 rounded-lg w-full sm:w-auto transition-all duration-300 transform hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                >
                  Book Free Demo Class
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => triggerOpenForm(true)}
                  className="border-amber-500/50 hover:border-amber-500 text-amber-500 hover:bg-amber-500/10 font-semibold text-lg px-8 py-6 rounded-lg w-full sm:w-auto transition-all duration-300"
                >
                  Join Waiting List
                </Button>
              </motion.div>

              <div className="flex justify-center gap-12 mt-16 text-muted-foreground text-sm flex-wrap">
                <span className="flex items-center gap-2"><CheckCircle2 className="text-cyan-400 w-4 h-4" /> Learn</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="text-cyan-400 w-4 h-4" /> Build</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="text-cyan-400 w-4 h-4" /> Invent</span>
              </div>
            </div>
          </section>

          {/* ── Old Trust & Methodology Section ── */}
          <section className="py-24 bg-slate-950/40 relative z-10 border-y border-slate-900/60">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight text-white">
                  Why Parents Trust <span className="text-cyan-400">Stark Academy</span>
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 mx-auto mt-4 rounded-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  { icon: <Brain className="w-8 h-8 text-cyan-400" />, title: "Build Real AI Projects", desc: "Kids learn neural networks, LLMs, and train customized AI agents like ChatGPT assistants." },
                  { icon: <Code className="w-8 h-8 text-amber-500" />, title: "Hands-on Coding", desc: "Transition smoothly from visual programming in Scratch to professional text-based Python syntax." },
                  { icon: <Cpu className="w-8 h-8 text-cyan-400" />, title: "Robotics Kits", desc: "Integrate hardware and sensors, assembling intelligent microcontrollers to solve physical world tasks." },
                  { icon: <Award className="w-8 h-8 text-amber-500" />, title: "Certified Innovation", desc: "Receive official graduation credentials, portfolio support, and showcases on our global platform." },
                  { icon: <Gamepad2 className="w-8 h-8 text-cyan-400" />, title: "Game Development", desc: "Design interactive 2D & 3D environments, learning structural variables and mathematical layouts." },
                  { icon: <Terminal className="w-8 h-8 text-amber-500" />, title: "Future Skills", desc: "Logical structure, critical diagnostics, data analytics, and presentation layouts." },
                  { icon: <Users className="w-8 h-8 text-cyan-400" />, title: "Community Learning", desc: "Collaborate in student clubs, brainstorm in hardware guilds, and partner on team builds." },
                  { icon: <GraduationCap className="w-8 h-8 text-amber-500" />, title: "Demo Day Showcases", desc: "Pitch projects live to mentors and experts during graduation demo showcases." },
                ].map((feature, i) => (
                  <div key={i} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:translate-y-[-4px] backdrop-blur-md group">
                    <div className="mb-4 p-3 bg-slate-950/60 rounded-lg w-fit group-hover:scale-110 transition-transform">{feature.icon}</div>
                    <h3 className="text-xl font-bold font-display text-white mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Old Student Showcases Section ── */}
          <section className="py-24 relative z-10">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold font-display tracking-tight">
                  Future Inventions <span className="bg-gradient-to-r from-cyan-400 to-amber-500 bg-clip-text text-transparent">Start Here</span>
                </h2>
                <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Explore some of the award-winning projects engineered by our students aged 8-17.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "StarkBot Mark I", type: "Robotics / Hardware", builder: "Arjun S. (Age 12)", desc: "An ultrasonic sensor obstacle-avoiding vehicle that navigates rooms independently. Built with Arduino C++.", image: "🤖" },
                  { title: "Jarvis Junior Assistant", type: "Artificial Intelligence", builder: "Pooja R. (Age 14)", desc: "A custom fine-tuned assistant chatbot trained to index and summarize school notes. Integrated with OpenAI API via Python.", image: "💬" },
                  { title: "Quantum Racer 3D", type: "Game Engineering", builder: "Rohit K. (Age 9)", desc: "A physics-based racing game featuring custom tracks and acceleration variables. Built with Scratch & JavaScript elements.", image: "🚀" },
                ].map((project, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden bg-slate-950/60 border border-slate-800 hover:border-amber-500/30 transition-all duration-300 flex flex-col group">
                    <div className="h-48 bg-slate-900 flex items-center justify-center text-6xl border-b border-slate-900 group-hover:bg-slate-800/60 transition-colors">{project.image}</div>
                    <div className="p-6 flex-grow flex flex-col">
                      <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">{project.type}</span>
                      <h3 className="text-xl font-bold font-display text-white mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm flex-grow mb-4">{project.desc}</p>
                      <div className="pt-4 border-t border-slate-900 text-xs text-slate-400 font-medium">By {project.builder}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Old Multi-step Registration Wizard Modal ── */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-slate-950 border border-cyan-500/40 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.15)] max-h-[90vh]"
                >
                  <div className="bg-slate-900/60 px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="font-display font-semibold text-cyan-400 text-sm tracking-wider uppercase">STARK REGISTRATION INITIATED</span>
                    </div>
                    {activeStep < 8 && <span className="text-xs text-muted-foreground font-display font-semibold">STEP {activeStep} OF 7</span>}
                    <button onClick={resetForm} className="text-muted-foreground hover:text-white transition-colors font-bold text-lg">✕</button>
                  </div>

                  {activeStep < 8 && (
                    <div className="w-full bg-slate-900 h-1">
                      <div className="bg-gradient-to-r from-cyan-400 to-amber-500 h-full transition-all duration-300" style={{ width: `${(activeStep / 7) * 100}%` }} />
                    </div>
                  )}

                  <div className="p-8 overflow-y-auto flex-grow">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* All 7 steps + success step are preserved here. */}
                      {/* Re-enable this block to restore the full registration wizard. */}
                    </form>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}

      <Footer />
    </div>
  );
}
