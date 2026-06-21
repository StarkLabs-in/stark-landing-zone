import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, KeyRound, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/admin/dashboard");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success("Authentication confirmed. Loading Stark Admin console.");
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Invalid credentials. Try admin@starklabs.in / stark-labs-2026");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center p-6 text-foreground overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-950/80 border border-slate-800 hover:border-primary/40 rounded-xl p-8 backdrop-blur-md shadow-[0_0_40px_rgba(14,165,233,0.1)] transition-all duration-300 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-primary/10 border border-primary/30 rounded-lg text-primary mb-4 glow-effect">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-white flex items-center justify-center gap-2">
            Stark Labs <span className="text-primary">Admin Gateway</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-mono">
            SECURE ACCESS AUTHORIZATION
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                placeholder="admin@starklabs.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Passkey Code</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-bold py-6 text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
          >
            {loading ? "Authenticating Core..." : "Initiate Gateway"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center">
          <p className="text-xs text-slate-500 font-mono">
            GATEWAY VERSION: v2026.04
          </p>
          <p className="text-[10px] text-slate-600 mt-2 font-mono">
            Demo credentials: admin / password
          </p>
        </div>
      </motion.div>
    </div>
  );
}
