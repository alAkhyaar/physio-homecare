"use client";

import React, { useEffect, useState } from "react";
import { Activity, Bell } from "lucide-react";

export function AppHeader() {
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    setDateStr(formatted);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shrink-0">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-sm shadow-brand-500/30">
          <Activity className="w-5 h-5 text-white stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 leading-tight">Physiotherapy Management</h1>
          <p className="text-[11px] text-slate-500 font-medium">{dateStr || "Homecare Tele-Rekam Medis"}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          aria-label="Notifikasi"
          onClick={() => alert("Tidak ada notifikasi baru saat ini.")}
          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 active:scale-95 transition"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
