/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { todayISO } from "@/lib/types";
import { Labor } from "@/lib/types";

export default function AttendanceModal({
  open,
  onClose,
  labor,
}: {
  open: boolean;
  onClose: () => void;
  labor: Labor | null;
}) {
  const { markAttendance } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [date, setDate] = useState(todayISO());

  useEffect(() => {
    if (open) setDate(todayISO());
  }, [open]);

  async function submit() {
    if (!labor || !date) return;
    try {
      await markAttendance(labor.id, date);
      showToast(t.attendanceModal.marked, "success");
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : t.attendanceModal.error, "error");
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${t.attendanceModal.title}${labor ? " — " + labor.name : ""}`}
      widthClass="max-w-sm"
      footer={
        <>
          <GhostButton onClick={onClose}>{t.attendanceModal.cancel}</GhostButton>
          <PrimaryButton onClick={submit}>{t.attendanceModal.save}</PrimaryButton>
        </>
      }
    >
      <Input label={t.attendanceModal.dateLabel} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
    </Modal>
  );
}
