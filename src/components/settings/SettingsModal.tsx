"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Input, PrimaryButton, GhostButton } from "@/components/ui/Field";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const { isDemo } = useData();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [open, user]);

  async function submit() {
    if (isDemo) {
      showToast(t.settings.demoNotAllowed, "error");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      showToast(t.settings.passwordMismatch, "error");
      return;
    }

    setSaving(true);
    try {
      const result = await updateProfile(
        name,
        email,
        newPassword ? currentPassword : undefined,
        newPassword || undefined
      );
      if (result.ok) {
        showToast(result.message || t.settings.title, "success");
        onClose();
      } else {
        showToast(result.message || t.authContext.loginFailed, "error");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.settings.title}
      footer={
        <>
          <GhostButton onClick={onClose} disabled={saving}>
            {t.settings.cancel}
          </GhostButton>
          <PrimaryButton onClick={submit} disabled={saving}>
            {saving ? t.settings.saving : t.settings.save}
          </PrimaryButton>
        </>
      }
    >
      <p className="text-sm text-[var(--color-ink-soft)] mb-4">{t.settings.subtitle}</p>

      <Input label={t.settings.fullName} required value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        label={t.settings.email}
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="mt-4 pt-4 border-t border-[var(--color-line)]">
        <p className="text-sm font-semibold text-[var(--color-ink)] mb-3">{t.settings.changePassword}</p>
        <Input
          label={t.settings.currentPassword}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder={t.settings.currentPasswordPlaceholder}
        />
        <Input
          label={t.settings.newPassword}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder={t.settings.newPasswordPlaceholder}
        />
        <Input
          label={t.settings.confirmPassword}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={t.settings.confirmPasswordPlaceholder}
        />
      </div>
    </Modal>
  );
}
