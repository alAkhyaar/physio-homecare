# FisioCare Mobile - Rekam Medis & Invoice Fisioterapi Homecare

MVP (Minimum Viable Product) aplikasi web Rekam Medis & Invoice Fisioterapi Homecare berbasis mobile-first yang dirancang khusus untuk pengoperasian cepat satu tangan (*thumb-driven*).

## 🚀 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Card, Sheet/Bottom Drawer, Tabs, Accordion, Badge, Button, Input, Textarea)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: Vercel

---

## 📱 Fitur Utama & Modul

### 1. Dashboard Harian (Layar Utama - `/`)
- **Quick Stats Banner**: Ringkasan jumlah kunjungan hari ini, status jadwal (Akan Datang, Selesai, Belum Lunas).
- **Tumpukan Card Kunjungan**: Menampilkan data pasien, usia, diagnosa, jam kunjungan, dan alamat.
- **Badge Status**: Indikator warna dinamis (`Jadwal` - Amber, `Selesai` - Emerald, `Belum Lunas` - Rose).
- **Aksi Cepat 1-Ketukan**:
  - Tombol WhatsApp langsung (`wa.me`)
  - Tombol Peta Google Maps navigasi alamat
  - Tombol **Mulai Sesi / Lihat SOAP**

### 2. Form SOAP Interaktif (`SoapModalSheet`)
- Bottom Drawer / Sheet responsif satu tangan.
- Tabs navigasi **S** (Subjective), **O** (Objective), **A** (Assessment), **P** (Plan).
- **Template Teks Cepat (*Quick Chips*)**: Ketukan satu jari untuk menambahkan frase medis umum tanpa mengetik manual (misal: `+ TENS 15 Menit`, `+ Infrared 15 Menit`, `+ Spasme M. Trapezius`, dsb).
- Simulasi dokumentasi visual / foto ROM klinis pada tab Objective.
- Tombol aksi utama: **Selesaikan SOAP & Buat Invoice**.

### 3. Modul Tagihan & Invoice (`InvoiceSheet`)
- Bottom Drawer otomatis muncul setelah SOAP disimpan.
- Form ringkas: **Biaya Tindakan Fisioterapi** & **Biaya Transportasi/Visit**.
- Perhitungan total biaya otomatis terformat Rupiah (IDR).
- **WhatsApp Intent Generator**: Preview format pesan struk invoice rapi dan tombol aksi **Simpan Sesi & Kirim WA** yang membuka `wa.me` secara instan.

### 4. Direktori Pasien (`/patients`)
- Pencarian data pasien dan diagnosa secara instan.
- Modal **Tambah Pasien Baru**.
- Detail Pasien (`PatientDetailModal`) dengan 2 Tab:
  - **Tab Informasi**: Baseline diagnosa awal, kontak, alamat, tombol panggil/chat.
  - **Tab Riwayat**: Timeline riwayat sesi SOAP sebelumnya secara kronologis.

### 5. Profil Terapis (`/profile`)
- Data terapis, nomor STR, status aktif, rekap statistik sesi bulanan, dan opsi sinkronisasi database.

---

## 🗄️ Skema Database Supabase (`supabase/schema.sql`)

Struktur tabel di PostgreSQL Supabase:
- `patients`: `id`, `name`, `phone`, `address`, `date_of_birth`, `gender`, `age`, `initial_diagnosis`, `created_at`
- `sessions`: `id`, `patient_id`, `scheduled_date`, `time`, `status`, `subjective`, `objective`, `assessment`, `plan`, `bill_amount`, `transport_amount`, `payment_status`, `created_at`
- `session_media`: `id`, `session_id`, `file_url`, `description`, `created_at`

---

## 🛠️ Panduan Menjalankan Project

### 1. Jalankan Server Dev Lokal
```bash
npm install
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 2. Konfigurasi Supabase (Opsional jika ingin menghubungkan database langsung)
1. Salin `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Isi nilai `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dari project Supabase Anda.
3. Jalankan script SQL yang ada di file `supabase/schema.sql` pada menu **SQL Editor** di dashboard Supabase Anda.

*Catatan: Jika Supabase belum dikonfigurasi, aplikasi secara otomatis menggunakan in-memory mock store berbasis prototype sehingga seluruh fitur dapat dicoba langsung tanpa error.*

### 3. Deploy ke Vercel
Aplikasi ini sudah dioptimalkan untuk deployment ke Vercel dengan satu klik melalui CLI:
```bash
npx vercel
```
Atau hubungkan repository GitHub ke dashboard Vercel.
