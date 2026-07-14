/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, TextArea, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { todayISO, Owner } from "@/lib/types";

export default function DealModal({
  open,
  onClose,
  owner,
}: {
  open: boolean;
  onClose: () => void;
  owner: Owner | null;
}) {
  const { addDeal } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [date, setDate] = useState(todayISO());
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (open) {
      setDate(todayISO());
      setAmount("");
      setDesc("");
    }
  }, [open]);

  async function submit() {
    if (!owner || !date || !amount || isNaN(Number(amount))) return showToast(t.dealModal.errAmount, "error");
    try {
      await addDeal(owner.id, date, parseFloat(amount), desc);
      showToast(t.dealModal.added, "success");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.dealModal.error, "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t.dealModal.title}${owner ? " — " + owner.name : ""}`}
      widthClass="max-w-sm"
      footer={
        <>
          <GhostButton onClick={onClose}>{t.dealModal.cancel}</GhostButton>
          <PrimaryButton onClick={submit}>{t.dealModal.save}</PrimaryButton>
        </>
      }
    >
      <Input label={t.dealModal.dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Input label={t.dealModal.amountLabel} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t.dealModal.amountPlaceholder} />
      <TextArea label={t.dealModal.descLabel} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t.dealModal.descPlaceholder} />
    </Modal>
  );
}
