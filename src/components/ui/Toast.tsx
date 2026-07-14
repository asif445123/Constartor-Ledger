"use client";

import React, { createContext, useCallback, useContext } from "react";
import Swal from "sweetalert2";
import { useLanguage } from "@/context/LanguageContext";

type ToastKind = "success" | "error" | "info";

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// SweetAlert2 maps "success"/"error"/"info" straight to its own icon set.
const KIND_TO_ICON: Record<ToastKind, "success" | "error" | "info"> = {
  success: "success",
  error: "error",
  info: "info",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();

  const showToast = useCallback(
    (message: string, kind: ToastKind = "info", title?: string) => {
      Swal.fire({
        icon: KIND_TO_ICON[kind],
        title: title || message,
        text: title ? message : undefined,
        toast: true,
        // "top-end" mirrors automatically with the page's dir attribute:
        // English (ltr) -> top-right corner. Urdu (rtl) -> top-left corner.
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (el) => {
          el.style.direction = locale === "ur" ? "rtl" : "ltr";
        },
      });
    },
    [locale]
  );

  return <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}