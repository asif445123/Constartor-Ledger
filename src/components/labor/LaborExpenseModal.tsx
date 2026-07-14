/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { todayISO, Labor } from "@/lib/types";

export default function LaborExpenseModal({
  open,
  onClose,
  labor,
}: {
  open: boolean;
  onClose: () => void;
  labor: Labor | null;
}) {
  const { addLaborExpense } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [date, setDate] = useState(todayISO());
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayISO());
      setAmount("");
      setNote("");
    }
  }, [open]);

  async function submit() {
    if (!labor || !date || !amount || isNaN(Number(amount))) return showToast(t.laborExpenseModal.errRequired, "error");
    try {
      await addLaborExpense(labor.id, date, parseFloat(amount), note);
      showToast(t.laborExpenseModal.added, "success");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.laborExpenseModal.error, "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t.laborExpenseModal.title}${labor ? " — " + labor.name : ""}`}
      widthClass="max-w-sm"
      footer={
        <>
          <GhostButton onClick={onClose}>{t.laborExpenseModal.cancel}</GhostButton>
          <PrimaryButton onClick={submit}>{t.laborExpenseModal.save}</PrimaryButton>
        </>
      }
    >
      <Input label={t.laborExpenseModal.dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Input label={t.laborExpenseModal.amountLabel} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t.laborExpenseModal.amountPlaceholder} />
      <Input label={t.laborExpenseModal.noteLabel} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t.laborExpenseModal.notePlaceholder} />
    </Modal>
  );
}
