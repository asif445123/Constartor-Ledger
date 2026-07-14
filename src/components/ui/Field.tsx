"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const baseClass =
  "w-full rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-[var(--color-accent)] transition";

interface LabeledProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrap({ label, required, children }: LabeledProps) {
  return (
    <label className="block mb-3">
      <span className="block text-sm text-[var(--color-ink-soft)] mb-1">
        {label} {required && <span className="text-[var(--color-rust)]">*</span>}
      </span>
      {children}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  required?: boolean;
};

export function Input({ label, required, className, ...rest }: InputProps) {
  return (
    <FieldWrap label={label} required={required}>
      <input className={`${baseClass} ${className ?? ""}`} {...rest} />
    </FieldWrap>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  required?: boolean;
  options: { value: string; label: string }[];
};

export function Select({ label, required, options, className, ...rest }: SelectProps) {
  const { t } = useLanguage();
  return (
    <FieldWrap label={label} required={required}>
      <select className={`${baseClass} ${className ?? ""}`} {...rest}>
        <option value="">{t.common.selectPlaceholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrap>
  );
}

type TextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  required?: boolean;
};

export function TextArea({ label, required, className, ...rest }: TextAreaProps) {
  return (
    <FieldWrap label={label} required={required}>
      <textarea className={`${baseClass} ${className ?? ""}`} rows={3} {...rest} />
    </FieldWrap>
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      className={`px-4 py-2 rounded-md bg-[var(--color-accent)] text-[var(--color-bg)] font-semibold hover:bg-[var(--color-accent-dark)] transition ${className ?? ""}`}
      {...rest}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;
  return (
    <button
      className={`px-4 py-2 rounded-md border border-[var(--color-line)] text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-alt)] transition ${className ?? ""}`}
      {...rest}
    />
  );
}
