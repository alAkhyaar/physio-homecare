"use client";

import React, { useState, useEffect } from "react";
import { Receipt, MessageCircle, X, Sparkles, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { Session } from "@/lib/types";

interface InvoiceSheetProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
  onConfirmAndSend: (
    billAmount: number,
    transportAmount: number,
    waUrl: string
  ) => void;
}

export function InvoiceSheet({
  isOpen,
  onClose,
  session,
  onConfirmAndSend,
}: InvoiceSheetProps) {
  const [billAmount, setBillAmount] = useState<number>(150000);
  const [transportAmount, setTransportAmount] = useState<number>(50000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      setBillAmount(session.bill_amount || 150000);
      setTransportAmount(session.transport_amount || 50000);
    }
  }, [session]);

  const total = billAmount + transportAmount;
  const patientName = session?.patient?.name || "Pasien";
  const patientPhone = session?.patient?.phone || "6281234567890";

  const getWaFormattedText = () => {
    const dateStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return (
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
      `_Ftr. Sarah Amalia, S.Ft_`
    );
  };

  const handleSend = () => {
    setIsSubmitting(true);
    const cleanPhone = patientPhone.replace(/[^0-9]/g, "");
    const normalizedPhone = cleanPhone.startsWith("0")
      ? "62" + cleanPhone.slice(1)
      : cleanPhone;

    const message = getWaFormattedText();
    const waUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
      message
    )}`;

    onConfirmAndSend(billAmount, transportAmount, waUrl);
    setIsSubmitting(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="p-0 max-h-[90vh]">
        {/* Header */}
        <SheetHeader className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Receipt className="w-4 h-4 text-emerald-700" />
              </div>
              <div>
                <SheetTitle className="text-sm font-bold text-slate-900 leading-tight">
                  Bukti Tagihan / Invoice
                </SheetTitle>
                <p className="text-[11px] text-slate-500 font-medium">
                  {patientName} ({session?.patient?.phone || ""})
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

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[65vh]">
          {/* Biaya Inputs */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Biaya Tindakan Fisioterapi (Rp):
              </label>
              <Input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(Number(e.target.value) || 0)}
                className="font-bold text-slate-900 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Biaya Transportasi / Visit (Rp):
              </label>
              <Input
                type="number"
                value={transportAmount}
                onChange={(e) => setTransportAmount(Number(e.target.value) || 0)}
                className="font-bold text-slate-900 text-sm bg-white"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-800">Total Tagihan:</span>
              <span className="text-base font-extrabold text-brand-700">
                {formatRupiah(total)}
              </span>
            </div>
          </div>

          {/* WhatsApp Message Preview */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Preview Pesan WhatsApp:</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Format Otomatis
              </span>
            </div>
            <div className="bg-emerald-50/60 border border-emerald-200/80 p-3.5 rounded-2xl text-[11px] text-slate-800 font-mono whitespace-pre-line leading-relaxed shadow-inner">
              {getWaFormattedText()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0 flex gap-2">
          <Button
            type="button"
            onClick={handleSend}
            disabled={isSubmitting}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-[0.99] transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Simpan Sesi & Kirim WA</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
