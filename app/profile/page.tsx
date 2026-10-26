import React from "react";
import {
  User,
  Sliders,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Database,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Profil Terapis - FisioCare Mobile",
  description: "Profil dan pengaturan terapis homecare",
};

export default function ProfilePage() {
  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Profile Card */}
      <Card className="p-5 text-center shadow-xs border-slate-200">
        <div className="relative inline-block mx-auto mb-3">
          <div className="w-20 h-20 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-2xl border-2 border-brand-300 shadow-inner">
            SA
          </div>
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          </span>
        </div>

        <h3 className="font-bold text-slate-900 text-base leading-tight">
          Ftr. Sarah Amalia, S.Ft
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-1">
          STR: 19882023091122 (Aktif s/d 2029)
        </p>

        <div className="mt-2.5 flex justify-center gap-1.5">
          <Badge variant="selesai" statusDot>
            Fisioterapis Homecare Aktif
          </Badge>
        </div>
      </Card>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Card className="p-3 bg-white border-slate-200">
          <p className="text-slate-400 text-[10px] font-semibold uppercase">
            Total Sesi Bulan Ini
          </p>
          <p className="text-lg font-bold text-slate-900 mt-0.5">38 Sesi</p>
          <span className="text-[10px] text-emerald-600 font-medium">
            &uarr; 14% dari bln lalu
          </span>
        </Card>
        <Card className="p-3 bg-white border-slate-200">
          <p className="text-slate-400 text-[10px] font-semibold uppercase">
            Rating Kepuasan
          </p>
          <p className="text-lg font-bold text-amber-500 mt-0.5">&#9733; 4.95 / 5.0</p>
          <span className="text-[10px] text-slate-400 font-medium">
            24 Ulasan Pasien
          </span>
        </Card>
      </div>

      {/* Menu Options */}
      <Card className="divide-y divide-slate-100 shadow-xs border-slate-200 overflow-hidden text-xs font-semibold text-slate-700">
        <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400" />
            <span>Edit Data Diri & STR</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-slate-400" />
            <span>Atur Template Teks SOAP (Chips)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-4 h-4 text-slate-400" />
            <span>Rekap Pendapatan & Export Invoice</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-brand-600" />
            <div className="text-left">
              <span className="block text-slate-800">Sinkronisasi Database Supabase</span>
              <span className="text-[10px] text-slate-400 font-normal">
                PostgreSQL Cloud Active
              </span>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-200 bg-emerald-50">
            Terhubung
          </Badge>
        </div>
      </Card>

      {/* App Version Info */}
      <div className="text-center text-[11px] text-slate-400 pt-2 space-y-1">
        <p className="font-semibold text-slate-500">FisioCare Mobile v1.0.0 (MVP)</p>
        <p>Dirancang khusus untuk pengoperasian cepat satu tangan.</p>
      </div>
    </div>
  );
}
