"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, GripVertical, Lightbulb, Save, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ChipCategory = "subjective" | "objective" | "assessment" | "plan";

const defaultChips: Record<ChipCategory, string[]> = {
  subjective: [
    "Nyeri pinggang bawah",
    "Nyeri lutut saat menekuk",
    "Kesemutan di ekstremitas",
    "Kaku pagi hari",
    "Nyeri bahu saat mengangkat",
    "Keluhan berkurang",
    "Nyeri leher menjalar",
  ],
  objective: [
    "ROM dalam batas normal",
    "Spasme otot paravertebral",
    "Lasègue (+) 60°",
    "Tes Patrick (+)",
    "Edema sendi lutut",
    "MMT 4/5",
    "Tonus otot meningkat",
  ],
  assessment: [
    "Kondisi membaik",
    "Perbaikan ROM signifikan",
    "Nyeri berkurang 50%",
    "Kondisi stabil",
    "Perlu evaluasi lanjut",
    "Target tercapai",
    "Perlu rujukan",
  ],
  plan: [
    "TENS 15 menit",
    "Ultrasound 5 menit",
    "IR 10 menit",
    "Latihan ROM aktif",
    "Core stability exercise",
    "Stretching hamstring",
    "Home program: bridging 3x10",
    "Kompres hangat mandiri",
  ],
};

const categoryLabels: Record<ChipCategory, { label: string; color: string; bg: string }> = {
  subjective: { label: "Subjective (S)", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  objective: { label: "Objective (O)", color: "text-violet-700", bg: "bg-violet-50 border-violet-200" },
  assessment: { label: "Assessment (A)", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  plan: { label: "Plan (P)", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
};

export default function SoapTemplatesPage() {
  const router = useRouter();
  const [chips, setChips] = useState<Record<ChipCategory, string[]>>(defaultChips);
  const [newChip, setNewChip] = useState<Record<ChipCategory, string>>({
    subjective: "", objective: "", assessment: "", plan: "",
  });
  const [saved, setSaved] = useState(false);

  function addChip(cat: ChipCategory) {
    const val = newChip[cat].trim();
    if (!val || chips[cat].includes(val)) return;
    setChips((prev) => ({ ...prev, [cat]: [...prev[cat], val] }));
    setNewChip((prev) => ({ ...prev, [cat]: "" }));
  }

  function removeChip(cat: ChipCategory, idx: number) {
    setChips((prev) => ({ ...prev, [cat]: prev[cat].filter((_, i) => i !== idx) }));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </button>
        <div>
          <h1 className="font-bold text-slate-900 text-base">Template Teks SOAP</h1>
          <p className="text-xs text-slate-400">Kelola chip teks cepat saat input sesi</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-700">
          Chip ini akan muncul sebagai pilihan cepat saat mengisi catatan SOAP pada setiap sesi pasien. Tap chip untuk langsung menambahkan teks.
        </p>
      </div>

      {(Object.keys(categoryLabels) as ChipCategory[]).map((cat) => {
        const meta = categoryLabels[cat];
        return (
          <Card key={cat} className="p-4 space-y-3 border-slate-200">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${meta.color}`}>
              {meta.label}
            </p>

            {/* Chip list */}
            <div className="flex flex-wrap gap-1.5">
              {chips[cat].map((chip, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium ${meta.bg} ${meta.color}`}
                >
                  {chip}
                  <button
                    onClick={() => removeChip(cat, idx)}
                    className="ml-0.5 opacity-60 hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {chips[cat].length === 0 && (
                <p className="text-xs text-slate-400 italic">Belum ada chip. Tambahkan di bawah.</p>
              )}
            </div>

            {/* Add new chip */}
            <div className="flex gap-2">
              <input
                value={newChip[cat]}
                onChange={(e) => setNewChip((prev) => ({ ...prev, [cat]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addChip(cat))}
                placeholder="Tambah chip baru..."
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              />
              <button
                onClick={() => addChip(cat)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1 ${meta.bg} ${meta.color} border-current hover:opacity-80 transition`}
              >
                <Plus className="w-3.5 h-3.5" /> Tambah
              </button>
            </div>
          </Card>
        );
      })}

      <Button
        onClick={handleSave}
        className="w-full h-11 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
      >
        {saved ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Template Tersimpan!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Simpan Template
          </>
        )}
      </Button>
    </div>
  );
}
