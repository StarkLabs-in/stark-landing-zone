import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and present
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "your-supabase-url");

// Initialize real Supabase client or null
const realSupabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock database models
interface MockParent {
  id: string;
  parent_name: string;
  mobile_number: string;
  whatsapp_number: string;
  email_address: string;
  occupation?: string;
  company_name?: string;
  created_at: string;
}

interface MockStudent {
  id: string;
  student_name: string;
  age: number;
  date_of_birth: string;
  school_name: string;
  grade_class: string;
  gender?: string;
  created_at: string;
}

interface MockRegistration {
  id: string;
  registration_id: string;
  student_id: string;
  parent_id: string;
  scratch: boolean;
  python: boolean;
  chatgpt: boolean;
  robotics_kits: boolean;
  none_used: boolean;
  interests: string[];
  laptop_available: boolean;
  operating_system: string;
  internet_available: boolean;
  program: string;
  preferred_batch: string;
  demo_date?: string;
  demo_time_slot?: string;
  consent_project_based: boolean;
  consent_communication: boolean;
  consent_terms_privacy: boolean;
  status: string;
  created_at: string;
  // Joins for mock queries
  student?: MockStudent;
  parent?: MockParent;
}

interface MockLead {
  id: string;
  parent_name: string;
  email_address: string;
  mobile_number: string;
  student_name?: string;
  student_age?: number;
  program?: string;
  preferred_batch?: string;
  status: string;
  created_at: string;
}

// Local Storage Helper
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Initial Mock Seeding Data (Chennai focus)
const CHENNAI_SCHOOLS = [
  "DAV Public School, Velachery",
  "Sishya School, Adyar",
  "The School KFI, Thiruvanmiyur",
  "Chettinad Vidyashram, RA Puram",
  "Padma Seshadri Bala Bhavan (PSBB), Nungambakkam",
  "Don Bosco Matriculation, Egmore",
  "Kendriya Vidyalaya, IIT Madras",
  "Bhavan's Rajaji Vidyashram, Kilpauk"
];

const MOCK_STUDENT_NAMES = [
  "Aarav", "Ananya", "Arjun", "Diya", "Aditya", "Riya", "Kavya", "Rahul", 
  "Siddharth", "Pooja", "Vikram", "Meera", "Hari", "Shruti", "Sai", "Krish"
];

const MOCK_PARENT_NAMES = [
  "Ramesh Kumar", "Suresh Rajesh", "Lakshmi Narayanan", "Priya Sundar", "Vijay Krishnan",
  "Meenakshi Sundaram", "Anand Swaminathan", "Geetha Ramaswamy"
];

const JOBS = [
  "Software Architect", "Data Scientist", "Lead AI Engineer", "Tech Consultant",
  "Business Director", "Product Manager", "Entrepreneur", "Research Professor"
];

const COMPANIES = [
  "Stark Industries", "TCS", "Infosys", "Cognizant", "Zoho Corporation", "Freshworks", "Google", "Microsoft"
];

