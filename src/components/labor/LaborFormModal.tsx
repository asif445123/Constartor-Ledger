/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, Select, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { Labor } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  labor?: Labor | null;
}

export default function LaborFormModal({ open, onClose, labor }: Props) {
  const { sites, addLabor, editLabor } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [mobile, setMobile] = useState("");
  const [site, setSite] = useState("");
  const [att, setAtt] = useState("");
  const [kharcha, setKharcha] = useState("");

  useEffect(() => {
    if (open) {
      setName(labor?.name ?? "");
      setRate(labor ? String(labor.rate) : "");
      setMobile(labor?.mobile ?? "");
      setSite(labor?.site ?? "");
      setAtt(labor ? String(labor.att) : "");
      setKharcha(labor ? String(labor.kharcha) : "");
    }
  }, [open, labor]);

  const siteOptions = sites.map((s) => ({ value: s, label: s }));

  async function submit() {
    if (!name || !rate || !mobile) return showToast(t.laborFormModal.errRequired, "error");
    if (!site) return showToast(t.laborFormModal.errSite, "error");

    try {
      if (labor) {
        await editLabor(labor.id, {
          name,
          rate: parseFloat(rate) || 0,
          mobile,
          site,
          att: att === "" ? labor.att : parseFloat(att) || 0,
          kharcha: kharcha === "" ? labor.kharcha : parseFloat(kharcha) || 0,
        });
        showToast(t.laborFormModal.updated, "success");
      } else {
        await addLabor({ name, rate: parseFloat(rate) || 0, mobile, site });
        showToast(t.laborFormModal.added, "success");
      }
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.laborFormModal.error, "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={labor ? t.laborFormModal.editTitle : t.laborFormModal.newTitle}
      footer={
        <>
          <GhostButton onClick={onClose}>{t.laborFormModal.cancel}</GhostButton>
          <PrimaryButton onClick={submit}>{t.laborFormModal.save}</PrimaryButton>
        </>
      }
    >
      <Input label={t.laborFormModal.nameLabel} required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.laborFormModal.namePlaceholder} />
      <Select label={t.laborFormModal.siteLabel} required value={site} onChange={(e) => setSite(e.target.value)} options={siteOptions} />
      <Input label={t.laborFormModal.rateLabel} required type="number" value={rate} onChange={(e) => setRate(e.target.value)} placeholder={t.laborFormModal.amountPlaceholder} />
      <Input label={t.laborFormModal.mobileLabel} required type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder={t.laborFormModal.mobilePlaceholder} />
      {labor && (
        <div className="grid grid-cols-2 gap-3">
          <Input label={t.laborFormModal.attLabel} type="number" value={att} onChange={(e) => setAtt(e.target.value)} />
          <Input label={t.laborFormModal.kharchaLabel} type="number" value={kharcha} onChange={(e) => setKharcha(e.target.value)} />
        </div>
      )}
    </Modal>
  );
}
