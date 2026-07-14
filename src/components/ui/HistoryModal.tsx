"use client";

import React from "react";
import Modal from "./Modal";

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  items: React.ReactNode[];
  emptyText: string;
}

export default function HistoryModal({ open, onClose, title, items, emptyText }: HistoryModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} widthClass="max-w-lg">
      {items.length === 0 ? (
        <p className="text-[var(--color-ink-soft)] text-center py-6">{emptyText}</p>
      ) : (
        <ol className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className="ledger-margin bg-[var(--color-paper-alt)] rounded-md px-4 py-2.5 text-sm flex items-center justify-between"
            >
              {item}
            </li>
          ))}
        </ol>
      )}
    </Modal>
  );
}
