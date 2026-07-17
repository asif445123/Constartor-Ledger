"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useLanguage } from "@/context/LanguageContext";
import SettingsModal from "@/components/settings/SettingsModal";
import ThemeModal from "@/components/theme/ThemeModal";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const { isDemo, exitDemoMode } = useData();
  const { t, locale, setLocale } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const NAV = [
    { href: "/", label: t.sidebar.dashboard, icon: "📊" },
    { href: "/malik", label: t.sidebar.owners, icon: "🤝" },
    { href: "/mazdoor", label: t.sidebar.labor, icon: "👷" },
    { href: "/kharcha", label: t.sidebar.kharcha, icon: "🧾" },
    { href: "/site", label: t.sidebar.sites, icon: "🏗️" },
  ];

  const adminItem = user?.role === "admin" ? { href: "/admin", label: t.sidebar.admin, icon: "🛡️" } : null;

  const handleLogout = async () => {
    if (isDemo) {
      exitDemoMode();
    } else {
      await logout();
    }
    router.push("/login");
  };

  return (
    <aside className="md:w-60 shrink-0 bg-[var(--color-bg)] blueprint-grid text-white flex flex-col md:min-h-screen">
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
        {NAV.map((item) => {
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

        <button
          onClick={() => setThemeOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 md:border-transparent text-white/75 hover:bg-white/5 transition"
        >
          <span>🎨</span>
          <span>{t.theme.sidebarButton}</span>
        </button>

        {adminItem && (
          <Link
            href={adminItem.href}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 transition ${
              pathname === adminItem.href
                ? "md:border-[var(--color-accent)] bg-white/10 text-[var(--color-accent)] font-semibold"
                : "md:border-transparent text-white/75 hover:bg-white/5"
            }`}
          >
            <span>{adminItem.icon}</span>
            <span>{adminItem.label}</span>
          </Link>
        )}
      </nav>

      <div className="px-4 py-3 md:px-5 md:py-4 border-t border-white/10">
        {user && !isDemo && (
          <p className="text-white/50 text-xs mb-2 truncate">{t.sidebar.welcomeUser}, {user.name} <br className="hidden md:block" /> · {user.email}</p>
        )}
        {isDemo && (
          <p className="text-white/50 text-xs mb-2">{t.sidebar.demoUser}</p>
        )}
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-2">
          <button
            onClick={() => setLocale(locale === "ur" ? "en" : "ur")}
            className="text-white/60 hover:text-[var(--color-accent)] text-xs"
          >
            🌐 {locale === "ur" ? "English" : "اردو"}
          </button>
          {!isDemo && (
            <button
              onClick={() => setSettingsOpen(true)}
              className="text-white/60 hover:text-[var(--color-accent)] text-xs"
            >
              ⚙️ {t.settings.sidebarButton}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-[var(--color-rust)] text-sm"
          >
            🚪 {t.sidebar.logout}
          </button>
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ThemeModal open={themeOpen} onClose={() => setThemeOpen(false)} />
    </aside>
  );
}
