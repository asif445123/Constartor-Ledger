"use client";

import Link from "next/link";
import { useData, getOwnerDealInfo } from "@/context/DataContext";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { useLanguage } from "@/context/LanguageContext";

export default function DashboardPage() {
  const { labors, owners, expenses, sites, ready } = useData();
  const { t } = useLanguage();

  if (!ready) return null;

  const totalReceived = owners.reduce((s, o) => s + (o.received || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const totalLaborKharcha = labors.reduce((s, l) => s + (l.kharcha || 0), 0);
  const totalKharcha = totalExpenses + totalLaborKharcha;
  const balance = totalReceived - totalKharcha;

  const totalContract = owners.reduce((s, o) => s + (o.contractTotal || 0), 0);
  const totalDealAmount = owners.reduce((s, o) => s + getOwnerDealInfo(o).dealAmount, 0);
  const totalNewContract = totalContract + totalDealAmount;
  const contractBalance = totalNewContract - totalReceived;

  return (
    <div>
      <PageHeader
        eyebrow={t.dashboard.eyebrow}
        title={t.dashboard.title}
        subtitle={t.dashboard.subtitle}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard eyebrow={t.dashboard.income} label={t.dashboard.totalReceived} value={totalReceived.toLocaleString()} tone="positive" />
        <StatCard eyebrow={t.dashboard.expenses} label={t.dashboard.totalKharcha} value={totalKharcha.toLocaleString()} tone="negative" />
        <StatCard
          eyebrow={t.dashboard.balance}
          label={t.dashboard.totalBalance}
          value={balance.toLocaleString()}
          tone={balance >= 0 ? "positive" : "negative"}
        />
        <StatCard eyebrow={t.dashboard.contract} label={t.dashboard.totalContract} value={totalNewContract.toLocaleString()} tone="accent" />
        <StatCard eyebrow={t.dashboard.owners} label={t.dashboard.totalFromOwners} value={totalReceived.toLocaleString()} />
        <StatCard
          eyebrow={t.dashboard.remainingContract}
          label={t.dashboard.remainingFromOwners}
          value={contractBalance.toLocaleString()}
          tone={contractBalance >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Link
          href="/malik"
          className="tick-corners bg-white rounded-lg border border-[var(--color-line)] p-5 hover:border-[var(--color-accent)] transition"
        >
          <p className="text-2xl mb-2">🤝</p>
          <p className="font-semibold">{owners.length} {t.dashboard.ownersCard}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">{t.dashboard.ownersCardDesc}</p>
        </Link>
        <Link
          href="/mazdoor"
          className="tick-corners bg-white rounded-lg border border-[var(--color-line)] p-5 hover:border-[var(--color-accent)] transition"
        >
          <p className="text-2xl mb-2">👷</p>
          <p className="font-semibold">{labors.length} {t.dashboard.laborCard}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">{t.dashboard.laborCardDesc}</p>
        </Link>
        <Link
          href="/kharcha"
          className="tick-corners bg-white rounded-lg border border-[var(--color-line)] p-5 hover:border-[var(--color-accent)] transition"
        >
          <p className="text-2xl mb-2">🧾</p>
          <p className="font-semibold">{expenses.length} {t.dashboard.expensesCard}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">{t.dashboard.expensesCardDesc}</p>
        </Link>
        <Link
          href="/site"
          className="tick-corners bg-white rounded-lg border border-[var(--color-line)] p-5 hover:border-[var(--color-accent)] transition"
        >
          <p className="text-2xl mb-2">🏗️</p>
          <p className="font-semibold">{sites.length} {t.dashboard.sitesCard}</p>
          <p className="text-sm text-[var(--color-ink-soft)]">{t.dashboard.sitesCardDesc}</p>
        </Link>
      </div>
    </div>
  );
}
