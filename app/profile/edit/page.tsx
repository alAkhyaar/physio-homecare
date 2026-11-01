"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  CalendarDays,
  Save,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditProfilePage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Sarah Amalia",
    title: "S.Ft",
    phone: "081234567890",
    address: "Jl. Kenanga No. 12, Bandung",
    strNumber: "19882023091122",
    strExpiry: "2029-12-31",
    specialization: "Fisioterapi Muskuloskeletal & Geriatri",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
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
          <h1 className="font-bold text-slate-900 text-base">Edit Data Diri & STR</h1>
          <p className="text-xs text-slate-400">Perbarui informasi profil terapis</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-3">
        {/* Identitas */}
        <Card className="p-4 space-y-3 border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identitas</p>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Nama Terapis
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Gelar / Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> No. Telepon
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Alamat
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={2}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Spesialisasi</label>
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
          </div>
        </Card>

        {/* STR */}
        <Card className="p-4 space-y-3 border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Data STR
          </p>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Nomor STR</label>
            <input
              name="strNumber"
              value={form.strNumber}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" /> Berlaku s/d
            </label>
            <input
              name="strExpiry"
              type="date"
              value={form.strExpiry}
              onChange={handleChange}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
            />
          </div>

          {/* STR Status Badge */}
          <div className="flex items-center gap-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-700">STR Aktif</p>
              <p className="text-[10px] text-emerald-600">
                Masa berlaku:{" "}
                {new Date(form.strExpiry).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Tersimpan!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
