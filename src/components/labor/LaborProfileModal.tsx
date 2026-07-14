"use client";

import React, { useState } from "react";
import html2canvas from "html2canvas";
import Modal from "@/components/ui/Modal";
import { Labor } from "@/lib/types";
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
      await navigator.share({ files: [file], title: fileName, text: t.laborProfile.shareText });
      showToast(t.laborProfile.shareSuccess, "success");
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
  showToast(t.laborProfile.downloadSuccess, "success");
}

export default function LaborProfileModal({
  open,
  onClose,
  labor,
}: {
  open: boolean;
  onClose: () => void;
  labor: Labor | null;
}) {
  const { showToast } = useToast();
  const { t, locale, dir } = useLanguage();
  const [sharing, setSharing] = useState(false);

  if (!labor) return null;
  const baqaya = labor.rate * labor.att - labor.kharcha;

  const waMessage = t.laborProfile.waMessageTemplate(
    labor.name,
    (labor.rate * labor.att).toLocaleString(),
    labor.kharcha.toLocaleString(),
    baqaya.toLocaleString()
  );
  const waUrl = labor.mobile
    ? `https://wa.me/${labor.mobile}?text=${encodeURIComponent(waMessage)}`
    : null;

  const rows: [string, string][] = [
    [t.laborProfile.rowName, labor.name],
    [t.laborProfile.rowSite, labor.site || t.laborProfile.notEntered],
    [t.laborProfile.rowMobile, labor.mobile || t.laborProfile.notEntered],
    [t.laborProfile.rowRate, `${labor.rate} ${t.laborProfile.rupees}`],
    [t.laborProfile.rowAtt, `${labor.att} ${t.laborProfile.days}`],
    [t.laborProfile.rowWage, `${(labor.rate * labor.att).toLocaleString()} ${t.laborProfile.rupees}`],
    [t.laborProfile.rowKharcha, `${labor.kharcha.toLocaleString()} ${t.laborProfile.rupees}`],
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
      <h2 style="font-size:22px;margin:0 0 20px;color:#1f2937;text-align:${textAlign};">${labor.name} — ${t.laborProfile.titleSuffix}</h2>
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
        <span style="color:#6b7280;">${t.laborProfile.rowBalance}</span>
        <span style="font-weight:700;color:${baqaya >= 0 ? "#16a34a" : "#dc2626"};">
          ${baqaya.toLocaleString()} ${t.laborProfile.rupees}
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
          showToast(t.laborProfile.imageCreateError, "error");
          setSharing(false);
          return;
        }
        await shareOrDownload(blob, `${labor.name}-${locale === "ur" ? "تفصیل" : "details"}.png`, showToast, t);
        setSharing(false);
      }, "image/png");
    } catch (error) {
      console.error("Image creation error:", error);
      showToast(t.laborProfile.imageCreateErrorRetry, "error");
      document.body.removeChild(container);
      setSharing(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${labor.name} — ${t.laborProfile.titleSuffix}`}
      footer={
        <div className="flex gap-2 flex-wrap">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-md bg-[#25d366] text-white font-semibold hover:opacity-90"
            >
              {t.laborProfile.waSendButton}
            </a>
          )}
          <button
            onClick={handleShareImage}
            disabled={sharing}
            className="px-4 py-2 rounded-md bg-[var(--color-accent)] text-white font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {sharing ? t.laborProfile.generatingImage : t.laborProfile.shareImageButton}
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
          <span className="text-[var(--color-ink-soft)]">{t.laborProfile.rowBalance}</span>
          <span className={`font-ledger font-bold ${baqaya >= 0 ? "text-[var(--color-green)]" : "text-[var(--color-rust)]"}`}>
            {baqaya.toLocaleString()} {t.laborProfile.rupees}
          </span>
        </div>
      </div>
    </Modal>
  );
}
