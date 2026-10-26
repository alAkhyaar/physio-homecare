"use client";

import React, { useState, useEffect } from "react";
import { Activity, History, Phone, MessageCircle, MapPin, Calendar, X, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Patient } from "@/lib/types";
import { getPatientHistory } from "@/app/actions/patients";
import { getInitials } from "@/lib/utils";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export function PatientDetailModal({
  isOpen,
  onClose,
  patient,
}: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
  const [historyList, setHistoryList] = useState<
    Array<{ date: string; S: string; O: string; A: string; P: string }>
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (patient) {
      setIsLoadingHistory(true);
      getPatientHistory(patient.id)
        .then((data) => setHistoryList(data))
        .catch(() => setHistoryList([]))
        .finally(() => setIsLoadingHistory(false));
    }
  }, [patient]);

  if (!patient) return null;

  const waUrl = `https://wa.me/${patient.phone.replace(/[^0-9]/g, "")}`;
  const telUrl = `tel:${patient.phone}`;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="p-0 h-[92vh] max-h-[92vh]">
        {/* Header */}
        <SheetHeader className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center border border-brand-200 shadow-xs">
                {getInitials(patient.name)}
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-slate-900 leading-snug">
                  {patient.name}
                </SheetTitle>
                <p className="text-xs text-slate-500 font-medium">
                  {patient.gender || "Pasien"}, {patient.age ? `${patient.age} Tahun` : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </SheetHeader>

        {/* Tab Header */}
        <div className="border-b border-slate-200 bg-white px-4 pt-2 shrink-0">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "info" | "history")}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2 h-10 bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="info" className="text-xs font-bold gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Informasi</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs font-bold gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Riwayat Sesi ({historyList.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "info" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              {/* Diagnosa Awal / Baseline */}
              <div className="bg-brand-50/80 border border-brand-200 rounded-2xl p-4 text-xs text-brand-900 space-y-1.5 shadow-xs">
                <div className="font-bold flex items-center gap-1.5 text-brand-800">
                  <Activity className="w-4 h-4 text-brand-700" />
                  <span>Diagnosa Awal (Baseline Fisioterapi)</span>
                </div>
                <p className="font-semibold text-slate-800 text-sm">
                  {patient.initial_diagnosis}
                </p>
                <p className="text-[11px] text-brand-700 font-medium">
                  Rencana Target: Pemulihan fungsional mandiri & pengurangan skala nyeri.
                </p>
              </div>

              {/* Data Pasien Details */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 text-xs shadow-xs">
                <h4 className="font-bold text-slate-800 text-xs border-b border-slate-100 pb-2">
                  Detail Kontak & Domisili
                </h4>

                <div className="flex items-start gap-2.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700">Alamat Kunjungan:</p>
                    <p className="text-slate-600 mt-0.5">{patient.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600 pt-1">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-700">Nomor Telepon / WhatsApp:</p>
                    <p className="text-slate-800 font-bold mt-0.5">{patient.phone}</p>
                  </div>
                </div>

                {patient.date_of_birth && (
                  <div className="flex items-center gap-2.5 text-slate-600 pt-1">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-700">Tanggal Lahir:</p>
                      <p className="text-slate-600 mt-0.5">{patient.date_of_birth}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Contact Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim WhatsApp</span>
                </a>
                <a
                  href={telUrl}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition active:scale-98"
                >
                  <Phone className="w-4 h-4 text-slate-600" />
                  <span>Telepon Langsung</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4 animate-in fade-in-50 duration-200">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-brand-600" />
                  <span>Timeline Riwayat SOAP</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">
                  {historyList.length} Sesi Tercatat
                </span>
              </div>

              {isLoadingHistory ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Memuat riwayat sesi...
                </div>
              ) : historyList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Belum ada riwayat sesi rekam medis tercatat.
                </div>
              ) : (
                <div className="space-y-3.5 relative pl-3.5 border-l-2 border-brand-200 ml-2 pt-1 pb-4">
                  {historyList.map((session, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <div className="w-3 h-3 rounded-full bg-brand-600 border-2 border-white ring-2 ring-brand-100 absolute -left-[20px] top-1.5" />

                      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2 text-xs hover:border-brand-200 transition">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span className="font-bold text-slate-900">
                            Sesi Ke-{historyList.length - index}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                            {session.date}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-slate-700 leading-relaxed text-[11px]">
                          <p>
                            <strong className="text-brand-700 font-bold">S: </strong>
                            <span>{session.S}</span>
                          </p>
                          <p>
                            <strong className="text-brand-700 font-bold">O: </strong>
                            <span>{session.O}</span>
                          </p>
                          <p>
                            <strong className="text-brand-700 font-bold">A: </strong>
                            <span>{session.A}</span>
                          </p>
                          <p>
                            <strong className="text-brand-700 font-bold">P: </strong>
                            <span>{session.P}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
