import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, UserCheck, Inbox, TrendingUp, Search, RefreshCw, 
  Download, LogOut, Mail, CheckCircle, Clock, ShieldCheck, 
  ExternalLink, Eye, Info, LayoutDashboard, Database, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured, seedMockData } from "@/lib/supabase";
import { MockEmail } from "@/lib/emailService";
import { toast } from "sonner";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    confirmedRegistrations: 0,
    waitingList: 0,
    demoBookings: 0,
    conversionRate: 0
  });

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<any[]>([]);
  const [emails, setEmails] = useState<MockEmail[]>([]);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  
  // Search & Filter controls
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'confirmed', 'waiting_list'
  const [filterProgram, setFilterProgram] = useState("all");
  
  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'registrations', 'emails'

  // Verification checks
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        toast.error("Unauthorized access. Access restricted to Admin Gateway.");
        navigate("/admin");
      } else {
        fetchDashboardData();
      }
    });
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Registrations
      const { data: regs, error: regsError } = await supabase
        .from("registrations")
        .select("*");

      if (regsError) throw regsError;

      // Fetch Leads
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("*");

      if (leadsError) throw leadsError;

      const regList = regs || [];
      const leadList = leads || [];
      
      setRegistrations(regList);
      setFilteredRegistrations(regList);

      // Compute statistics
      const confirmedRegs = regList.filter((r: any) => r.status === "confirmed");
      const waitlistRegs = regList.filter((r: any) => r.status === "waiting_list");
      const totalCount = confirmedRegs.length + waitlistRegs.length;
      
      const demoCount = regList.filter((r: any) => r.demo_date && r.status === "confirmed").length;
      
      // Calculate conversion: confirmed registrations vs total prospects (confirmed + waitlist + leads)
      const totalProspects = totalCount + leadList.length;
      const conversion = totalProspects > 0 ? Math.round((confirmedRegs.length / totalProspects) * 100) : 0;

      setStats({
        totalRegistrations: totalCount,
        confirmedRegistrations: confirmedRegs.length,
        waitingList: waitlistRegs.length + leadList.length,
        demoBookings: demoCount,
        conversionRate: conversion
      });

      // Load mock emails
      const emailOutbox = JSON.parse(localStorage.getItem("stark_mock_emails") || "[]") as MockEmail[];
      setEmails(emailOutbox);

    } catch (err: any) {
      console.error(err);
      toast.error("Failed to retrieve console registry data.");
    } finally {
      setLoading(false);
    }
  };

  // Run searches and filters
  useEffect(() => {
    let result = registrations;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r => 
        (r.registration_id && r.registration_id.toLowerCase().includes(term)) ||
        (r.student?.student_name && r.student.student_name.toLowerCase().includes(term)) ||
        (r.student?.school_name && r.student.school_name.toLowerCase().includes(term)) ||
        (r.parent?.parent_name && r.parent.parent_name.toLowerCase().includes(term)) ||
        (r.parent?.email_address && r.parent.email_address.toLowerCase().includes(term)) ||
        (r.parent?.mobile_number && r.parent.mobile_number.includes(term))
      );
    }

    if (filterStatus !== "all") {
      result = result.filter(r => r.status === filterStatus);
    }

    if (filterProgram !== "all") {
      result = result.filter(r => r.program?.includes(filterProgram));
    }

    setFilteredRegistrations(result);
  }, [searchTerm, filterStatus, filterProgram, registrations]);

  // Handle local database re-seeding
  const handleReseed = () => {
    seedMockData(true);
    toast.success("Mock Database reseeded with fresh Chennai school registrations.");
    fetchDashboardData();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Admin Session terminated.");
    navigate("/admin");
  };

  // CSV Exporter helper
  const handleExportCSV = (filename = "stark_registrations.csv") => {
    if (registrations.length === 0) {
      toast.error("No registry entries to export.");
      return;
    }

    const headers = [
      "Registration ID", "Student Name", "Age", "Date of Birth", "School Name", "Grade/Class", "Gender",
      "Parent Name", "Mobile", "WhatsApp", "Email", "Occupation", "Company",
      "Program", "Batch", "Demo Date", "Demo Time Slot", "Status", "Created At"
    ];
    
    const rows = registrations.map(item => [
      item.registration_id || "",
      item.student?.student_name || "",
      item.student?.age || "",
      item.student?.date_of_birth || "",
      item.student?.school_name || "",
      item.student?.grade_class || "",
      item.student?.gender || "",
      item.parent?.parent_name || "",
      item.parent?.mobile_number || "",
      item.parent?.whatsapp_number || "",
      item.parent?.email_address || "",
      item.parent?.occupation || "",
      item.parent?.company_name || "",
      item.program || "",
      item.preferred_batch || "",
      item.demo_date || "",
      item.demo_time_slot || "",
      item.status || "",
      item.created_at || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Registry database exported as ${filename}`);
  };

  // Recharts Chart Data Formatting
  // 1. Age distribution data
  const getAgeData = () => {
    const ageCounts: Record<number, number> = {};
    for (let i = 8; i <= 17; i++) ageCounts[i] = 0;
    
    registrations.forEach(r => {
      const age = r.student?.age;
      if (age >= 8 && age <= 17) {
        ageCounts[age] = (ageCounts[age] || 0) + 1;
      }
    });

    return Object.entries(ageCounts).map(([age, count]) => ({
      age: `Age ${age}`,
      Count: count
    }));
  };

  // 2. Program distribution data
  const getProgramData = () => {
    const programs: Record<string, number> = {
      "Junior Innovators": 0,
      "AI Explorers": 0,
      "Future Builders": 0
    };

    registrations.forEach(r => {
      if (r.program?.includes("Junior")) programs["Junior Innovators"]++;
      else if (r.program?.includes("Explorer")) programs["AI Explorers"]++;
      else if (r.program?.includes("Builder")) programs["Future Builders"]++;
    });

    return Object.entries(programs).map(([name, value]) => ({ name, value }));
  };

  // 3. School ranking data
  const getSchoolData = () => {
    const schools: Record<string, number> = {};
    registrations.forEach(r => {
      const school = r.student?.school_name?.split(",")[0] || "Unknown";
      schools[school] = (schools[school] || 0) + 1;
    });

    return Object.entries(schools)
      .map(([name, count]) => ({ name, Count: count }))
      .sort((a, b) => b.Count - a.Count)
      .slice(0, 5); // top 5
  };

  const PROGRAM_COLORS = ["#0ea5e9", "#f97316", "#a855f7"];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Admin Nav */}
      <header className="bg-slate-950 border-b border-slate-900 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-primary flex items-center justify-center font-display font-bold text-slate-950 text-lg shadow-[0_0_15px_rgba(14,165,233,0.3)]">
            S
          </div>
          <div>
            <span className="font-display font-bold text-white text-lg">Stark Labs</span>
            <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded font-mono ml-2 uppercase">
              Admin Console
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isSupabaseConfigured && (
            <Button 
              onClick={handleReseed} 
              variant="outline" 
              size="sm"
              className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10 hidden sm:flex items-center gap-1.5"
            >
              <Database className="w-4 h-4" />
              Reset Mock DB
            </Button>
          )}
          <Button 
            onClick={fetchDashboardData} 
            variant="ghost" 
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="destructive" 
            size="sm"
            className="flex items-center gap-1.5 font-semibold text-xs"
          >
            <LogOut className="w-4 h-4" />
            Exit Console
          </Button>
        </div>
      </header>

      {/* Main Console Frame */}
      <div className="flex-grow flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-slate-950/40 border-r border-slate-900/60 p-4 space-y-2 flex flex-row md:flex-col justify-start md:justify-items-stretch overflow-x-auto md:overflow-x-visible">
          {[
            { id: "overview", label: "Registry Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: "registrations", label: "Registrations & Leads", icon: <Users className="w-4 h-4" /> },
            { id: "emails", label: "Simulated Email Outbox", icon: <Mail className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 border border-primary/20 text-primary"
                  : "text-slate-400 hover:bg-slate-900/40 hover:text-white border border-transparent"
              }`}
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Dashboard Content Area */}
        <main className="flex-grow p-6 md:p-8 space-y-8 overflow-y-auto">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <div className="w-10 h-10 border-4 border-t-primary border-slate-800 rounded-full animate-spin" />
              <p className="text-sm font-mono text-slate-500 uppercase tracking-widest">Hydrating Stark Registry Records...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW METRICS & CHARTS */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  
                  {/* Grid KPI Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { 
                        title: "Total Registrations", 
                        value: stats.totalRegistrations, 
                        desc: `${stats.confirmedRegistrations} Confirmed / ${stats.totalRegistrations - stats.confirmedRegistrations} Pending`,
                        icon: <Users className="text-primary w-6 h-6" /> 
                      },
                      { 
                        title: "Demo Class Bookings", 
                        value: stats.demoBookings, 
                        desc: "Confirmed Weekend Sessions",
                        icon: <UserCheck className="text-emerald-400 w-6 h-6" /> 
                      },
                      { 
                        title: "Waiting List Count", 
                        value: stats.waitingList, 
                        desc: "Pending Slots & Waitlisted Leads",
                        icon: <Inbox className="text-amber-500 w-6 h-6" /> 
                      },
                      { 
                        title: "Funnel Conversion Rate", 
                        value: `${stats.conversionRate}%`, 
                        desc: "Total enrollments / prospects",
                        icon: <TrendingUp className="text-purple-400 w-6 h-6" /> 
                      }
                    ].map((metric, i) => (
                      <div 
                        key={i}
                        className="p-6 rounded-xl bg-slate-950/60 border border-slate-900 flex items-start justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{metric.title}</span>
                          <h3 className="text-3xl font-bold font-display text-white">{metric.value}</h3>
                          <p className="text-[11px] text-slate-400 font-medium">{metric.desc}</p>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-lg">
                          {metric.icon}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recharts Analytical Visualizations */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Age distribution */}
                    <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4">
                      <h3 className="text-lg font-bold font-display text-white">Students by Age Metrics</h3>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getAgeData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                            <XAxis dataKey="age" stroke="#64748b" fontSize={11} />
                            <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#fff" }}
                              itemStyle={{ color: "#0ea5e9" }}
                            />
                            <Bar dataKey="Count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Program distribution */}
                    <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4">
                      <h3 className="text-lg font-bold font-display text-white">Enrollment by Academy Modules</h3>
                      <div className="h-80 w-full flex flex-col sm:flex-row items-center justify-center">
                        <div className="h-64 w-64 flex-shrink-0">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getProgramData()}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {getProgramData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={PROGRAM_COLORS[index % PROGRAM_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#fff" }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-3 pl-4">
                          {getProgramData().map((item, idx) => (
                            <div key={item.name} className="flex items-center gap-2 text-sm">
                              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: PROGRAM_COLORS[idx] }} />
                              <span className="text-slate-400 font-semibold">{item.name}:</span>
                              <span className="text-white font-bold">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Top Schools */}
                    <div className="p-6 rounded-xl bg-slate-950/60 border border-slate-900 space-y-4 lg:col-span-2">
                      <h3 className="text-lg font-bold font-display text-white">Top Chennai Schools Representation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={getSchoolData()} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                              <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: "#020617", borderColor: "#1e293b", color: "#fff" }}
                              />
                              <Bar dataKey="Count" fill="#f97316" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Enrollment Breakdown</h4>
                          <div className="divide-y divide-slate-900">
                            {getSchoolData().map((school, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between text-sm">
                                <span className="text-slate-300 font-medium truncate max-w-xs">{idx + 1}. {school.name}</span>
                                <span className="text-primary font-bold">{school.Count} kids</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: REGISTRATION RECORDS & LEADS */}
              {activeTab === "registrations" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  
                  {/* Search and export filters bar */}
                  <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                    <div className="flex flex-col sm:flex-row gap-3 flex-grow max-w-3xl">
                      
                      {/* Search */}
                      <div className="relative flex-grow">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          placeholder="Search ID, Student, Parent, School..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full bg-slate-900/60 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-primary text-sm"
                        />
                      </div>

                      {/* Status filter */}
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Statuses</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="waiting_list">Waiting List</option>
                      </select>

                      {/* Program filter */}
                      <select
                        value={filterProgram}
                        onChange={(e) => setFilterProgram(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-primary"
                      >
                        <option value="all">All Programs</option>
                        <option value="Junior">Junior Innovators</option>
                        <option value="Explorer">AI Explorers</option>
                        <option value="Builder">Future Builders</option>
                      </select>

                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleExportCSV("stark_registrations.csv")}
                        variant="outline" 
                        size="sm"
                        className="border-slate-800 hover:bg-slate-900 text-slate-300 flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </Button>
                      <Button 
                        onClick={() => handleExportCSV("stark_registrations_excel.csv")}
                        variant="outline" 
                        size="sm"
                        className="border-slate-800 hover:bg-slate-900 text-slate-300 flex items-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        Export Excel
                      </Button>
                    </div>
                  </div>

                  {/* Main Registry Data Table */}
                  <div className="bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-900 bg-slate-900/30 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                            <th className="px-6 py-4">ID / Created</th>
                            <th className="px-6 py-4">Student Details</th>
                            <th className="px-6 py-4">Parent Details</th>
                            <th className="px-6 py-4">Program & Batch</th>
                            <th className="px-6 py-4">Demo Schedule</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-sm">
                          {filteredRegistrations.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-mono">
                                No registry entries match query parameters.
                              </td>
                            </tr>
                          ) : (
                            filteredRegistrations.map((reg) => (
                              <tr key={reg.id} className="hover:bg-slate-900/10 transition-colors">
                                <td className="px-6 py-4 space-y-1">
                                  <span className="font-mono text-cyan-400 font-bold block">{reg.registration_id}</span>
                                  <span className="text-[10px] text-slate-500 block">
                                    {new Date(reg.created_at).toLocaleDateString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-bold text-white">{reg.student?.student_name}</div>
                                  <div className="text-xs text-slate-400">
                                    {reg.student?.age} years • {reg.student?.school_name?.split(",")[0]}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="font-medium text-slate-300">{reg.parent?.parent_name}</div>
                                  <div className="text-xs text-slate-500">{reg.parent?.whatsapp_number}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-slate-300 font-medium">{reg.program?.split(" (")[0]}</div>
                                  <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded font-medium text-slate-400">
                                    {reg.preferred_batch}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  {reg.demo_date ? (
                                    <div className="space-y-0.5">
                                      <span className="text-xs font-semibold text-slate-300 block">{reg.demo_date}</span>
                                      <span className="text-[10px] text-slate-500 block">{reg.demo_time_slot}</span>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-slate-600 italic">No slot booked</span>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                                    reg.status === "confirmed"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                  }`}>
                                    {reg.status === "confirmed" ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                    {reg.status === "confirmed" ? "Confirmed" : "Waitlist"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Button 
                                    onClick={() => setSelectedReg(reg)}
                                    variant="ghost" 
                                    size="sm"
                                    className="text-primary hover:text-white hover:bg-primary/10"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Profile
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: SIMULATED EMAIL OUTBOX */}
              {activeTab === "emails" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-900 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold font-display text-white">Simulated Welcome Outbox</h3>
                      <p className="text-sm text-slate-400 mt-1">This console captures automated welcome messages triggered for parent emails during testing.</p>
                    </div>
                    <Button
                      onClick={() => {
                        localStorage.removeItem("stark_mock_emails");
                        setEmails([]);
                        toast.success("Outbox cleared.");
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-white"
                    >
                      Clear Logs
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Emails list */}
                    <div className="lg:col-span-1 border border-slate-900 rounded-xl overflow-hidden bg-slate-950/60 max-h-[60vh] overflow-y-auto">
                      <div className="divide-y divide-slate-900">
                        {emails.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 font-mono text-xs">
                            Outbox empty. Try registering a new student.
                          </div>
                        ) : (
                          emails.map((email, index) => (
                            <div 
                              key={email.id}
                              className="p-4 hover:bg-slate-900/30 cursor-pointer transition-colors border-l-2 border-l-transparent hover:border-l-primary"
                              onClick={() => {
                                // Simple visual viewer hook
                                setSelectedReg({ 
                                  isEmailPreview: true,
                                  emailTo: email.to,
                                  emailSubject: email.subject,
                                  emailBody: email.body,
                                  emailSent: email.sent_at
                                });
                              }}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-white text-xs truncate max-w-[150px]">{email.to}</span>
                                <span className="text-[10px] text-slate-500">
                                  {new Date(email.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <div className="text-[11px] text-primary font-bold font-display truncate">{email.subject}</div>
                              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{email.body}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Email preview pane */}
                    <div className="lg:col-span-2 border border-slate-900 rounded-xl p-6 bg-slate-950/60 flex flex-col min-h-[40vh] justify-center items-center text-center">
                      <Mail className="w-12 h-12 text-slate-600 mb-3" />
                      <h4 className="font-bold text-slate-300 text-sm">Outbox Details Pane</h4>
                      <p className="text-xs text-slate-500 max-w-sm mt-1">Select an email log from the outbox list on the left to read its full message layout.</p>
                    </div>

                  </div>
                </div>
              )}

            </>
          )}

        </main>
      </div>

      {/* MODAL 1: STUDENT / REGISTRATION DETAIL OVERLAY */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          
          {selectedReg.isEmailPreview ? (
            /* EMAIL LOG VIEWER MODAL */
            <div className="bg-slate-950 border border-primary/30 rounded-xl w-full max-w-xl overflow-hidden flex flex-col shadow-2xl">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <span className="font-display font-bold text-primary text-sm uppercase tracking-wider">Simulated Welcome Outbox Message</span>
                <button onClick={() => setSelectedReg(null)} className="text-slate-500 hover:text-white font-bold">✕</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5 text-xs text-slate-400 font-mono border-b border-slate-900 pb-3">
                  <div><span className="text-slate-500">TO:</span> <span className="text-white font-bold">{selectedReg.emailTo}</span></div>
                  <div><span className="text-slate-500">SUBJECT:</span> <span className="text-primary font-bold">{selectedReg.emailSubject}</span></div>
                  <div><span className="text-slate-500">SENT:</span> <span className="text-white">{new Date(selectedReg.emailSent).toLocaleString()}</span></div>
                </div>
                <pre className="bg-slate-900/40 border border-slate-900 rounded-lg p-4 font-sans text-sm text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto">
                  {selectedReg.emailBody}
                </pre>
              </div>
            </div>
          ) : (
            /* REGISTRATION CARD DETAIL MODAL */
            <div className="bg-slate-950 border border-primary/30 rounded-xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl max-h-[90vh]">
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-mono text-cyan-400 font-bold block text-sm">{selectedReg.registration_id}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest block mt-0.5">STUDENT REGISTRY DOSSIER</span>
                </div>
                <button onClick={() => setSelectedReg(null)} className="text-slate-500 hover:text-white font-bold">✕</button>
              </div>

              <div className="p-8 overflow-y-auto space-y-6">
                
                {/* Section 1: Student Details */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Profile</h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-lg border border-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Name</span>
                      <p className="text-sm font-bold text-white mt-0.5">{selectedReg.student?.student_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Age / Class</span>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedReg.student?.age} years • {selectedReg.student?.grade_class}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Date of Birth</span>
                      <p className="text-sm text-slate-300 mt-0.5">{selectedReg.student?.date_of_birth}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Gender</span>
                      <p className="text-sm text-slate-300 mt-0.5">{selectedReg.student?.gender || "Not Specified"}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase">School Name</span>
                      <p className="text-sm text-slate-300 mt-0.5 font-medium">{selectedReg.student?.school_name}</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Parent Contacts */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parent Coordinates</h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-lg border border-slate-900">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Name</span>
                      <p className="text-sm font-bold text-white mt-0.5">{selectedReg.parent?.parent_name}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Email Address</span>
                      <p className="text-sm text-primary font-semibold mt-0.5">{selectedReg.parent?.email_address}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Mobile Number</span>
                      <p className="text-sm text-slate-300 mt-0.5">{selectedReg.parent?.mobile_number}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">WhatsApp Number</span>
                      <p className="text-sm text-slate-300 mt-0.5">{selectedReg.parent?.whatsapp_number}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Occupation</span>
                      <p className="text-sm text-slate-300 mt-0.5">{selectedReg.parent?.occupation || "Not Specified"}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Company Name</span>
                      <p className="text-sm text-slate-300 mt-0.5">{selectedReg.parent?.company_name || "Not Specified"}</p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Tech Interests & Experience */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Learning & Devices Profile</h4>
                  <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-lg border border-slate-900">
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 block uppercase mb-1">Previous Experience</span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: "scratch", val: selectedReg.scratch, label: "Scratch" },
                          { key: "python", val: selectedReg.python, label: "Python" },
                          { key: "chatgpt", val: selectedReg.chatgpt, label: "ChatGPT" },
                          { key: "robotics_kits", val: selectedReg.robotics_kits, label: "Robotics" }
                        ].map(tool => (
                          <span 
                            key={tool.key}
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              tool.val 
                                ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                                : "bg-slate-900 text-slate-600 border border-slate-800"
                            }`}
                          >
                            {tool.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-500 block uppercase mb-1">Technology Interests</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedReg.interests && selectedReg.interests.length > 0 ? (
                          selectedReg.interests.map((interest: string) => (
                            <span key={interest} className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                              {interest}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-600 italic">None selected</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Laptop Access</span>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">
                        {selectedReg.laptop_available ? `Yes (${selectedReg.operating_system})` : "No Laptop"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Internet Available</span>
                      <p className="text-sm font-semibold text-slate-200 mt-0.5">{selectedReg.internet_available ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>

                {/* Section 4: Consents */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Consent Status</h4>
                  <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-900 divide-y divide-slate-900 text-xs">
                    <div className="pb-2 flex justify-between">
                      <span className="text-slate-400">Project-based methodology understood</span>
                      <span className="text-emerald-400 font-bold">ACCEPTED</span>
                    </div>
                    <div className="py-2 flex justify-between">
                      <span className="text-slate-400">Email & WhatsApp notifications authorized</span>
                      <span className="text-emerald-400 font-bold">AUTHORIZED</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <span className="text-slate-400">General Terms & Privacy Policies signed</span>
                      <span className="text-emerald-400 font-bold">SIGNED</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
