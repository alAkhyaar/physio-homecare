"use client";

import React, { useState } from "react";
import { Search, UserPlus, ChevronRight, Activity, X, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PatientDetailModal } from "./PatientDetailModal";
import { Patient } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import { createPatient } from "@/app/actions/patients";

interface PatientDirectoryClientProps {
  initialPatients: Patient[];
}

export function PatientDirectoryClient({
  initialPatients,
}: PatientDirectoryClientProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  // New patient form
  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "Laki-laki" as "Laki-laki" | "Perempuan",
    age: 50,
    initial_diagnosis: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const filteredPatients = patients.filter((patient) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(q) ||
      patient.initial_diagnosis.toLowerCase().includes(q) ||
      patient.address.toLowerCase().includes(q)
    );
  });

  const handleOpenDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.initial_diagnosis) {
      alert("Nama pasien dan diagnosa awal wajib diisi.");
      return;
    }

    setIsSaving(true);
    const res = await createPatient({
      name: newPatient.name,
      phone: newPatient.phone || "6281200000000",
      address: newPatient.address || "Jakarta",
      gender: newPatient.gender,
      age: Number(newPatient.age) || 45,
      initial_diagnosis: newPatient.initial_diagnosis,
    });

    if (res.success && res.patient) {
      setPatients((prev) => [res.patient, ...prev]);
      setIsAddPatientOpen(false);
      setNewPatient({
        name: "",
        phone: "",
        address: "",
        gender: "Laki-laki",
        age: 50,
        initial_diagnosis: "",
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama pasien, keluhan, atau alamat..."
          className="pl-10 h-11 bg-white border-slate-200 text-xs shadow-xs rounded-xl"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Add Patient Button */}
      <button
        type="button"
        onClick={() => setIsAddPatientOpen(true)}
        className="w-full bg-white border-2 border-dashed border-slate-300 hover:border-brand-500 hover:text-brand-600 active:bg-brand-50/50 text-slate-600 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition shadow-xs"
      >
        <UserPlus className="w-4 h-4 text-brand-600" />
        <span>Tambah Pasien Baru</span>
      </button>

      {/* Section Title */}
      <div className="flex justify-between items-center px-1">
        <p className="text-xs font-bold text-slate-800">
          Daftar Pasien ({filteredPatients.length})
        </p>
        <span className="text-[11px] text-slate-400">Ketuk untuk riwayat</span>
      </div>

      {/* Patients List */}
      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 shadow-xs">
            Tidak ada pasien yang sesuai dengan pencarian &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              onClick={() => handleOpenDetail(patient)}
              className="p-4 cursor-pointer hover:border-brand-300 active:scale-[0.99] transition shadow-xs"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-brand-50 text-brand-700 font-bold text-sm flex items-center justify-center border border-brand-100 shrink-0">
                    {getInitials(patient.name)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">
                      {patient.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {patient.gender || "Pasien"}, {patient.age ? `${patient.age} th` : ""}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium text-[11px] line-clamp-1 max-w-[220px]">
                  {patient.initial_diagnosis}
                </span>
                <span className="text-slate-400 font-medium text-[11px]">
                  Detail Sesi &rarr;
                </span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Patient Detail Modal */}
      <PatientDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        patient={selectedPatient}
      />

      {/* Add Patient Sheet */}
      <Sheet open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
        <SheetContent side="bottom" className="p-0 max-h-[92vh]">
          <SheetHeader className="px-5 py-3.5 border-b border-slate-200 bg-slate-50">
            <div className="flex justify-between items-center w-full">
              <SheetTitle className="text-sm font-bold text-slate-900">
                Tambah Pasien Baru
              </SheetTitle>
              <button
                type="button"
                onClick={() => setIsAddPatientOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </SheetHeader>

          <form onSubmit={handleSavePatient} className="p-5 space-y-3.5 overflow-y-auto max-h-[70vh]">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Pasien: *
              </label>
              <Input
                required
                value={newPatient.name}
                onChange={(e) =>
                  setNewPatient((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Contoh: Bpk. Suryanto"
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Usia (Tahun):
                </label>
                <Input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient((p) => ({ ...p, age: Number(e.target.value) || 0 }))
                  }
                  className="bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin:
                </label>
                <select
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient((p) => ({
                      ...p,
                      gender: e.target.value as "Laki-laki" | "Perempuan",
                    }))
                  }
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-brand-500 focus:outline-none"
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nomor WhatsApp: *
              </label>
              <Input
                required
                value={newPatient.phone}
                onChange={(e) =>
                  setNewPatient((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="081234567890"
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Diagnosa Awal Fisioterapi: *
              </label>
              <Input
                required
                value={newPatient.initial_diagnosis}
                onChange={(e) =>
                  setNewPatient((p) => ({ ...p, initial_diagnosis: e.target.value }))
                }
                placeholder="Contoh: LBP ec HNP L4-L5, Stroke Iskemik"
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Lengkap Homecare:
              </label>
              <Input
                value={newPatient.address}
                onChange={(e) =>
                  setNewPatient((p) => ({ ...p, address: e.target.value }))
                }
                placeholder="Jl. Kebayoran Baru No. 10..."
                className="bg-white"
              />
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold h-12 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-600/25"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Pasien Baru</span>
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
