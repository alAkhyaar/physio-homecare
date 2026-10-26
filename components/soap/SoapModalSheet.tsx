"use client";

import React, { useState, useEffect } from "react";
import { Camera, CheckCircle2, ArrowRight, X, Sparkles } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { quickChipsData } from "@/lib/mock-data";
import { Session, SoapFormData } from "@/lib/types";

interface SoapModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onSubmitToInvoice: (soapData: SoapFormData) => void;
}

export function SoapModalSheet({
  isOpen,
  onClose,
  session,
  onSubmitToInvoice,
}: SoapModalSheetProps) {
  const [activeTab, setActiveTab] = useState<"S" | "O" | "A" | "P">("S");
  const [formData, setFormData] = useState<SoapFormData>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    photoAttached: false,
  });
  const [isPhotoSimulated, setIsPhotoSimulated] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        subjective:
          session.subjective ||
          (session.status === "Selesai"
            ? "Keluhan nyeri berkurang, terasa lebih enteng saat digerakkan."
            : ""),
        objective:
          session.objective ||
          (session.status === "Selesai"
            ? "TD 120/80 mmHg, ROM fleksi membaik 15 derajat, spasme minimal."
            : ""),
        assessment:
          session.assessment ||
          (session.status === "Selesai"
            ? "Progres perbaikan klinis positif sesuai target terapi."
            : ""),
        plan:
          session.plan ||
          (session.status === "Selesai"
            ? "TENS 15 Menit, Infrared 15 Menit, Latihan penguatan mandiri."
            : ""),
        photoAttached: session.status === "Selesai",
      });
      setIsPhotoSimulated(session.status === "Selesai");
    }
  }, [session]);

  const handleAppendChip = (category: "S" | "O" | "A" | "P", chipText: string) => {
    const keyMap = {
      S: "subjective",
      O: "objective",
      A: "assessment",
      P: "plan",
    } as const;

    const field = keyMap[category];
    const currentVal = formData[field];
    const updatedVal = currentVal ? `${currentVal}, ${chipText}` : chipText;

    setFormData((prev) => ({
      ...prev,
      [field]: updatedVal,
    }));
  };

  const handleAttachPhoto = () => {
    setIsPhotoSimulated(true);
    setFormData((prev) => ({ ...prev, photoAttached: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitToInvoice(formData);
  };

  const patientName = session?.patient?.name || "Pasien";
  const diagnosis = session?.patient?.initial_diagnosis || "Fisioterapi Homecare";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="p-0 h-[92vh] max-h-[92vh]">
        {/* Header */}
        <SheetHeader className="px-5 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center w-full">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Rekam Medis SOAP
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {session?.time || "Hari Ini"}
                </span>
              </div>
              <SheetTitle className="text-sm font-bold text-slate-900 mt-1">
                {patientName}
              </SheetTitle>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[260px]">
                {diagnosis}
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          {/* SOAP Tabs Navigation */}
          <div className="border-b border-slate-200 bg-white px-2 pt-1 shrink-0">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "S" | "O" | "A" | "P")}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-4 h-11 bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="S" className="text-xs font-bold py-2">
                  S (Subj)
                </TabsTrigger>
                <TabsTrigger value="O" className="text-xs font-bold py-2">
                  O (Obj)
                </TabsTrigger>
                <TabsTrigger value="A" className="text-xs font-bold py-2">
                  A (Asses)
                </TabsTrigger>
                <TabsTrigger value="P" className="text-xs font-bold py-2">
                  P (Plan)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content Panels (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* TAB S: Subjective */}
            {activeTab === "S" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-800">
                    Keluhan Utama & Subjektif Pasien:
                  </label>
                  <span className="text-[10px] text-slate-400">Tekan chip template di bawah</span>
                </div>
                <Textarea
                  value={formData.subjective}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subjective: e.target.value }))
                  }
                  rows={4}
                  placeholder="Tulis keluhan pasien hari ini (misal: nyeri pinggang berkurang, kaku saat bangun pagi)..."
                  className="bg-white border-slate-200"
                />

                {/* Quick Chips */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Template Teks Cepat (Ketuk untuk menambah):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickChipsData.S.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleAppendChip("S", chip)}
                        className="bg-slate-100 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-300 text-slate-700 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 active:scale-95 transition"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB O: Objective */}
            {activeTab === "O" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-slate-800">
                    Pemeriksaan Fisik & Tanda Vital:
                  </label>
                  <span className="text-[10px] text-slate-400">ROM / Skala Nyeri</span>
                </div>
                <Textarea
                  value={formData.objective}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, objective: e.target.value }))
                  }
                  rows={4}
                  placeholder="Hasil pemeriksaan fisik (misal: TD 120/80 mmHg, ROM fleksi bahu 115°, Lasègue test (+))..."
                  className="bg-white border-slate-200"
                />

                {/* Quick Chips */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Template Teks Cepat:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickChipsData.O.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleAppendChip("O", chip)}
                        className="bg-slate-100 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-300 text-slate-700 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 active:scale-95 transition"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo / Media Documentation */}
                <div className="pt-3 border-t border-slate-200">
                  <label className="block text-xs font-semibold text-slate-800 mb-2">
                    Dokumentasi Visual (Foto ROM / Postur):
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAttachPhoto}
                      className="border-dashed border-slate-300 hover:border-brand-500 text-slate-700 gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-brand-600" />
                      <span>{isPhotoSimulated ? "Ganti Foto" : "Ambil Foto Klinis"}</span>
                    </Button>
                    {isPhotoSimulated && (
                      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-200 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>1 Foto Terlampir</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB A: Assessment */}
            {activeTab === "A" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <label className="block text-xs font-semibold text-slate-800">
                  Analisis Klinis / Diagnosa Fisioterapi:
                </label>
                <Textarea
                  value={formData.assessment}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, assessment: e.target.value }))
                  }
                  rows={4}
                  placeholder="Analisa evaluasi respon terapi dan perkembangan fungsional pasien..."
                  className="bg-white border-slate-200"
                />

                {/* Quick Chips */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Template Teks Cepat:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickChipsData.A.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleAppendChip("A", chip)}
                        className="bg-slate-100 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-300 text-slate-700 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 active:scale-95 transition"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB P: Plan */}
            {activeTab === "P" && (
              <div className="space-y-3 animate-in fade-in-50 duration-200">
                <label className="block text-xs font-semibold text-slate-800">
                  Rencana Intervensi & PR Latihan Mandiri:
                </label>
                <Textarea
                  value={formData.plan}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, plan: e.target.value }))
                  }
                  rows={4}
                  placeholder="Tindakan yang diberikan hari ini (misal: TENS, Infrared, Active Resisted Ex) & instruksi latihan di rumah..."
                  className="bg-white border-slate-200"
                />

                {/* Quick Chips */}
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Template Teks Cepat (Alat Modalitas & Latihan):</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickChipsData.P.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleAppendChip("P", chip)}
                        className="bg-slate-100 hover:bg-brand-50 hover:text-brand-800 hover:border-brand-300 text-slate-700 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 active:scale-95 transition"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Footer Action Button */}
          <div className="p-4 border-t border-slate-200 bg-white shrink-0">
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-12 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25 active:scale-[0.99] transition"
            >
              <span>Selesaikan SOAP & Buat Invoice</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
