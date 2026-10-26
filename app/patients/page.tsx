import React from "react";
import { getPatients } from "@/app/actions/patients";
import { PatientDirectoryClient } from "@/components/patient/PatientDirectoryClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Direktori Pasien - FisioCare Mobile",
  description: "Cari data pasien dan riwayat sesi rekam medis fisioterapi",
};

export default async function PatientsPage() {
  const patients = await getPatients();

  return <PatientDirectoryClient initialPatients={patients} />;
}
