-- ==============================================================================
-- SKEMA DATABASE SUPABASE: FISIOTERAPI HOMECARE REKAM MEDIS & INVOICE
-- ==============================================================================

-- 1. Table: patients
CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('Laki-laki', 'Perempuan')),
    age INTEGER,
    initial_diagnosis TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: sessions
CREATE TABLE IF NOT EXISTS public.sessions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TEXT DEFAULT '09:00 WIB',
    status TEXT NOT NULL CHECK (status IN ('Jadwal', 'Selesai', 'Belum Lunas')) DEFAULT 'Jadwal',
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    bill_amount NUMERIC NOT NULL DEFAULT 150000,
    transport_amount NUMERIC NOT NULL DEFAULT 50000,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('LUNAS', 'BELUM LUNAS')) DEFAULT 'BELUM LUNAS',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: session_media
CREATE TABLE IF NOT EXISTS public.session_media (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
    session_id TEXT REFERENCES public.sessions(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sessions_patient_id ON public.sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_date ON public.sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_session_media_session_id ON public.session_media(session_id);

-- Enable full read & write access for public/anon key (penting agar list pasien langsung terlihat)
ALTER TABLE public.patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_media DISABLE ROW LEVEL SECURITY;

-- Sample Initial Data Seed
INSERT INTO public.patients (id, name, phone, address, gender, age, initial_diagnosis)
VALUES 
    ('p-101', 'Bpk. Hendra Wijaya', '6281234567890', 'Jl. Kebayoran Baru No. 14, Jakarta Selatan', 'Laki-laki', 58, 'Post-Stroke Iskemik Hemiparese Dextra'),
    ('p-102', 'Ibu Ratna Sari', '6281987654321', 'Jl. Wijaya Timur II No. 8, Jakarta Selatan', 'Perempuan', 45, 'Frozen Shoulder Sinistra Stage II'),
    ('p-103', 'Bpk. Bambang Sutrisno', '6281122334455', 'Jl. Radio Dalam Raya No. 45, Jakarta Selatan', 'Laki-laki', 62, 'Low Back Pain ec HNP L4-L5')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sessions (id, patient_id, scheduled_date, time, status, subjective, objective, assessment, plan, bill_amount, transport_amount, payment_status)
VALUES
    ('s-201', 'p-101', CURRENT_DATE, '09:00 WIB', 'Jadwal', NULL, NULL, NULL, NULL, 150000, 50000, 'BELUM LUNAS'),
    ('s-202', 'p-102', CURRENT_DATE, '11:30 WIB', 'Belum Lunas', 'Nyeri bahu kiri menjalar saat abduksi >90 deg', 'ROM fleksi 110 deg, abduksi 95 deg', 'Frozen shoulder stadium pembekuan', 'Infrared 15 min, Passive ROM, Mobilisasi sendi GH', 175000, 50000, 'BELUM LUNAS'),
    ('s-203', 'p-103', CURRENT_DATE, '14:00 WIB', 'Selesai', 'Nyeri pinggang berkurang saat duduk santai', 'Lasègue test 65 deg, spasme erector spinae berkurang', 'LBP ec HNP perbaikan fleksibilitas', 'TENS 15 min, IR 15 min, Core stability exercise', 200000, 50000, 'LUNAS')
ON CONFLICT (id) DO NOTHING;
