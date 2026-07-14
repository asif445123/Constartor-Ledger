"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ur } from "@/lib/i18n/ur";
import { en } from "@/lib/i18n/en";

export type Locale = "ur" | "en";

const dictionaries = { ur, en };

type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : { [K in keyof T]: Widen<T[K]> };

export type Dict = Widen<typeof ur>;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Dict;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ur");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("locale") as Locale | null) : null;
    if (saved === "ur" || saved === "en") {
      setLocaleState(saved);
      document.cookie = `locale=${saved}; path=/; max-age=31536000; SameSite=Lax`;
    }
    setMounted(true);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", l);
      document.cookie = `locale=${l}; path=/; max-age=31536000; SameSite=Lax`;
    }
  };

  const dir: "rtl" | "ltr" = locale === "ur" ? "rtl" : "ltr";

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale, dir, mounted]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: dictionaries[locale], dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
