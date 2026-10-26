import React from "react";
import { getSessionsForToday } from "@/app/actions/sessions";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Harian - FisioCare Mobile",
  description: "Daftar jadwal visit pasien fisioterapi homecare hari ini",
};

export default async function DashboardPage() {
  const sessions = await getSessionsForToday();

  return <DashboardClient initialSessions={sessions} />;
}
