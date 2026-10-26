"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, CheckCircle2 } from "lucide-react";
import { QuickStats } from "./QuickStats";
import { VisitCard } from "./VisitCard";
import { SoapModalSheet } from "@/components/soap/SoapModalSheet";
import { InvoiceSheet } from "@/components/invoice/InvoiceSheet";
import { Session, SoapFormData } from "@/lib/types";
import {
  updateSessionSoap,
  updateSessionBillingAndComplete,
} from "@/app/actions/sessions";

interface DashboardClientProps {
  initialSessions: Session[];
}

export function DashboardClient({ initialSessions }: DashboardClientProps) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [isSoapOpen, setIsSoapOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenSoap = (session: Session) => {
    setActiveSession(session);
    setIsSoapOpen(true);
  };

  const handleSubmitSoapToInvoice = async (soapData: SoapFormData) => {
    if (!activeSession) return;

    // Call Server Action
    await updateSessionSoap(activeSession.id, {
      subjective: soapData.subjective,
      objective: soapData.objective,
      assessment: soapData.assessment,
      plan: soapData.plan,
    });

    // Update locally
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              subjective: soapData.subjective,
              objective: soapData.objective,
              assessment: soapData.assessment,
              plan: soapData.plan,
            }
          : s
      )
    );

    setIsSoapOpen(false);
    setIsInvoiceOpen(true);
    showToast("SOAP tersimpan. Silakan periksa rincian invoice.");
  };

  const handleConfirmAndSendInvoice = async (
    billAmount: number,
    transportAmount: number,
    waUrl: string
  ) => {
    if (!activeSession) return;

    // Call Server Action
    await updateSessionBillingAndComplete(activeSession.id, {
      bill_amount: billAmount,
      transport_amount: transportAmount,
      status: "Selesai",
      payment_status: "LUNAS",
    });

    // Update locally
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              bill_amount: billAmount,
              transport_amount: transportAmount,
              status: "Selesai",
              payment_status: "LUNAS",
            }
          : s
      )
    );

    setIsInvoiceOpen(false);
    showToast("Sesi selesai! Membuka WhatsApp...");

    // Open WhatsApp Web/App
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 left-4 right-4 max-w-sm mx-auto bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between z-50 animate-in fade-in slide-in-from-top duration-300">
          <span className="font-medium">{toastMessage}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
        </div>
      )}

      {/* Quick Stats Banner */}
      <QuickStats sessions={sessions} />

      {/* Section Title & Filter */}
      <div className="flex justify-between items-center pt-1 px-0.5">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-brand-600" />
          <span>Daftar Kunjungan Hari Ini</span>
        </h3>
        <Link
          href="/patients"
          className="text-xs text-brand-700 font-semibold hover:underline"
        >
          Lihat Pasien &rarr;
        </Link>
      </div>

      {/* Visit Cards Stack */}
      <div className="space-y-3">
        {sessions.map((session) => (
          <VisitCard
            key={session.id}
            session={session}
            onOpenSoap={handleOpenSoap}
          />
        ))}
      </div>

      {/* SOAP Modal Sheet */}
      <SoapModalSheet
        isOpen={isSoapOpen}
        onClose={() => setIsSoapOpen(false)}
        session={activeSession}
        onSubmitToInvoice={handleSubmitSoapToInvoice}
      />

      {/* Invoice Sheet */}
      <InvoiceSheet
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        session={activeSession}
        onConfirmAndSend={handleConfirmAndSendInvoice}
      />
    </div>
  );
}
