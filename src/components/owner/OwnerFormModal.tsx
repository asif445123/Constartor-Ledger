/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, TextArea, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { todayISO, Owner } from "@/lib/types";

export default function OwnerFormModal({
  open,
  onClose,
  owner,
}: {
  open: boolean;
  onClose: () => void;
  owner?: Owner | null;
}) {
  const { sites, addOwner, editOwner } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [date, setDate] = useState(todayISO());
  const [site, setSite] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [received, setReceived] = useState("");
  const [desc, setDesc] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    if (open) {
      setDate(owner?.date || todayISO());
      setSite(owner?.site ?? "");
      setName(owner?.name ?? "");
      setAmount(owner ? String(owner.contractTotal) : "");
      setReceived(owner ? String(owner.received) : "");
      setDesc(owner?.desc ?? "");
      setMobile(owner?.mobile ?? "");
    }
  }, [open, owner]);

  async function submit() {
    if (!name) return showToast(t.ownerFormModal.errName, "error");
    if (!site) return showToast(t.ownerFormModal.errSite, "error");
    if (!mobile) return showToast(t.ownerFormModal.errMobile, "error");

    try {
      if (owner) {
        await editOwner(owner.id, {
          date,
          site,
          name,
          contractTotal: amount === "" ? owner.contractTotal : parseFloat(amount) || 0,
          received: received === "" ? owner.received : parseFloat(received) || 0,
          desc,
          mobile,
        });
        showToast(t.ownerFormModal.updated, "success");
      } else {
        await addOwner({ name, site, amount: parseFloat(amount) || 0, date, desc, mobile });
        showToast(t.ownerFormModal.added, "success");
      }
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.ownerFormModal.error, "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={owner ? t.ownerFormModal.editTitle : t.ownerFormModal.newTitle}
      footer={
        <>
          <GhostButton onClick={onClose}>{t.ownerFormModal.cancel}</GhostButton>
          <PrimaryButton onClick={submit}>{t.ownerFormModal.save}</PrimaryButton>
        </>
      }
    >
      <Input label={t.ownerFormModal.dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Input
        label={t.ownerFormModal.siteLabel}
        required
        list="site-suggestions"
        value={site}
        onChange={(e) => setSite(e.target.value)}
        placeholder={t.ownerFormModal.sitePlaceholder}
      />
      <datalist id="site-suggestions">
        {sites.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
      <Input label={t.ownerFormModal.ownerNameLabel} required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.ownerFormModal.ownerNamePlaceholder} />
      <Input label={t.ownerFormModal.totalContractLabel} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t.ownerFormModal.amountPlaceholder} />
      {owner && (
        <Input label={t.ownerFormModal.totalReceivedLabel} type="number" value={received} onChange={(e) => setReceived(e.target.value)} />
      )}
      <TextArea label={t.ownerFormModal.descLabel} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder={t.ownerFormModal.descPlaceholder} />
      <Input label={t.ownerFormModal.mobileLabel} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder={t.ownerFormModal.mobilePlaceholder} />
    </Modal>
  );
}
