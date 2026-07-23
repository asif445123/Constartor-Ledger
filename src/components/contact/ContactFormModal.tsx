"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, TextArea, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { apiFetch } from "@/lib/apiFetch";

export default function ContactFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  function resetForm() {
    setName("");
    setEmail("");
    setMessage("");
  }

  async function submit() {
    if (!name || !email || !message) {
      showToast(t.contactForm.fillRequired, "error");
      return;
    }
    setSending(true);
    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        resetForm();
        onClose();
      } else {
        showToast(data.message, "error");
      }
    } catch {
      showToast(t.authContext.serverUnreachable, "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.contactForm.headerTitle}
      footer={
        <>
          <GhostButton onClick={onClose} disabled={sending}>
            {t.expenseModal.cancel}
          </GhostButton>
          <PrimaryButton onClick={submit} disabled={sending}>
            {sending ? t.contactForm.sending : t.contactForm.sendButton}
          </PrimaryButton>
        </>
      }
    >
      <Input
        label={t.contactForm.fullName}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.contactForm.fullNamePlaceholder}
      />
      <Input
        label={t.contactForm.email}
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t.contactForm.emailPlaceholder}
      />
      <TextArea
        label={t.contactForm.message}
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={t.contactForm.messagePlaceholder}
      />
    </Modal>
  );
}
