"use client";

import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

export default function Modal({ open, onClose, title, children, footer, widthClass }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[var(--color-bg)]/70 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className={`tick-corners w-full ${widthClass ?? "max-w-md"} bg-[var(--color-paper)] rounded-lg shadow-2xl border border-[var(--color-line)] max-h-[88vh] flex flex-col`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-line)]">
          <h3 className="font-display text-xl text-[var(--color-ink)]">{title}</h3>
          <button
            onClick={onClose}
            aria-label={t.common.closeAria}
            className="text-[var(--color-ink-soft)] hover:text-[var(--color-rust)] text-lg leading-none px-2 py-1"
          >
            ✕
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-[var(--color-line)] flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
