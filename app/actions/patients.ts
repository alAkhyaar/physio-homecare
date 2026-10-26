"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  isSupabaseReachable,
  recordSupabaseError,
  resetSupabaseError,
} from "@/lib/supabase/server";
import { initialPatients, sampleHistoryMap } from "@/lib/mock-data";
import { Patient } from "@/lib/types";

let localPatients: Patient[] = [...initialPatients];

export async function getPatients(searchQuery: string = ""): Promise<Patient[]> {
  if (isSupabaseReachable()) {
    try {
      const supabase = createServerSupabaseClient();
      let query = supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,initial_diagnosis.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        resetSupabaseError();
        return data as Patient[];
      }
      if (error) {
        console.warn("Supabase getPatients error:", error.message);
      }
    } catch (err) {
      console.warn("Supabase getPatients catch:", err);
    }
  }

  // Fallback to localPatients if Supabase is offline or empty
  if (!searchQuery.trim()) return localPatients;
  const q = searchQuery.toLowerCase();
  return localPatients.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.initial_diagnosis && p.initial_diagnosis.toLowerCase().includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q))
  );
}

export async function getPatientById(patientId: string): Promise<Patient | null> {
  if (isSupabaseReachable()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();

      if (!error && data) {
        resetSupabaseError();
        return data as Patient;
      }
    } catch {
      // Fallback
    }
  }

  return localPatients.find((p) => p.id === patientId) || null;
}

export async function getPatientHistory(patientId: string) {
  if (isSupabaseReachable()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("patient_id", patientId)
        .order("scheduled_date", { ascending: false });

      if (!error && data && data.length > 0) {
        resetSupabaseError();
        return data.map((s) => ({
          date: new Date(s.scheduled_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          S: s.subjective || "Tidak ada catatan keluhan.",
          O: s.objective || "Pemeriksaan fisik dalam batas normal.",
          A: s.assessment || "Kondisi stabil.",
          P: s.plan || "Terapi modalitas & latihan mandiri.",
        }));
      }
    } catch {
      // Fallback
    }
  }

  return sampleHistoryMap[patientId] || [
    {
      date: "18 Okt 2026",
      S: "Nyeri pinggang berkurang saat duduk santai.",
      O: "Lasègue test 60 deg, spasme erector spinae berkurang signifikan.",
      A: "Perbaikan mobilitas dan fleksibilitas fungsional.",
      P: "Core stability exercise, TENS 15 min, PR: Bridging 3x10 rep.",
    },
  ];
}

export async function createPatient(patientData: {
  name: string;
  phone: string;
  address: string;
  gender: "Laki-laki" | "Perempuan";
  age: number;
  initial_diagnosis: string;
}) {
  const newPatient: Patient = {
    id: `p-${Date.now()}`,
    name: patientData.name,
    phone: patientData.phone,
    address: patientData.address,
    gender: patientData.gender,
    age: patientData.age,
    initial_diagnosis: patientData.initial_diagnosis,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseReachable()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("patients")
        .insert({
          id: newPatient.id,
          name: newPatient.name,
          phone: newPatient.phone,
          address: newPatient.address,
          gender: newPatient.gender,
          age: newPatient.age,
          initial_diagnosis: newPatient.initial_diagnosis,
          created_at: newPatient.created_at,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert patient error:", error.message);
      } else {
        resetSupabaseError();
        if (data) {
          newPatient.id = data.id;
        }
      }
    } catch (err) {
      console.error("Supabase insert patient exception:", err);
    }
  }

  localPatients = [newPatient, ...localPatients];
  revalidatePath("/patients");
  return { success: true, patient: newPatient };
}
