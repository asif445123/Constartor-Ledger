"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeId = "classic" | "emerald" | "ocean" | "royal" | "rustic";

export interface ThemeDef {
  id: ThemeId;
  swatch: [string, string, string]; // bg, accent, paper — used to render the preview circle
}

export const THEMES: ThemeDef[] = [
  { id: "classic", swatch: ["#0b1220", "#e2a33d", "#faf7ef"] },
  { id: "emerald", swatch: ["#07211a", "#2f9e6e", "#f6faf5"] },
  { id: "ocean", swatch: ["#071b2e", "#2f7fb0", "#f5f9fc"] },
  { id: "royal", swatch: ["#180b2e", "#8b4fc4", "#f9f6fc"] },
  { id: "rustic", swatch: ["#241209", "#c1633b", "#fbf6ef"] },
];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>("classic");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("theme") as ThemeId | null) : null;
    if (saved && THEMES.some((t) => t.id === saved)) {
      setThemeState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const setTheme = (t: ThemeId) => {
    setThemeState(t);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", t);
      document.documentElement.setAttribute("data-theme", t);
    }
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
