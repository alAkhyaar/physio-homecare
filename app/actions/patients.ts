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

      if (error) {
        console.warn("Supabase getPatients error:", error.message);
        recordSupabaseError();
      } else {
        // data could be [] (empty table) — that's still valid, return it
        resetSupabaseError();
        return (data as Patient[]) ?? [];
      }
    } catch (err) {
      console.warn("Supabase getPatients catch:", err);
      recordSupabaseError();
    }
  }

  // Fallback to in-memory data only when Supabase is truly unreachable
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

      if (error) {
        console.warn("Supabase getPatientById error:", error.message);
      } else if (data) {
        resetSupabaseError();
        return data as Patient;
      }
    } catch (err) {
      console.warn("Supabase getPatientById catch:", err);
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

      if (error) {
        console.warn("Supabase getPatientHistory error:", error.message);
      } else {
        resetSupabaseError();
        return (data ?? []).map((s) => ({
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
    } catch (err) {
      console.warn("Supabase getPatientHistory catch:", err);
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
  if (isSupabaseReachable()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from("patients")
        .insert({
          name: patientData.name,
          phone: patientData.phone,
          address: patientData.address,
          gender: patientData.gender,
          age: patientData.age,
          initial_diagnosis: patientData.initial_diagnosis,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase insert patient error:", error.message, error.details, error.hint);
        // Fall through to in-memory fallback
      } else {
        resetSupabaseError();
        revalidatePath("/patients");
        return { success: true, patient: data as Patient };
      }
    } catch (err) {
      console.error("Supabase insert patient exception:", err);
    }
  }

  // Fallback: save in-memory only (offline mode)
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
  localPatients = [newPatient, ...localPatients];
  revalidatePath("/patients");
  return { success: true, patient: newPatient, offline: true };
}
