"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "./Sidebar";

const PUBLIC_ROUTES = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loggedIn, checking } = useAuth();
  const { isDemo } = useData();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthed = loggedIn || isDemo;

  useEffect(() => {
    if (checking) return;
    if (!isAuthed && !isPublicRoute) {
      router.replace("/login");
    }
    if (isAuthed && isPublicRoute) {
      router.replace("/");
    }
  }, [checking, isAuthed, isPublicRoute, router]);

  // /login renders full-bleed with no sidebar chrome
  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (checking || !isAuthed) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] blueprint-grid flex items-center justify-center">
        <p className="text-white/70 font-display text-lg">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[var(--color-paper)] px-4 py-6 md:px-8 md:py-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
