import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Physiotherapy Management - Rekam Medis & Invoice Homecare",
  description:
    "Aplikasi Rekam Medis & Invoice Fisioterapi Homecare Mobile-First yang dioptimalkan untuk pengoperasian satu tangan.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full ${inter.variable}`}>
      <body className="h-full bg-slate-100 font-sans flex flex-col items-center justify-center p-0 md:p-6 overflow-x-hidden selection:bg-brand-100 selection:text-brand-900">
        {/* Mobile Wrapper Container (Simulates Phone Screen on Desktop, Fullscreen on Mobile) */}
        <div className="w-full max-w-md h-full min-h-screen md:min-h-[844px] md:h-[844px] bg-slate-50 md:rounded-[36px] md:shadow-2xl md:border-[8px] md:border-slate-800 overflow-hidden flex flex-col relative border-box">
          <AppHeader />
          <main className="flex-1 overflow-y-auto no-scrollbar relative">
            {children}
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
