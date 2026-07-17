"use client";

import React from "react";
import Modal from "@/components/ui/Modal";
import { useTheme, THEMES } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

export default function ThemeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <Modal open={open} onClose={onClose} title={t.theme.title}>
      <p className="text-sm text-[var(--color-ink-soft)] mb-4">{t.theme.subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {THEMES.map((def) => {
          const [bg, accent, paper] = def.swatch;
          const active = theme === def.id;
          return (
            <button
              key={def.id}
              onClick={() => {
                setTheme(def.id);
                onClose();
              }}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                active
                  ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)]/40"
                  : "border-[var(--color-line)] hover:border-[var(--color-accent)]/50"
              }`}
            >
              <span
                className="w-10 h-10 rounded-full shrink-0 shadow-inner"
                style={{
                  background: `conic-gradient(${bg} 0deg 120deg, ${accent} 120deg 240deg, ${paper} 240deg 360deg)`,
                }}
              />
              <span className="flex-1">
                <span className="block font-semibold text-sm text-[var(--color-ink)]">
                  {t.theme.names[def.id]}
                </span>
              </span>
              {active && <span className="text-[var(--color-accent)] text-lg">✓</span>}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}
