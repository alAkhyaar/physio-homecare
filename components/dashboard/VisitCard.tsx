"use client";

import React from "react";
import { Clock, MapPin, MessageCircle, Navigation, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Session } from "@/lib/types";

interface VisitCardProps {
  session: Session;
  onOpenSoap: (session: Session) => void;
}

export function VisitCard({ session, onOpenSoap }: VisitCardProps) {
  const patient = session.patient;
  const patientName = patient?.name || "Pasien";
  const patientAge = patient?.age ? `(${patient.age} th)` : "";
  const diagnosis = patient?.initial_diagnosis || "Fisioterapi Umum";
  const time = session.time || "09:00 WIB";
  const address = patient?.address || "Alamat pasien";
  const phone = patient?.phone || "";

  const badgeVariant =
    session.status === "Jadwal"
      ? "jadwal"
      : session.status === "Selesai"
      ? "selesai"
      : "belumLunas";

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
  const waDirectUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-all border-slate-200">
      {/* Card Header */}
      <div className="flex justify-between items-start mb-2 gap-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-bold text-slate-900 text-sm leading-snug">{patientName}</h4>
            {patientAge && (
              <span className="text-xs font-medium text-slate-500">{patientAge}</span>
            )}
          </div>
          <p className="text-xs text-brand-700 font-semibold mt-0.5 line-clamp-1">{diagnosis}</p>
        </div>

        {/* Status Badge */}
        <Badge variant={badgeVariant} statusDot className="shrink-0">
          {session.status}
        </Badge>
      </div>

      {/* Location & Time */}
      <div className="space-y-1.5 my-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-800">{time}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1 text-slate-600">{address}</span>
        </div>
      </div>

      {/* Quick Actions (Thumb-Friendly) */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
        {/* WhatsApp Link */}
        <a
          href={waDirectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[38px] bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700 border border-emerald-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <MessageCircle className="w-3.5 h-3.5 shrink-0" />
          <span>WA</span>
        </a>

        {/* Google Maps Link */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[38px] bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
        >
          <Navigation className="w-3.5 h-3.5 shrink-0" />
          <span>Peta</span>
        </a>

        {/* Start / View SOAP Button */}
        <Button
          onClick={() => onOpenSoap(session)}
          className="flex-[2] min-h-[38px] bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-brand-600/30 transition"
        >
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span>{session.status === "Selesai" ? "Lihat SOAP" : "Mulai Sesi"}</span>
        </Button>
      </div>
    </Card>
  );
}