export const seedMockData = (force = false) => {
  const existingRegs = getLocalStorage<MockRegistration[]>("stark_mock_registrations", []);
  if (existingRegs.length > 0 && !force) return;

  const parents: MockParent[] = [];
  const students: MockStudent[] = [];
  const registrations: MockRegistration[] = [];
  const leads: MockLead[] = [];

  const now = new Date();

  // Create registrations
  for (let i = 1; i <= 35; i++) {
    const parentId = crypto.randomUUID();
    const studentId = crypto.randomUUID();
    const regId = `STARK-2026-${String(i).padStart(4, "0")}`;

    const age = Math.floor(Math.random() * 10) + 8; // 8-17
    const dob = new Date(now.getFullYear() - age, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0];
    const program = age <= 11 ? "Junior Innovators (Age 8-11)" : age <= 14 ? "AI Explorers (Age 12-14)" : "Future Builders (Age 15-17)";
    const batch = ["Saturday", "Sunday", "Both"][Math.floor(Math.random() * 3)];
    const pName = MOCK_PARENT_NAMES[Math.floor(Math.random() * MOCK_PARENT_NAMES.length)];
    const sName = MOCK_STUDENT_NAMES[Math.floor(Math.random() * MOCK_STUDENT_NAMES.length)] + " " + pName.split(" ")[1];

    const parent: MockParent = {
      id: parentId,
      parent_name: pName,
      mobile_number: `+91 9840${Math.floor(100000 + Math.random() * 900000)}`,
      whatsapp_number: `+91 9840${Math.floor(100000 + Math.random() * 900000)}`,
      email_address: `${pName.toLowerCase().replace(" ", ".")}@example.com`,
      occupation: JOBS[Math.floor(Math.random() * JOBS.length)],
      company_name: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
      created_at: new Date(now.getTime() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString()
    };

    const student: MockStudent = {
      id: studentId,
      student_name: sName,
      age,
      date_of_birth: dob,
      school_name: CHENNAI_SCHOOLS[Math.floor(Math.random() * CHENNAI_SCHOOLS.length)],
      grade_class: `Class ${age - 5}`,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      created_at: parent.created_at
    };

    // Allocate some slots
    const demoDate = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const demoSlot = ["10:00 AM - 11:30 AM", "02:00 PM - 03:30 PM", "04:30 PM - 06:00 PM"][Math.floor(Math.random() * 3)];

    const registration: MockRegistration = {
      id: crypto.randomUUID(),
      registration_id: regId,
      student_id: studentId,
      parent_id: parentId,
      scratch: Math.random() > 0.4,
      python: age > 11 && Math.random() > 0.6,
      chatgpt: Math.random() > 0.3,
      robotics_kits: Math.random() > 0.7,
      none_used: false,
      interests: ["AI", "Coding", "Robotics", "Gaming"].filter(() => Math.random() > 0.5),
      laptop_available: Math.random() > 0.1,
      operating_system: ["Windows", "Mac", "Chromebook"][Math.floor(Math.random() * 3)],
      internet_available: true,
      program,
      preferred_batch: batch,
      demo_date: Math.random() > 0.2 ? demoDate : undefined,
      demo_time_slot: Math.random() > 0.2 ? demoSlot : undefined,
      consent_project_based: true,
      consent_communication: true,
      consent_terms_privacy: true,
      status: Math.random() > 0.85 ? "waiting_list" : "confirmed",
      created_at: parent.created_at
    };
    
    // Set none_used if all false
    if (!registration.scratch && !registration.python && !registration.chatgpt && !registration.robotics_kits) {
      registration.none_used = true;
    }

    parents.push(parent);
    students.push(student);
    registrations.push(registration);
  }

  // Add a few leads (waitlist inquiries)
  for (let i = 1; i <= 8; i++) {
    const parentName = MOCK_PARENT_NAMES[Math.floor(Math.random() * MOCK_PARENT_NAMES.length)];
    const studentName = MOCK_STUDENT_NAMES[Math.floor(Math.random() * MOCK_STUDENT_NAMES.length)] + " " + parentName.split(" ")[1];
    const age = Math.floor(Math.random() * 10) + 8;
    const program = age <= 11 ? "Junior Innovators (Age 8-11)" : age <= 14 ? "AI Explorers (Age 12-14)" : "Future Builders (Age 15-17)";

    leads.push({
      id: crypto.randomUUID(),
      parent_name: parentName,
      email_address: `${parentName.toLowerCase().replace(" ", ".")}@waitlist.com`,
      mobile_number: `+91 9940${Math.floor(100000 + Math.random() * 900000)}`,
      student_name: studentName,
      student_age: age,
      program,
      preferred_batch: ["Saturday", "Sunday"][Math.floor(Math.random() * 2)],
      status: "waiting_list",
      created_at: new Date(now.getTime() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  setLocalStorage("stark_mock_parents", parents);
  setLocalStorage("stark_mock_students", students);
  setLocalStorage("stark_mock_registrations", registrations);
  setLocalStorage("stark_mock_leads", leads);
};

// Seed automatically on first import
if (!isSupabaseConfigured) {
  seedMockData();
}

// Mock Database API wrapper
const mockDatabase = {
  from(table: string) {
    return {
      async insert(payload: any) {
        // Handle inserts depending on tables
        if (table === "parents") {
          const list = getLocalStorage<MockParent[]>("stark_mock_parents", []);
          const items = Array.isArray(payload) ? payload : [payload];
          const newItems = items.map(item => ({
            id: item.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            ...item
          }));
          list.push(...newItems);
          setLocalStorage("stark_mock_parents", list);
          return { data: Array.isArray(payload) ? newItems : newItems[0], error: null };
        }

        if (table === "students") {
          const list = getLocalStorage<MockStudent[]>("stark_mock_students", []);
          const items = Array.isArray(payload) ? payload : [payload];
          const newItems = items.map(item => ({
            id: item.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            ...item
          }));
          list.push(...newItems);
          setLocalStorage("stark_mock_students", list);
          return { data: Array.isArray(payload) ? newItems : newItems[0], error: null };
        }

        if (table === "registrations") {
          const list = getLocalStorage<MockRegistration[]>("stark_mock_registrations", []);
          const items = Array.isArray(payload) ? payload : [payload];
          
          const newItems = items.map(item => {
            // Generate STARK registration ID
            const currentYear = new Date().getFullYear();
            const yearStr = String(currentYear);
            const thisYearRegs = list.filter(r => r.registration_id?.startsWith(`STARK-${yearStr}-`));
            const maxSeq = thisYearRegs.reduce((max, r) => {
              const parts = r.registration_id.split("-");
              const seq = parseInt(parts[2] || "0", 10);
              return seq > max ? seq : max;
            }, 0);
            
            const nextSeq = maxSeq + 1;
            const regId = `STARK-${yearStr}-${String(nextSeq).padStart(4, "0")}`;

            return {
              id: item.id || crypto.randomUUID(),
              registration_id: regId,
              status: item.status || "confirmed",
              created_at: new Date().toISOString(),
              ...item
            };
          });

          list.push(...newItems);
          setLocalStorage("stark_mock_registrations", list);
          return { data: Array.isArray(payload) ? newItems : newItems[0], error: null };
        }

        if (table === "leads") {
          const list = getLocalStorage<MockLead[]>("stark_mock_leads", []);
          const items = Array.isArray(payload) ? payload : [payload];
          const newItems = items.map(item => ({
            id: item.id || crypto.randomUUID(),
            created_at: new Date().toISOString(),
            status: "waiting_list",
            ...item
          }));
          list.push(...newItems);
          setLocalStorage("stark_mock_leads", list);
          return { data: Array.isArray(payload) ? newItems : newItems[0], error: null };
        }

        return { data: null, error: { message: `Table ${table} not recognized in mock DB` } };
      },

      select(columns = "*") {
        // Query operations builder
        return {
          async then(callback: any) {
            // Resolves the select query
            let result: any[] = [];
            
            if (table === "registrations") {
              const regs = getLocalStorage<MockRegistration[]>("stark_mock_registrations", []);
              const students = getLocalStorage<MockStudent[]>("stark_mock_students", []);
              const parents = getLocalStorage<MockParent[]>("stark_mock_parents", []);
              
              // Hydrate relations (join)
              result = regs.map(reg => ({
                ...reg,
                student: students.find(s => s.id === reg.student_id),
                parent: parents.find(p => p.id === reg.parent_id)
              }));
            } else if (table === "leads") {
              result = getLocalStorage<MockLead[]>("stark_mock_leads", []);
            } else if (table === "students") {
              result = getLocalStorage<MockStudent[]>("stark_mock_students", []);
            } else if (table === "parents") {
              result = getLocalStorage<MockParent[]>("stark_mock_parents", []);
            }

            // Sort by created_at descending
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            return callback({ data: result, error: null });
          },

          // Mock slot filter for count check
          eq(column: string, value: any) {
            const builder = this;
            return {
              async then(callback: any) {
                let list: any[] = [];
                if (table === "registrations") {
                  list = getLocalStorage<MockRegistration[]>("stark_mock_registrations", []);
                } else if (table === "leads") {
                  list = getLocalStorage<MockLead[]>("stark_mock_leads", []);
                }
                const filtered = list.filter(item => item[column] === value);
                return callback({ data: filtered, error: null });
              },
              eq(col2: string, val2: any) {
                return {
                  async then(cb: any) {
                    let list: any[] = [];
                    if (table === "registrations") {
                      list = getLocalStorage<MockRegistration[]>("stark_mock_registrations", []);
                    }
                    const filtered = list.filter(item => item[column] === value && item[col2] === val2);
                    return cb({ data: filtered, error: null });
                  }
                };
              }
            };
          }
        };
      }
    };
  }
};

// Mock Auth logic
const mockAuth = {
  async signInWithPassword({ email, password }: any) {
    if (email === "admin@starklabs.in" || email === "admin") {
      if (password === "stark-labs-2026" || password === "password") {
        const sessionToken = "mock-session-token-" + crypto.randomUUID();
        localStorage.setItem("stark_mock_session", sessionToken);
        return { data: { user: { email, id: "admin-uuid" }, session: { access_token: sessionToken } }, error: null };
      }
    }
    return { data: null, error: { message: "Invalid credentials. Try admin@starklabs.in / stark-labs-2026" } };
  },

  async signOut() {
    localStorage.removeItem("stark_mock_session");
    return { error: null };
  },

  async getSession() {
    const sessionToken = localStorage.getItem("stark_mock_session");
    if (sessionToken) {
      return { data: { session: { access_token: sessionToken, user: { email: "admin@starklabs.in" } } }, error: null };
    }
    return { data: { session: null }, error: null };
  }
};

// Export active client
export const supabase = isSupabaseConfigured 
  ? realSupabase! 
  : ({
      ...mockDatabase,
      auth: mockAuth
    } as any);
