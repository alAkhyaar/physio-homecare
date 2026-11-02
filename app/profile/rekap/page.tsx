"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Wallet,
  CheckCircle2,
  Clock,
  Send,
  FileText,
  Search,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllSessions } from "@/app/actions/sessions";
import { Session } from "@/lib/types";

export default function RekapPendapatanPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState<"bulan_ini" | "semua">("bulan_ini");
  const [filterPayment, setFilterPayment] = useState<"semua" | "LUNAS" | "BELUM LUNAS">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Session | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getAllSessions();
        setSessions(data || []);
      } catch (err) {
        console.error("Failed to load sessions for report:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter sessions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const filteredSessions = sessions.filter((session) => {
    // Payment status filter
    if (filterPayment !== "semua" && session.payment_status !== filterPayment) {
      return false;
    }

    // Period filter
    if (filterPeriod === "bulan_ini" && session.scheduled_date) {
      const sDate = new Date(session.scheduled_date);
      if (!isNaN(sDate.getTime())) {
        if (sDate.getMonth() !== currentMonth || sDate.getFullYear() !== currentYear) {
          return false;
        }
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const patientName = session.patient?.name?.toLowerCase() || "";
      const diag = session.patient?.initial_diagnosis?.toLowerCase() || "";
      return patientName.includes(q) || diag.includes(q);
    }

    return true;
  });

  // Calculate stats
  const totalTindakan = filteredSessions.reduce((acc, s) => acc + (s.bill_amount || 0), 0);
  const totalTransport = filteredSessions.reduce((acc, s) => acc + (s.transport_amount || 0), 0);
  const totalPendapatan = totalTindakan + totalTransport;

  const totalLunas = filteredSessions
    .filter((s) => s.payment_status === "LUNAS")
    .reduce((acc, s) => acc + (s.bill_amount || 0) + (s.transport_amount || 0), 0);

  const totalBelumLunas = filteredSessions
    .filter((s) => s.payment_status === "BELUM LUNAS")
    .reduce((acc, s) => acc + (s.bill_amount || 0) + (s.transport_amount || 0), 0);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["ID Sesi", "Tanggal", "Pasien", "Diagnosa", "Biaya Tindakan", "Biaya Transport", "Total", "Status Pembayaran"];
    const rows = filteredSessions.map((s) => [
      s.id,
      s.scheduled_date || "-",
      `"${s.patient?.name || "-"}"`,
      `"${s.patient?.initial_diagnosis || "-"}"`,
      s.bill_amount || 0,
      s.transport_amount || 0,
      (s.bill_amount || 0) + (s.transport_amount || 0),
      s.payment_status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_Pendapatan_${filterPeriod}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate WhatsApp invoice
  const openWhatsAppInvoice = (session: Session) => {
    const total = (session.bill_amount || 0) + (session.transport_amount || 0);
    const dateStr = formatDate(session.scheduled_date);
    const patientName = session.patient?.name || "Pasien";
    const patientPhone = session.patient?.phone || "";

    const message =
      `*BUKTI PEMBAYARAN FISIOTERAPI HOMECARE*\n` +
      `----------------------------------------\n` +
      `Tanggal: ${dateStr}\n` +
      `Pasien: ${patientName}\n\n` +
      `Rincian Tagihan:\n` +
      `- Tindakan Fisioterapi: ${formatRupiah(session.bill_amount || 0)}\n` +
      `- Biaya Visit / Transport: ${formatRupiah(session.transport_amount || 0)}\n` +
      `*TOTAL: ${formatRupiah(total)}*\n\n` +
      `Status: *${session.payment_status}*\n\n` +
      `Terima kasih atas kepercayaannya. Semoga lekas pulih!\n` +
      `_Ftr. Amirah Zahidah_`;

    const cleanPhone = patientPhone.replace(/[^0-9]/g, "");
    const normalizedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone;
    window.open(`https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
          <div>
            <h1 className="font-bold text-slate-900 text-base">Rekap Pendapatan</h1>
            <p className="text-xs text-slate-400">Ringkasan keuangan & export invoice</p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-8 px-2.5 text-xs rounded-xl flex items-center gap-1 text-slate-600 border-slate-200"
          >
            <Download className="w-3.5 h-3.5 text-brand-600" />
            <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="h-8 px-2.5 text-xs rounded-xl flex items-center gap-1 text-slate-600 border-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak</span>
          </Button>
        </div>
      </div>

      {/* Filter Periode Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setFilterPeriod("bulan_ini")}
          className={`flex-1 py-1.5 rounded-lg transition ${
            filterPeriod === "bulan_ini"
              ? "bg-white text-brand-700 shadow-xs font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Bulan Ini
        </button>
        <button
          onClick={() => setFilterPeriod("semua")}
          className={`flex-1 py-1.5 rounded-lg transition ${
            filterPeriod === "semua"
              ? "bg-white text-brand-700 shadow-xs font-bold"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Semua Periode
        </button>
      </div>

      {/* Total Revenue Highlight Card */}
      <Card className="p-4 bg-gradient-to-br from-brand-700 via-brand-800 to-slate-900 text-white rounded-2xl shadow-sm border-0">
        <div className="flex items-center justify-between text-brand-200 text-xs">
          <span className="flex items-center gap-1.5">
            <Wallet className="w-4 h-4" />
            Total Pendapatan Terhitung
          </span>
          <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-full font-medium">
            {filteredSessions.length} Sesi
          </span>
        </div>

        <div className="mt-2 text-2xl font-black tracking-tight">
          {formatRupiah(totalPendapatan)}
        </div>

        {/* Breakdown Row */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-white/60 text-[10px] font-medium uppercase">Sudah Lunas</p>
            <p className="font-bold text-emerald-400 text-sm mt-0.5">{formatRupiah(totalLunas)}</p>
          </div>
          <div>
            <p className="text-white/60 text-[10px] font-medium uppercase">Belum Lunas</p>
            <p className="font-bold text-amber-300 text-sm mt-0.5">{formatRupiah(totalBelumLunas)}</p>
          </div>
        </div>
      </Card>

      {/* Detail Breakdown Cards */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Card className="p-3 bg-white border-slate-200">
          <span className="text-slate-400 text-[10px] font-semibold uppercase block">
            Jasa Tindakan
          </span>
          <p className="text-sm font-bold text-slate-800 mt-1">{formatRupiah(totalTindakan)}</p>
          <span className="text-[10px] text-slate-400">Modalitas & Manual</span>
        </Card>
        <Card className="p-3 bg-white border-slate-200">
          <span className="text-slate-400 text-[10px] font-semibold uppercase block">
            Biaya Transport
          </span>
          <p className="text-sm font-bold text-slate-800 mt-1">{formatRupiah(totalTransport)}</p>
          <span className="text-[10px] text-slate-400">Visit / Operasional</span>
        </Card>
      </div>

      {/* Filter Payment & Search */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pasien atau diagnosa..."
            className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {(["semua", "LUNAS", "BELUM LUNAS"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterPayment(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterPayment === status
                  ? "bg-brand-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status === "semua" ? "Semua Status" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-0.5">
          <span>Daftar Transaksi ({filteredSessions.length})</span>
        </div>

        {loading ? (
          <Card className="p-8 text-center text-xs text-slate-400 border-slate-200">
            Memuat rekap pendapatan...
          </Card>
        ) : filteredSessions.length === 0 ? (
          <Card className="p-8 text-center text-xs text-slate-400 border-slate-200">
            Tidak ada transaksi pada filter ini.
          </Card>
        ) : (
          filteredSessions.map((session) => {
            const total = (session.bill_amount || 0) + (session.transport_amount || 0);
            const isLunas = session.payment_status === "LUNAS";

            return (
              <Card
                key={session.id}
                className="p-3.5 bg-white border-slate-200 hover:border-brand-200 transition space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {session.patient?.name || "Pasien Homecare"}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(session.scheduled_date)} • {session.time || "Sesi Homecare"}
                    </p>
                  </div>
                  <Badge
                    variant={isLunas ? "selesai" : "belumLunas"}
                    className="text-[10px] font-bold"
                  >
                    {isLunas ? "LUNAS" : "BELUM LUNAS"}
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Tindakan Terapi</span>
                    <span>{formatRupiah(session.bill_amount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-[11px]">
                    <span>Transportasi / Visit</span>
                    <span>{formatRupiah(session.transport_amount || 0)}</span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 flex justify-between font-bold text-slate-800 text-xs">
                    <span>Total Tagihan</span>
                    <span className="text-brand-700">{formatRupiah(total)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openWhatsAppInvoice(session)}
                    className="flex-1 h-8 text-xs font-semibold rounded-xl text-emerald-700 bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100 flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Invoice WA
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedInvoice(session)}
                    className="h-8 px-2.5 text-xs text-slate-500 hover:text-slate-800 rounded-xl"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Invoice Detail Modal / Sheet */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-t-3xl sm:rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-1 pb-3 border-b border-slate-100">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600">
                Invoice Resmi
              </span>
              <h2 className="text-lg font-bold text-slate-900">FisioCare Homecare</h2>
              <p className="text-xs text-slate-400">
                {formatDate(selectedInvoice.scheduled_date)} • ID #{selectedInvoice.id}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Nama Pasien:</span>
                <span className="font-semibold text-slate-800">
                  {selectedInvoice.patient?.name || "-"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Diagnosa:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {selectedInvoice.patient?.initial_diagnosis || "-"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Terapis:</span>
                <span className="font-semibold text-slate-800">Ftr. Amirah Zahidah</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Jasa Tindakan:</span>
                <span className="font-medium text-slate-800">
                  {formatRupiah(selectedInvoice.bill_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Biaya Transport:</span>
                <span className="font-medium text-slate-800">
                  {formatRupiah(selectedInvoice.transport_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-slate-900 border-t border-slate-200">
                <span>TOTAL:</span>
                <span className="text-brand-700">
                  {formatRupiah(
                    (selectedInvoice.bill_amount || 0) + (selectedInvoice.transport_amount || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1 text-xs">
                <span className="text-slate-400">Status Pembayaran:</span>
                <Badge
                  variant={selectedInvoice.payment_status === "LUNAS" ? "selesai" : "belumLunas"}
                >
                  {selectedInvoice.payment_status}
                </Badge>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                onClick={() => openWhatsAppInvoice(selectedInvoice)}
                className="w-full h-10 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Kirim via WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedInvoice(null)}
                className="w-full h-10 text-xs font-semibold rounded-xl border-slate-200 text-slate-600"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
