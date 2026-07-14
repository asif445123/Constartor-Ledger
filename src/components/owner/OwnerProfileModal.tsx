"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import Modal from "@/components/ui/Modal";
import { Owner } from "@/lib/types";
import { getOwnerDealInfo } from "@/context/DataContext";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/context/LanguageContext";
import type { Dict } from "@/context/LanguageContext";

async function shareOrDownload(
  blob: Blob,
  fileName: string,
  showToast: (msg: string, type: "success" | "error") => void,
  t: Dict
) {
  const file = new File([blob], fileName, { type: "image/png" });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: fileName, text: t.ownerProfile.shareText });
      showToast(t.ownerProfile.shareSuccess, "success");
      return;
    } catch (err) {
      if ((err as Error).name === "AbortError") return; // user cancelled share sheet
      console.error("Share error:", err);
      // fall through to download
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(t.ownerProfile.downloadSuccess, "success");
}

export default function OwnerProfileModal({
  open,
  onClose,
  owner,
}: {
  open: boolean;
  onClose: () => void;
  owner: Owner | null;
}) {
  const { showToast } = useToast();
  const { t, locale, dir } = useLanguage();
  const [sharing, setSharing] = useState(false);

  if (!owner) return null;

  const baseContract = owner.contractTotal || 0;
  const dealInfo = getOwnerDealInfo(owner);
  const totalContract = baseContract + dealInfo.dealAmount;
  const received = owner.received || 0;
  const balance = totalContract - received;

  const waMessage = t.ownerProfile.waMessageTemplate(
    owner.name,
    owner.site,
    totalContract.toLocaleString(),
    received.toLocaleString(),
    balance.toLocaleString(),
    owner.desc || "N/A"
  );
  const waUrl = owner.mobile
    ? `https://wa.me/${owner.mobile}?text=${encodeURIComponent(waMessage)}`
    : null;

  const rows: [string, string][] = [
    [t.ownerProfile.rowSite, owner.site],
    [t.ownerProfile.rowName, owner.name],
    [t.ownerProfile.rowDate, owner.date],
    [t.ownerProfile.rowDay, owner.day],
    [t.ownerProfile.rowMobile, owner.mobile],
    [t.ownerProfile.rowPrevContract, `${baseContract.toLocaleString()} ${t.ownerProfile.rupees}`],
    [t.ownerProfile.rowDealCount, `${dealInfo.dealCount}`],
    [t.ownerProfile.rowDealAmount, `${dealInfo.dealAmount.toLocaleString()} ${t.ownerProfile.rupees}`],
    [t.ownerProfile.rowTotalContract, `${totalContract.toLocaleString()} ${t.ownerProfile.rupees}`],
    [t.ownerProfile.rowTotalReceived, `${received.toLocaleString()} ${t.ownerProfile.rupees}`],
    [t.ownerProfile.rowDesc, owner.desc || "N/A"],
  ];

  const handleShareImage = async () => {
    setSharing(true);
    const container = document.createElement("div");
    container.style.width = "600px";
    container.style.padding = "32px";
    container.style.backgroundColor = "#ffffff";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.direction = dir;
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";

    const textAlign = dir === "rtl" ? "right" : "left";
    const oppositeAlign = dir === "rtl" ? "left" : "right";

    container.innerHTML = `
      <h2 style="font-size:22px;margin:0 0 20px;color:#1f2937;text-align:${textAlign};">${owner.name} — ${t.ownerProfile.titleSuffix}</h2>
      ${rows
        .map(
          ([label, value]) => `
        <div style="display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:15px;">
          <span style="color:#6b7280;flex-shrink:0;">${label}</span>
          <span style="color:#111827;font-weight:600;text-align:${oppositeAlign};">${value}</span>
        </div>`,
        )
        .join("")}
      <div style="display:flex;justify-content:space-between;padding:14px 12px;margin-top:12px;background:#f9fafb;border-radius:8px;">
        <span style="color:#6b7280;">${t.ownerProfile.rowBalance}</span>
        <span style="font-weight:700;color:${balance >= 0 ? "#16a34a" : "#dc2626"};">
          ${balance.toLocaleString()} ${t.ownerProfile.rupees}
        </span>
      </div>
    `;

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      document.body.removeChild(container);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast(t.ownerProfile.imageCreateError, "error");
          setSharing(false);
          return;
        }
        await shareOrDownload(blob, `${owner.name}-${locale === "ur" ? "تفصیل" : "details"}.png`, showToast, t);
        setSharing(false);
      }, "image/png");
    } catch (error) {
      console.error("Image creation error:", error);
      showToast(t.ownerProfile.imageCreateErrorRetry, "error");
      document.body.removeChild(container);
      setSharing(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${owner.name} — ${t.ownerProfile.titleSuffix}`}
      footer={
        <div className="flex gap-2 flex-wrap">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-md bg-[#25d366] text-white font-semibold hover:opacity-90"
            >
              {t.ownerProfile.waSendButton}
            </a>
          )}
          <button
            onClick={handleShareImage}
            disabled={sharing}
            className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {sharing ? t.ownerProfile.generatingImage : t.ownerProfile.shareImageButton}
          </button>
        </div>
      }
    >
      <div className="space-y-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4 py-2 border-b border-[var(--color-line)] text-sm">
            <span className="text-[var(--color-ink-soft)] shrink-0">{label}</span>
            <span className="font-medium text-left">{value}</span>
          </div>
        ))}
        <div className="flex justify-between py-2.5 mt-1 bg-[var(--color-paper-alt)] rounded-md px-3">
          <span className="text-[var(--color-ink-soft)]">{t.ownerProfile.rowBalance}</span>
          <span className={`font-ledger font-bold ${balance >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-rust)]"}`}>
            {balance.toLocaleString()} {t.ownerProfile.rupees}
          </span>
        </div>
      </div>
    </Modal>
  );
}
