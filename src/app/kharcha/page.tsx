"use client";

import React, { useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { PrimaryButton } from "@/components/ui/Field";
import ExpenseFormModal from "@/components/expense/ExpenseFormModal";
import { Expense, getDisplayDayName } from "@/lib/types";
import { DeleteIcon } from "@/components/ui/icons";

export default function KharchaPage() {
  const { expenses, deleteExpense, ready } = useData();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const { t, locale } = useLanguage();

  const [siteSearch, setSiteSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeExpense, setActiveExpense] = useState<Expense | null>(null);

  const filtered = useMemo(
    () => expenses.filter((e) => !siteSearch || (e.site || "").toLowerCase().includes(siteSearch.toLowerCase())),
    [expenses, siteSearch]
  );

  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);

  async function handleDelete(e: Expense) {
    const ok = await confirm(t.kharcha.confirmDelete);
    if (ok) {
      deleteExpense(e.id);
      showToast(t.kharcha.expenseDeleted, "success");
    }
  }

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow={t.kharcha.eyebrow}
        title={t.kharcha.title}
        subtitle={t.kharcha.subtitle}
        action={
          <PrimaryButton
            onClick={() => {
              setActiveExpense(null);
              setModalOpen(true);
            }}
          >
            {t.kharcha.newExpense}
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label={t.kharcha.totalKharcha} value={total.toLocaleString()} tone="negative" />
        <StatCard label={t.kharcha.totalEntries} value={filtered.length} />
      </div>

      <input
        value={siteSearch}
        onChange={(e) => setSiteSearch(e.target.value)}
        placeholder={t.kharcha.searchBySite}
        className="w-full max-w-xs mb-4 rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
      />

      <div className="bg-white rounded-lg border border-[var(--color-line)] overflow-x-auto">
        <table dir={locale === "en" ? "ltr" : "rtl"} className="ledger-table">
          <thead>
            <tr>
              <th>{t.kharcha.colDate}</th>
              <th>{t.kharcha.colSite}</th>
              <th>{t.kharcha.colItem}</th>
              <th>{t.kharcha.colAmount}</th>
              <th>{t.kharcha.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[var(--color-ink-soft)]">
                  {t.kharcha.noExpenses}
                </td>
              </tr>
            )}
            {filtered.map((e) => (
              <tr key={e.id}>
                <td>
                  {e.date} <span className="text-[var(--color-ink-soft)]">({getDisplayDayName(e.date, locale)})</span>
                </td>
                <td className="font-semibold">{e.site || "N/A"}</td>
                <td>{e.name}</td>
                <td className="font-ledger">{e.amount.toLocaleString()}</td>
                <td>
                  <div className="flex gap-1.5">
                    <button
                      title={t.kharcha.edit}
                      onClick={() => {
                        setActiveExpense(e);
                        setModalOpen(true);
                      }}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-sm border border-[var(--color-line)] hover:bg-[var(--color-paper-alt)]"
                    >
                      ✏️
                    </button>
                    <button
                      title={t.kharcha.delete}
                      onClick={() => handleDelete(e)}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-sm border border-[var(--color-rust)]/40 hover:bg-[var(--color-rust)]/10"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExpenseFormModal open={modalOpen} onClose={() => setModalOpen(false)} expense={activeExpense} />
    </div>
  );
}
