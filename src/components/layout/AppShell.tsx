"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import Sidebar from "./Sidebar";

const PUBLIC_ROUTES = ["/login", "/reset-password"];
// /admin is never auto-redirected to /login. When unauthenticated it renders
// its own password-only gate (see app/admin/page.tsx); once authenticated it
// gets the normal sidebar chrome like any other protected route.
const SELF_GATED_ROUTES = ["/admin"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { loggedIn, checking } = useAuth();
  const { isDemo } = useData();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isSelfGated = SELF_GATED_ROUTES.includes(pathname);
  const isAuthed = loggedIn || isDemo;

  useEffect(() => {
    if (checking) return;
    if (!isAuthed && !isPublicRoute && !isSelfGated) {
      router.replace("/login");
    }
    if (isAuthed && isPublicRoute) {
      router.replace("/");
    }
  }, [checking, isAuthed, isPublicRoute, isSelfGated, router]);

  // /login and /reset-password render full-bleed with no sidebar chrome
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // /admin while unauthenticated: render full-bleed too, so the page itself
  // can show its password-only gate instead of the normal sidebar layout.
  if (isSelfGated && !isAuthed) {
    if (checking) {
      return (
        <div className="min-h-screen bg-[var(--color-bg)] blueprint-grid flex items-center justify-center">
          <p className="text-white/70 font-display text-lg">{t.common.loading}</p>
        </div>
      );
    }
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
