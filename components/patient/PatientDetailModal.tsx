"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  History,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  X,
  User,
  Pencil,
  Save,
  Check,
  Loader2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Patient } from "@/lib/types";
import { getPatientHistory, updatePatient } from "@/app/actions/patients";
import { getInitials } from "@/lib/utils";

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onPatientUpdated?: (updatedPatient: Patient) => void;
}

export function PatientDetailModal({
  isOpen,
  onClose,
  patient,
  onPatientUpdated,
}: PatientDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "history">("info");
  const [historyList, setHistoryList] = useState<
    Array<{ date: string; S: string; O: string; A: string; P: string }>
  >([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(patient);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    age: 50,
    initial_diagnosis: "",
    date_of_birth: "",
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync when patient prop changes or modal opens
  useEffect(() => {
    if (patient) {
      setCurrentPatient(patient);
      setIsEditing(false);
      setSaveSuccess(false);
      setEditForm({
        name: patient.name || "",
        phone: patient.phone || "",
        address: patient.address || "",
        gender: patient.gender || "Laki-laki",
        age: patient.age || 45,
        initial_diagnosis: patient.initial_diagnosis || "",
        date_of_birth: patient.date_of_birth || "",
      });

      setIsLoadingHistory(true);
      getPatientHistory(patient.id)
        .then((data) => setHistoryList(data))
        .catch(() => setHistoryList([]))
        .finally(() => setIsLoadingHistory(false));
    }
  }, [patient, isOpen]);

  if (!currentPatient) return null;

  const waUrl = `https://wa.me/${(currentPatient.phone || "").replace(/[^0-9]/g, "")}`;
  const telUrl = `tel:${currentPatient.phone}`;

  const handleStartEdit = () => {
    setEditForm({
      name: currentPatient.name || "",
      phone: currentPatient.phone || "",
      address: currentPatient.address || "",
      gender: currentPatient.gender || "Laki-laki",
      age: currentPatient.age || 45,
      initial_diagnosis: currentPatient.initial_diagnosis || "",
      date_of_birth: currentPatient.date_of_birth || "",
    });
    setIsEditing(true);
    setActiveTab("info");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.initial_diagnosis.trim()) {
      alert("Nama pasien dan diagnosa awal wajib diisi.");
      return;
    }

    try {
      setIsSaving(true);
      const res = await updatePatient(currentPatient.id, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim() || currentPatient.phone,
        address: editForm.address.trim() || currentPatient.address,
        gender: editForm.gender,
        age: Number(editForm.age) || currentPatient.age || 45,
        initial_diagnosis: editForm.initial_diagnosis.trim(),
        date_of_birth: editForm.date_of_birth || undefined,
      });

      if (res.success && res.patient) {
        setCurrentPatient(res.patient);
        if (onPatientUpdated) {
          onPatientUpdated(res.patient);
        }
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update patient:", err);
      alert("Terjadi kesalahan saat menyimpan data pasien.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="p-0 h-[92vh] max-h-[92vh] flex flex-col">
        {/* Header */}
        <SheetHeader className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 font-bold text-sm flex items-center justify-center border border-brand-200 shadow-xs">
                {getInitials(currentPatient.name)}
              </div>
              <div>
                <SheetTitle className="text-base font-bold text-slate-900 leading-snug">
                  {isEditing ? "Ubah Data Pasien" : currentPatient.name}
                </SheetTitle>
                <p className="text-xs text-slate-500 font-medium">
                  {isEditing
                    ? "Perbarui informasi rekam medis pasien"
                    : `${currentPatient.gender || "Pasien"}, ${
                        currentPatient.age ? `${currentPatient.age} Tahun` : ""
                      }`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 transition active:scale-95"
                  title="Ubah data pasien"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ubah</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* Tab Header (Only shown when not editing) */}
        {!isEditing && (
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
        )}

        {/* Success Banner */}
        {saveSuccess && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Data pasien berhasil diperbarui!</span>
          </div>
        )}

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="space-y-3.5 animate-in fade-in-50 duration-200 pb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Pasien: *
                </label>
                <Input
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Contoh: Bpk. Suryanto"
                  className="bg-white text-xs h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Usia (Tahun):
                  </label>
                  <Input
                    type="number"
                    value={editForm.age}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, age: Number(e.target.value) || 0 }))
                    }
                    className="bg-white text-xs h-10 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin:
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        gender: e.target.value as "Laki-laki" | "Perempuan",
                      }))
                    }
                    className="flex h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP: *
                </label>
                <Input
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="081234567890"
                  className="bg-white text-xs h-10 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Diagnosa Awal Fisioterapi: *
                </label>
                <Input
                  required
                  value={editForm.initial_diagnosis}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, initial_diagnosis: e.target.value }))
                  }
                  placeholder="Contoh: LBP ec HNP L4-L5, Post-Stroke Hemiparese"
                  className="bg-white text-xs h-10 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Lengkap Homecare:
                </label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Jl. Kebayoran Baru No. 10..."
                  rows={3}
                  className="w-full text-xs border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Lahir (Opsional):
                </label>
                <Input
                  type="date"
                  value={editForm.date_of_birth}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, date_of_birth: e.target.value }))
                  }
                  className="bg-white text-xs h-10 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex-1 h-11 text-xs font-semibold rounded-xl border-slate-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 h-11 text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center gap-2 shadow-md shadow-brand-600/20"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <>
              {activeTab === "info" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  {/* Diagnosa Awal / Baseline */}
                  <div className="bg-brand-50/80 border border-brand-200 rounded-2xl p-4 text-xs text-brand-900 space-y-1.5 shadow-xs">
                    <div className="font-bold flex items-center justify-between text-brand-800">
                      <div className="flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-brand-700" />
                        <span>Diagnosa Awal (Baseline Fisioterapi)</span>
                      </div>
                      <button
                        onClick={handleStartEdit}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">
                      {currentPatient.initial_diagnosis}
                    </p>
                    <p className="text-[11px] text-brand-700 font-medium">
                      Rencana Target: Pemulihan fungsional mandiri & pengurangan skala nyeri.
                    </p>
                  </div>

                  {/* Data Pasien Details */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 text-xs shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 text-xs">
                        Detail Kontak & Domisili
                      </h4>
                      <button
                        onClick={handleStartEdit}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                      >
                        <Pencil className="w-3 h-3" /> Edit Data
                      </button>
                    </div>

                    <div className="flex items-start gap-2.5 text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-700">Alamat Kunjungan:</p>
                        <p className="text-slate-600 mt-0.5">{currentPatient.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-600 pt-1">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-700">Nomor Telepon / WhatsApp:</p>
                        <p className="text-slate-800 font-bold mt-0.5">{currentPatient.phone}</p>
                      </div>
                    </div>

                    {currentPatient.date_of_birth && (
                      <div className="flex items-center gap-2.5 text-slate-600 pt-1">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-700">Tanggal Lahir:</p>
                          <p className="text-slate-600 mt-0.5">{currentPatient.date_of_birth}</p>
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

                  {/* Edit Patient Full Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-200 transition active:scale-98"
                    >
                      <Pencil className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ubah Informasi Data Pasien</span>
                    </button>
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
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
