/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, Select, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { todayISO, Expense } from "@/lib/types";

export default function ExpenseFormModal({
  open,
  onClose,
  expense,
}: {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
}) {
  const { sites, addExpense, editExpense } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [date, setDate] = useState(todayISO());
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [site, setSite] = useState("");

  useEffect(() => {
    if (open) {
      setDate(expense?.date || todayISO());
      setName(expense?.name ?? "");
      setAmount(expense ? String(expense.amount) : "");
      setSite(expense?.site ?? "");
    }
  }, [open, expense]);

  const siteOptions = sites.map((s) => ({ value: s, label: s }));

  async function submit() {
    if (!name || !amount || !site) return showToast(t.expenseModal.fillRequired, "error");
    try {
      if (expense) {
        await editExpense(expense.id, { date, name, amount: parseFloat(amount) || 0, site });
        showToast(t.expenseModal.updated, "success");
      } else {
        await addExpense({ name, amount: parseFloat(amount) || 0, date, site });
        showToast(t.expenseModal.added, "success");
      }
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.expenseModal.error, "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={expense ? t.expenseModal.editTitle : t.expenseModal.newTitle}
      footer={
        <>
          <GhostButton onClick={onClose}>{t.expenseModal.cancel}</GhostButton>
          <PrimaryButton onClick={submit}>{t.expenseModal.save}</PrimaryButton>
        </>
      }
    >
      <Input label={t.expenseModal.dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Select label={t.expenseModal.siteLabel} required value={site} onChange={(e) => setSite(e.target.value)} options={siteOptions} />
      <Input label={t.expenseModal.itemLabel} required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.expenseModal.itemPlaceholder} />
      <Input label={t.expenseModal.amountLabel} required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t.expenseModal.amountPlaceholder} />
    </Modal>
  );
}
