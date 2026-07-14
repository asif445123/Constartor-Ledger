"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import Modal from "./Modal";
import { useLanguage } from "@/context/LanguageContext";

interface ConfirmState {
  message: string;
  title: string;
  resolve: (v: boolean) => void;
}

interface ConfirmContextValue {
  confirm: (message: string, title?: string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);
  const { t } = useLanguage();

  const confirm = useCallback((message: string, title = t.common.confirmDefaultTitle) => {
    return new Promise<boolean>((resolve) => {
      setState({ message, title, resolve });
    });
  }, [t]);

  const close = (result: boolean) => {
    state?.resolve(result);
    setState(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal
        open={!!state}
        onClose={() => close(false)}
        title={state?.title ?? ""}
        widthClass="max-w-sm"
        footer={
          <>
            <button
              onClick={() => close(false)}
              className="px-4 py-2 rounded-md border border-[var(--color-line)] text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-alt)]"
            >
              {t.common.confirmNo}
            </button>
            <button
              onClick={() => close(true)}
              className="px-4 py-2 rounded-md bg-[var(--color-rust)] text-white hover:bg-[var(--color-rust)]/90"
            >
              {t.common.confirmYesDelete}
            </button>
          </>
        }
      >
        <p className="text-[var(--color-ink)]">{state?.message}</p>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx.confirm;
}
