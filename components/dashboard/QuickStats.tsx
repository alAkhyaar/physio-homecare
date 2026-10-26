"use client";

import React from "react";
import { Session } from "@/lib/types";

interface QuickStatsProps {
  sessions: Session[];
}

export function QuickStats({ sessions }: QuickStatsProps) {
  const total = sessions.length;
  const scheduledCount = sessions.filter((s) => s.status === "Jadwal").length;
  const completedCount = sessions.filter((s) => s.status === "Selesai").length;
  const unpaidCount = sessions.filter((s) => s.status === "Belum Lunas").length;

  return (
    <div className="bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 rounded-2xl p-4 text-white shadow-lg shadow-brand-900/15 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div>
          <p className="text-xs font-medium text-brand-100/90">Jadwal Visit Hari Ini</p>
          <h2 className="text-2xl font-bold mt-0.5 tracking-tight">{total} Pasien</h2>
        </div>
        <span className="bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-brand-50 border border-white/10">
          Target: 100%
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brand-600/40 text-center relative z-10">
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 transition hover:bg-white/15">
          <p className="text-[10px] text-brand-200 font-medium">Akan Datang</p>
          <p className="text-base font-bold text-white mt-0.5">{scheduledCount}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 transition hover:bg-white/15">
          <p className="text-[10px] text-brand-200 font-medium">Selesai</p>
          <p className="text-base font-bold text-emerald-300 mt-0.5">{completedCount}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2 transition hover:bg-white/15">
          <p className="text-[10px] text-brand-200 font-medium">Belum Lunas</p>
          <p className="text-base font-bold text-amber-300 mt-0.5">{unpaidCount}</p>
        </div>
      </div>
    </div>
  );
}
