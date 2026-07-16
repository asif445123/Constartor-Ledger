"use client";

import React, { useMemo, useState } from "react";
import { useData, getOwnerDealInfo } from "@/context/DataContext";
import { useConfirm } from "@/components/ui/ConfirmProvider";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import { PageHeader, StatCard } from "@/components/ui/StatCard";
import { PrimaryButton } from "@/components/ui/Field";
import HistoryModal from "@/components/ui/HistoryModal";
import OwnerFormModal from "@/components/owner/OwnerFormModal";
import DealModal from "@/components/owner/DealModal";
import ReceiptModal from "@/components/owner/ReceiptModal";
import OwnerProfileModal from "@/components/owner/OwnerProfileModal";
import { Owner, getDisplayDayName } from "@/lib/types";
import { DeleteIcon } from "@/components/ui/icons";

type ModalKind = "form" | "deal" | "receipt" | "profile" | "dealHistory" | "receiptHistory" | null;

export default function MalikPage() {
  const { owners, deleteOwner, ready } = useData();
  const confirm = useConfirm();
  const { showToast } = useToast();
  const { t, locale } = useLanguage();

  const [siteSearch, setSiteSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [modal, setModal] = useState<ModalKind>(null);
  const [activeOwner, setActiveOwner] = useState<Owner | null>(null);

  const filtered = useMemo(
    () =>
      owners.filter((o) => {
        const mSite = !siteSearch || o.site.toLowerCase().includes(siteSearch.toLowerCase());
        const mName = !nameSearch || o.name.toLowerCase().includes(nameSearch.toLowerCase());
        return mSite && mName;
      }),
    [owners, siteSearch, nameSearch]
  );

  const totals = useMemo(() => {
    const totalContract = owners.reduce((s, o) => s + (o.contractTotal || 0), 0);
    const dealCount = owners.reduce((s, o) => s + getOwnerDealInfo(o).dealCount, 0);
    const dealAmount = owners.reduce((s, o) => s + getOwnerDealInfo(o).dealAmount, 0);
    const totalNewContract = totalContract + dealAmount;
    const received = owners.reduce((s, o) => s + (o.received || 0), 0);
    const balance = totalNewContract - received;
    return { totalContract, dealCount, dealAmount, totalNewContract, received, balance };
  }, [owners]);

  function openModal(kind: ModalKind, owner: Owner) {
    setActiveOwner(owner);
    setModal(kind);
  }

  async function handleDelete(owner: Owner) {
    const ok = await confirm(t.malik.confirmDelete);
    if (ok) {
      deleteOwner(owner.id);
      showToast(t.malik.ownerDeleted, "success");
    }
  }

  if (!ready) return null;

  return (
    <div>
      <PageHeader
        eyebrow={t.malik.eyebrow}
        title={t.malik.title}
        subtitle={t.malik.subtitle}
        action={
          <PrimaryButton
            onClick={() => {
              setActiveOwner(null);
              setModal("form");
            }}
          >
            {t.malik.newOwner}
          </PrimaryButton>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <StatCard label={t.malik.totalContract} value={totals.totalNewContract.toLocaleString()} tone="accent" />
        <StatCard label={t.malik.totalReceived} value={totals.received.toLocaleString()} tone="positive" />
        <StatCard label={t.malik.balance} value={totals.balance.toLocaleString()} tone={totals.balance >= 0 ? "positive" : "negative"} />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={siteSearch}
          onChange={(e) => setSiteSearch(e.target.value)}
          placeholder={t.malik.searchBySite}
          className="flex-1 min-w-[160px] rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
        <input
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          placeholder={t.malik.searchByName}
          className="flex-1 min-w-[160px] rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>

      <div className="bg-white rounded-lg border border-[var(--color-line)] overflow-x-auto">
        <table className="ledger-table">
          <thead>
            <tr>
              <th>{t.malik.colDate}</th>
              <th>{t.malik.colSite}</th>
              <th>{t.malik.colOwner}</th>
              <th>{t.malik.colContract}</th>
              <th>{t.malik.colDeal}</th>
              <th>{t.malik.colReceived}</th>
              <th>{t.malik.colBalance}</th>
              <th>{t.malik.colActions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[var(--color-ink-soft)]">
                  {t.malik.noOwners}
                </td>
              </tr>
            )}
            {filtered.map((o) => {
              const dealInfo = getOwnerDealInfo(o);
              const totalContract = (o.contractTotal || 0) + dealInfo.dealAmount;
              const balance = totalContract - (o.received || 0);
              return (
                <tr key={o.id}>
                  <td>{o.date}</td>
                  <td className="font-semibold">{o.site}</td>
                  <td>{o.name}</td>
                  <td className="font-ledger">{(o.contractTotal || 0).toLocaleString()}</td>
                  <td className="font-ledger">{dealInfo.dealAmount.toLocaleString()}</td>
                  <td className="font-ledger">{(o.received || 0).toLocaleString()}</td>
                  <td className={`font-ledger font-bold ${balance >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-rust)]"}`}>
                    {balance.toLocaleString()}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      <IconBtn title={t.malik.newDeal} onClick={() => openModal("deal", o)}>🤝</IconBtn>
                      <IconBtn title={t.malik.dealDetail} onClick={() => openModal("dealHistory", o)}>📈</IconBtn>
                      <IconBtn title={t.malik.collectPayment} onClick={() => openModal("receipt", o)}>💸</IconBtn>
                      <IconBtn title={t.malik.receiptHistory} onClick={() => openModal("receiptHistory", o)}>🧾</IconBtn>
                      <IconBtn title={t.malik.edit} onClick={() => openModal("form", o)}>✏️</IconBtn>
                      <IconBtn title={t.malik.ownerProfile} onClick={() => openModal("profile", o)}>👷</IconBtn>
                      <IconBtn title={t.malik.delete} danger onClick={() => handleDelete(o)}><DeleteIcon /></IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <OwnerFormModal open={modal === "form"} onClose={() => setModal(null)} owner={activeOwner} />
      <DealModal open={modal === "deal"} onClose={() => setModal(null)} owner={activeOwner} />
      <ReceiptModal open={modal === "receipt"} onClose={() => setModal(null)} owner={activeOwner} />
      <OwnerProfileModal open={modal === "profile"} onClose={() => setModal(null)} owner={activeOwner} />

      <HistoryModal
        open={modal === "dealHistory"}
        onClose={() => setModal(null)}
        title={`${t.malik.dealHistoryTitle}${activeOwner ? " — " + activeOwner.name : ""}`}
        emptyText={t.malik.noDeals}
        items={(activeOwner?.history ?? [])
          .filter((h) => h.type === "deal")
          .map((d) => (
            <>
              <span>
                {d.date} <span className="text-[var(--color-ink-soft)]">({getDisplayDayName(d.date, locale)})</span>
              </span>
              <span className="font-ledger font-semibold">
                {d.amount.toLocaleString()} <span className="text-[var(--color-ink-soft)] font-normal">— {d.desc || ""}</span>
              </span>
            </>
          ))}
      />

      <HistoryModal
        open={modal === "receiptHistory"}
        onClose={() => setModal(null)}
        title={`${t.malik.receiptHistoryTitle}${activeOwner ? " — " + activeOwner.name : ""}`}
        emptyText={t.malik.noReceipts}
        items={(activeOwner?.history ?? [])
          .filter((h) => h.type === "receipt")
          .map((h) => (
            <>
              <span>
                {h.date} <span className="text-[var(--color-ink-soft)]">({getDisplayDayName(h.date, locale)})</span>
              </span>
              <span className="font-ledger font-semibold">
                {h.amount.toLocaleString()} <span className="text-[var(--color-ink-soft)] font-normal">({h.from || ""})</span>
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
