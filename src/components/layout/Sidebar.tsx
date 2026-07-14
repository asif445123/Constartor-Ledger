"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { isDemo, exitDemoMode } = useData();
  const { t, locale, setLocale } = useLanguage();

  const NAV = [
    { href: "/", label: t.sidebar.dashboard, icon: "📊" },
    { href: "/malik", label: t.sidebar.owners, icon: "🤝" },
    { href: "/mazdoor", label: t.sidebar.labor, icon: "👷" },
    { href: "/kharcha", label: t.sidebar.kharcha, icon: "🧾" },
    { href: "/site", label: t.sidebar.sites, icon: "🏗️" },
  ];

  const nav = user?.role === "admin" ? [...NAV, { href: "/admin", label: t.sidebar.admin, icon: "🛡️" }] : NAV;

  const handleLogout = async () => {
    if (isDemo) {
      exitDemoMode();
    } else {
      await logout();
    }
    router.push("/login");
  };

  return (
    <aside className="md:w-60 shrink-0 bg-[var(--color-bg)] blueprint-grid text-white flex md:flex-col md:min-h-screen">
      <div className="px-5 py-5 hidden md:block border-b border-white/10">
        <p className="font-ledger text-[10px] tracking-widest text-[var(--color-accent)]">
          {t.sidebar.siteLedgerLabel}
        </p>
        <h1 className="font-display text-2xl">{t.common.siteTitle}</h1>
      </div>

      {isDemo && (
        <div className="px-5 py-2 bg-[var(--color-accent)]/20 text-[var(--color-accent)] text-xs text-center">
          {t.sidebar.demoModeBanner}
        </div>
      )}

      <nav className="flex md:flex-col flex-1 overflow-x-auto md:overflow-visible">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 transition ${
                active
                  ? "md:border-[var(--color-accent)] bg-white/10 text-[var(--color-accent)] font-semibold"
                  : "md:border-transparent text-white/75 hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block px-5 py-4 border-t border-white/10">
        {user && !isDemo && (
          <p className="text-white/50 text-xs mb-2 truncate">{t.sidebar.welcomeUser}, {user.name} <br /> · {user.email}</p>
        )}
        {isDemo && (
          <p className="text-white/50 text-xs mb-2">{t.sidebar.demoUser}</p>
        )}
        <button
          onClick={() => setLocale(locale === "ur" ? "en" : "ur")}
          className="text-white/60 hover:text-[var(--color-accent)] text-xs mb-2 block"
        >
          🌐 {locale === "ur" ? "English" : "اردو"}
        </button>
        <button
          onClick={handleLogout}
          className="text-white/60 hover:text-[var(--color-rust)] text-sm"
        >
          🚪 {t.sidebar.logout}
        </button>
      </div>
    </aside>
  );
}
