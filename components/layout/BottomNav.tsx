"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Jadwal",
      href: "/",
      icon: Calendar,
      isActive: pathname === "/",
    },
    {
      name: "Pasien",
      href: "/patients",
      icon: Users,
      isActive: pathname.startsWith("/patients"),
    },
    {
      name: "Profil",
      href: "/profile",
      icon: User,
      isActive: pathname.startsWith("/profile"),
    },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 flex justify-between items-center fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all select-none min-w-[64px]",
              item.isActive
                ? "text-brand-600 font-bold"
                : "text-slate-400 font-medium hover:text-slate-600 active:scale-95"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-lg transition-colors",
                item.isActive && "bg-brand-50"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform",
                  item.isActive && "stroke-[2.5] scale-105"
                )}
              />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
