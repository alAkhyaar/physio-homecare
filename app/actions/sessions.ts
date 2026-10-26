"use server";

import { revalidatePath } from "next/cache";
import {
  createServerSupabaseClient,
  isSupabaseReachable,
  recordSupabaseError,
  resetSupabaseError,
} from "@/lib/supabase/server";
import { initialSessions, initialPatients } from "@/lib/mock-data";
import { Session, SessionStatus, PaymentStatus } from "@/lib/types";

// In-memory store for fallback or local demo
let localSessions: Session[] = [...initialSessions];

export async function getSessionsForToday(): Promise<Session[]> {
  if (!isSupabaseReachable()) {
    return localSessions;
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        patient:patients(*)
      `)
      .order("scheduled_date", { ascending: true });

    if (error) {
      recordSupabaseError();
      return localSessions;
    }

    if (!data || data.length === 0) {
      return localSessions;
    }

    resetSupabaseError();
    return data.map((item) => ({
      ...item,
      patient: item.patient,
    }));
  } catch (err) {
    recordSupabaseError();
    return localSessions;
  }
}

export async function updateSessionSoap(
  sessionId: string,
  soapData: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }
) {
  if (isSupabaseReachable()) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase
        .from("sessions")
        .update({
          subjective: soapData.subjective,
          objective: soapData.objective,
          assessment: soapData.assessment,
          plan: soapData.plan,
        })
        .eq("id", sessionId);

      if (error) {
        recordSupabaseError();
      } else {
        resetSupabaseError();
      }
    } catch (err) {
      recordSupabaseError();
    }
  }

  // Update in local memory
  localSessions = localSessions.map((s) =>
    s.id === sessionId
      ? {
          ...s,
          subjective: soapData.subjective,
          objective: soapData.objective,
          assessment: soapData.assessment,
          plan: soapData.plan,
        }
      : s
  );

  revalidatePath("/");
  return { success: true };
}

export async function updateSessionBillingAndComplete(
  sessionId: string,
  billing: {
    bill_amount: number;
    transport_amount: number;
    status: SessionStatus;
    payment_status: PaymentStatus;
  }
) {
  if (isSupabaseReachable()) {
    try {
      const supabase = createServerSupabaseClient();
      const { error } = await supabase
        .from("sessions")
        .update({
          bill_amount: billing.bill_amount,
          transport_amount: billing.transport_amount,
          status: billing.status,
          payment_status: billing.payment_status,
        })
        .eq("id", sessionId);

      if (error) {
        recordSupabaseError();
      } else {
        resetSupabaseError();
      }
    } catch (err) {
      recordSupabaseError();
    }
  }

  localSessions = localSessions.map((s) =>
    s.id === sessionId
      ? {
          ...s,
          bill_amount: billing.bill_amount,
          transport_amount: billing.transport_amount,
          status: billing.status,
          payment_status: billing.payment_status,
        }
      : s
  );

  revalidatePath("/");
  return { success: true };
}

export async function generateWhatsAppInvoiceUrl(
  patientPhone: string,
  patientName: string,
  billAmount: number,
  transportAmount: number,
  therapistName: string = "Ftr. Sarah Amalia, S.Ft"
): Promise<string> {
  const total = billAmount + transportAmount;
  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const message =
    `*BUKTI PEMBAYARAN FISIOTERAPI HOMECARE*\n` +
    `----------------------------------------\n` +
    `Tanggal: ${dateStr}\n` +
    `Pasien: ${patientName}\n\n` +
    `Rincian Tagihan:\n` +
    `- Tindakan Fisioterapi: ${formatRupiah(billAmount)}\n` +
    `- Biaya Visit / Transport: ${formatRupiah(transportAmount)}\n` +
    `*TOTAL: ${formatRupiah(total)}*\n\n` +
    `Status: *LUNAS*\n\n` +
    `Terima kasih atas kepercayaannya. Semoga lekas pulih!\n` +
    `_${therapistName}_`;

  const cleanPhone = patientPhone.replace(/[^0-9]/g, "");
  const normalizedPhone = cleanPhone.startsWith("0")
    ? "62" + cleanPhone.slice(1)
    : cleanPhone;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
