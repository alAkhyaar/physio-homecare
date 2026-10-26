export type SessionStatus = "Jadwal" | "Selesai" | "Belum Lunas";
export type PaymentStatus = "LUNAS" | "BELUM LUNAS";

export interface Patient {
  id: string;
  name: string;
  phone: string;
  address: string;
  date_of_birth?: string;
  gender?: "Laki-laki" | "Perempuan";
  age?: number;
  initial_diagnosis: string;
  created_at?: string;
}

export interface Session {
  id: string;
  patient_id: string;
  scheduled_date: string;
  time?: string;
  status: SessionStatus;
  subjective: string | null;
  objective: string | null;
  assessment: string | null;
  plan: string | null;
  bill_amount: number;
  transport_amount: number;
  payment_status: PaymentStatus;
  created_at?: string;
  patient?: Patient;
}

export interface SessionMedia {
  id: string;
  session_id: string;
  file_url: string;
  description?: string;
  created_at?: string;
}

export interface SoapFormData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  photoAttached?: boolean;
}

export interface InvoiceFormData {
  billAmount: number;
  transportAmount: number;
  paymentStatus: PaymentStatus;
}
