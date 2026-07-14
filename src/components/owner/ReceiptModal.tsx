/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { todayISO, Owner } from "@/lib/types";

export default function ReceiptModal({
  open,
  onClose,
  owner,
}: {
  open: boolean;
  onClose: () => void;
  owner: Owner | null;
}) {
  const { receiveMoney } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [date, setDate] = useState(todayISO());
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayISO());
      setAmount("");
      setFrom("");
    }
  }, [open]);

  async function submit() {
    if (!owner || !date || !amount || isNaN(Number(amount))) return showToast(t.receiptModal.errAmount, "error");
    try {
      await receiveMoney(owner.id, date, parseFloat(amount), from);
      showToast(t.receiptModal.added, "success");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.receiptModal.error, "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t.receiptModal.title}${owner ? " — " + owner.name : ""}`}
      widthClass="max-w-sm"
      footer={
        <>
          <GhostButton onClick={onClose}>{t.receiptModal.cancel}</GhostButton>
          <PrimaryButton onClick={submit}>{t.receiptModal.save}</PrimaryButton>
        </>
      }
    >
      <Input label={t.receiptModal.dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Input label={t.receiptModal.amountLabel} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t.receiptModal.amountPlaceholder} />
      <Input label={t.receiptModal.fromLabel} value={from} onChange={(e) => setFrom(e.target.value)} placeholder={t.receiptModal.fromPlaceholder} />
    </Modal>
  );
}
