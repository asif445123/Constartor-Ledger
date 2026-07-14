"use client";

import React, { useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { PrimaryButton } from "@/components/ui/Field";
import HistoryModal from "@/components/ui/HistoryModal";
import LaborFormModal from "@/components/labor/LaborFormModal";
import AttendanceModal from "@/components/labor/AttendanceModal";
import LaborExpenseModal from "@/components/labor/LaborExpenseModal";
import LaborProfileModal from "@/components/labor/LaborProfileModal";
import { DeleteIcon } from "@/components/ui/icons";
import { Labor } from "@/lib/types";

type ModalKind = "form" | "attendance" | "expense" | "profile" | "attHistory" | "expHistory" | null;

export default function MazdoorPage() {
  const { labors, deleteLabor, ready } = useData();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const { t, locale } = useLanguage();

  const [nameSearch, setNameSearch] = useState("");
  const [siteSearch, setSiteSearch] = useState("");
  const [modal, setModal] = useState<ModalKind>(null);
  const [activeLabor, setActiveLabor] = useState<Labor | null>(null);

  const filtered = useMemo(
    () =>
      labors.filter((l) => {
        const mName = !nameSearch || l.name.toLowerCase().includes(nameSearch.toLowerCase());
        const mSite = !siteSearch || (l.site || "").toLowerCase().includes(siteSearch.toLowerCase());
        return mName && mSite;
      }),
    [labors, nameSearch, siteSearch]
  );

  const totals = useMemo(() => {
    let ujrat = 0,
      paid = 0,
      baqaya = 0;
    filtered.forEach((l) => {
      ujrat += l.rate * l.att;
      paid += l.kharcha;
      baqaya += l.rate * l.att - l.kharcha;
    });
    return { ujrat, paid, baqaya };
  }, [filtered]);

  function openModal(kind: ModalKind, labor: Labor) {
    setActiveLabor(labor);
    setModal(kind);
  }

  async function handleDelete(labor: Labor) {
    const ok = await confirm(t.mazdoor.confirmDelete);
    if (ok) {
      deleteLabor(labor.id);
      showToast(t.mazdoor.laborDeleted, "success");
    }
  }

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow={t.mazdoor.eyebrow}
        title={t.mazdoor.title}
        subtitle={t.mazdoor.subtitle}
        action={
          <PrimaryButton
            onClick={() => {
              setActiveLabor(null);
              setModal("form");
            }}
          >
            {t.mazdoor.newLabor}
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label={t.mazdoor.totalWage} value={totals.ujrat.toLocaleString()} />
        <StatCard label={t.mazdoor.totalPaid} value={totals.paid.toLocaleString()} />
        <StatCard
          label={t.mazdoor.totalBalance}
          value={totals.baqaya.toLocaleString()}
          tone={totals.baqaya >= 0 ? "positive" : "negative"}
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          placeholder={t.mazdoor.searchByName}
          className="flex-1 min-w-[160px] rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
        <input
          value={siteSearch}
          onChange={(e) => setSiteSearch(e.target.value)}
          placeholder={t.mazdoor.searchBySite}
          className="flex-1 min-w-[160px] rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div className="bg-white rounded-lg border border-[var(--color-line)] overflow-x-auto">
        <table dir={locale === "en" ? "ltr" : "rtl"} className="ledger-table" style={{ textAlign: locale === "en" ? "left" : "right" }}>
          <thead>
            <tr>
              <th>{t.mazdoor.colName}</th>
              <th>{t.mazdoor.colSite}</th>
              <th>{t.mazdoor.colDailyRate}</th>
              <th>{t.mazdoor.colAttendance}</th>
              <th>{t.mazdoor.colKharcha}</th>
              <th>{t.mazdoor.colBalance}</th>
              <th>{t.mazdoor.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[var(--color-ink-soft)]">
                  {t.mazdoor.noLabor}
                </td>
              </tr>
            )}
            {filtered.map((l) => {
              const baqaya = l.rate * l.att - l.kharcha;
              return (
                <tr key={l.id}>
                  <td className="font-semibold">{l.name}</td>
                  <td>{l.site || "N/A"}</td>
                  <td className="font-ledger">{l.rate}</td>
                  <td className="font-ledger">{l.att}</td>
                  <td className="font-ledger">{l.kharcha}</td>
                  <td className={`font-ledger font-bold ${baqaya >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-rust)]"}`}>
                    {baqaya}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      <IconBtn title={t.mazdoor.markAttendance} onClick={() => openModal("attendance", l)}>✅</IconBtn>
                      <IconBtn title={t.mazdoor.attendanceHistory} onClick={() => openModal("attHistory", l)}>📅</IconBtn>
                      <IconBtn title={t.mazdoor.addExpense} onClick={() => openModal("expense", l)}>💰</IconBtn>
                      <IconBtn title={t.mazdoor.expenseDetail} onClick={() => openModal("expHistory", l)}>🧾</IconBtn>
                      <IconBtn title={t.mazdoor.edit} onClick={() => openModal("form", l)}>✏️</IconBtn>
                      <IconBtn title={t.mazdoor.profile} onClick={() => openModal("profile", l)}>👷</IconBtn>
                      <IconBtn title={t.mazdoor.delete} danger onClick={() => handleDelete(l)}><DeleteIcon /></IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <LaborFormModal open={modal === "form"} onClose={() => setModal(null)} labor={activeLabor} />
      <AttendanceModal open={modal === "attendance"} onClose={() => setModal(null)} labor={activeLabor} />
      <LaborExpenseModal open={modal === "expense"} onClose={() => setModal(null)} labor={activeLabor} />
      <LaborProfileModal open={modal === "profile"} onClose={() => setModal(null)} labor={activeLabor} />

      <HistoryModal
        open={modal === "attHistory"}
        onClose={() => setModal(null)}
        title={`${t.mazdoor.attendanceHistoryTitle}${activeLabor ? " — " + activeLabor.name : ""}`}
        emptyText={t.mazdoor.noAttendance}
        items={(activeLabor?.attendance ?? []).map((a) => (
          <>
            <span>{a.date}</span>
            <span className="text-[var(--color-ink-soft)]">{a.day}</span>
          </>
        ))}
      />

      <HistoryModal
        open={modal === "expHistory"}
        onClose={() => setModal(null)}
        title={`${t.mazdoor.expenseHistoryTitle}${activeLabor ? " — " + activeLabor.name : ""}`}
        emptyText={t.mazdoor.noExpenses}
        items={(activeLabor?.expenses ?? []).map((e) => (
          <>
            <span>
              {e.date} <span className="text-[var(--color-ink-soft)]">({e.day})</span>
            </span>
            <span className="font-ledger font-semibold">
              {e.amount.toLocaleString()} <span className="text-[var(--color-ink-soft)] font-normal">— {e.note}</span>
            </span>
          </>
        ))}
      />
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-8 h-8 rounded-md flex items-center justify-center text-sm border transition ${
        danger
          ? "border-[var(--color-rust)]/40 hover:bg-[var(--color-rust)]/10"
          : "border-[var(--color-line)] hover:bg-[var(--color-paper-alt)]"
      }`}
    >
      {children}
    </button>
  );
}
