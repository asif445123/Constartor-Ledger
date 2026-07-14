import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  tone?: "default" | "positive" | "negative" | "accent";
  eyebrow?: string;
}

const TONE_TEXT: Record<string, string> = {
  default: "text-[var(--color-ink)]",
  positive: "text-[var(--color-green)]",
  negative: "text-[var(--color-rust)]",
  accent: "text-[var(--color-accent-dark)]",
};

export function StatCard({ label, value, tone = "default", eyebrow }: StatCardProps) {
  return (
    <div className="tick-corners bg-white rounded-lg border border-[var(--color-line)] px-5 py-4">
      {eyebrow && (
        <p className="font-display text-xs tracking-wide text-[var(--color-muted)] mb-1">
          {eyebrow}
        </p>
      )}
      <p className="text-sm text-[var(--color-ink-soft)] mb-1">{label}</p>
      <p className={`font-ledger text-2xl font-semibold ${TONE_TEXT[tone]}`}>{value}</p>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <p className="font-display text-sm tracking-wide text-[var(--color-rust)] mb-1">
          {eyebrow}
        </p>
        <h1 className="font-display text-3xl text-[var(--color-ink)]">{title}</h1>
        {subtitle && <p className="text-[var(--color-ink-soft)] text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
