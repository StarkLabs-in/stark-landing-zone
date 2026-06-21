-- Create parents table
CREATE TABLE IF NOT EXISTS parents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email_address TEXT NOT NULL,
    occupation TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    age INT NOT NULL,
    date_of_birth DATE NOT NULL,
    school_name TEXT NOT NULL,
    grade_class TEXT NOT NULL,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id TEXT UNIQUE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    -- Learning Profile
    scratch BOOLEAN DEFAULT false,
    python BOOLEAN DEFAULT false,
    chatgpt BOOLEAN DEFAULT false,
    robotics_kits BOOLEAN DEFAULT false,
    none_used BOOLEAN DEFAULT false,
    interests TEXT[] DEFAULT '{}',
    -- Device Availability
    laptop_available BOOLEAN NOT NULL,
    operating_system TEXT NOT NULL, -- 'Windows', 'Mac', 'Chromebook'
    internet_available BOOLEAN NOT NULL,
    -- Program & Batch
    program TEXT NOT NULL, -- 'Junior Innovators', 'AI Explorers', 'Future Builders'
    preferred_batch TEXT NOT NULL, -- 'Saturday', 'Sunday', 'Both'
    -- Demo Booking
    demo_date DATE,
    demo_time_slot TEXT,
    -- Consent
    consent_project_based BOOLEAN DEFAULT false,
    consent_communication BOOLEAN DEFAULT false,
    consent_terms_privacy BOOLEAN DEFAULT false,
    -- Status
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'waiting_list'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leads table for waitlist / quick inquiries
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_name TEXT NOT NULL,
    email_address TEXT NOT NULL,
    mobile_number TEXT NOT NULL,
    student_name TEXT,
    student_age INT,
    program TEXT,
    preferred_batch TEXT,
    community TEXT,
    status TEXT DEFAULT 'waiting_list',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger to execute before insert for registration ID generation
CREATE OR REPLACE FUNCTION generate_stark_reg_id()
RETURNS TRIGGER AS $$
DECLARE
    current_year_str TEXT;
    next_seq INT;
    new_reg_id TEXT;
BEGIN
    current_year_str := to_char(CURRENT_DATE, 'YYYY');
    
    -- Select next sequence for current year
    SELECT COALESCE(MAX(SUBSTRING(registration_id FROM 12 FOR 4)::INT), 0) + 1
    INTO next_seq
    FROM registrations
    WHERE registration_id LIKE 'STARK-' || current_year_str || '-%';
    
    new_reg_id := 'STARK-' || current_year_str || '-' || lpad(next_seq::TEXT, 4, '0');
    NEW.registration_id := new_reg_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute before insert
CREATE OR REPLACE TRIGGER trg_generate_stark_reg_id
BEFORE INSERT ON registrations
FOR EACH ROW
WHEN (NEW.registration_id IS NULL)
EXECUTE FUNCTION generate_stark_reg_id();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- RLS POLICIES
-- -----------------------------------------------------

-- Policies for parents table
CREATE POLICY "Allow public insert on parents" ON parents
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on parents" ON parents
    FOR ALL TO authenticated
    USING (true);

-- Policies for students table
CREATE POLICY "Allow public insert on students" ON students
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on students" ON students
    FOR ALL TO authenticated
    USING (true);

-- Policies for registrations table
CREATE POLICY "Allow public insert on registrations" ON registrations
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow public select on registrations" ON registrations
    FOR SELECT TO public
    USING (true);

CREATE POLICY "Allow authenticated full access on registrations" ON registrations
    FOR ALL TO authenticated
    USING (true);

-- Policies for leads table
CREATE POLICY "Allow public insert on leads" ON leads
    FOR INSERT TO public
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on leads" ON leads
    FOR ALL TO authenticated
    USING (true);
