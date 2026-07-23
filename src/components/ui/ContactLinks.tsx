"use client";

import React, { useState } from "react";
import { buildWhatsAppLink } from "@/lib/contact";
import { useLanguage } from "@/context/LanguageContext";
import ContactFormModal from "@/components/contact/ContactFormModal";

interface ContactLinksProps {
  whatsappMessage?: string;
  variant?: "buttons" | "sidebar" | "navItem";
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.8 14.3c-.24.68-1.4 1.3-1.93 1.36-.5.06-1.02.27-3.4-.71-2.87-1.18-4.72-4.08-4.87-4.27-.14-.19-1.17-1.56-1.17-2.98 0-1.42.75-2.11 1.02-2.4.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.34 1.44.29.15.46.13.63-.07.17-.2.72-.84.91-1.13.19-.29.38-.24.63-.15.26.1 1.65.78 1.94.92.29.15.48.22.55.34.07.13.07.72-.17 1.4Z" />
    </svg>
  );
}

// Full-color envelope (blue body, red flap, yellow fold) — always shows these
// colors regardless of surrounding text color, unlike a currentColor icon.
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" fill="#4285F4" />
      <path d="M2 6.5 12 13l10-6.5V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6.5Z" fill="#FFFFFF" opacity="0.12" />
      <path d="M2.4 5.6 12 12l9.6-6.4A2 2 0 0 0 20 5H4a2 2 0 0 0-1.6.6Z" fill="#EA4335" />
      <path d="M2 6.3 12 13l10-6.7v1.4L12 14.6 2 7.7Z" fill="#FBBC05" />
    </svg>
  );
}

// The Email "link" opens a Contact Us form in a modal instead of navigating
// away — keeps the real address off the page (nothing to scrape) and works
// for every visitor, not just people with a Google account signed in.
export default function ContactLinks({ whatsappMessage, variant = "buttons" }: ContactLinksProps) {
  const { t } = useLanguage();
  const [formOpen, setFormOpen] = useState(false);

  const modal = <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} />;

  if (variant === "navItem") {
    return (
      <>
        <a
          href={buildWhatsAppLink(whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 md:border-transparent text-white/75 hover:bg-white/5 transition"
        >
          <span className="text-[#25d366]"><WhatsAppIcon /></span>
          <span>{t.contact.whatsapp}</span>
        </a>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap border-b border-white/5 md:border-b-0 md:border-r-4 md:border-transparent text-white/75 hover:bg-white/5 transition text-left"
        >
          <MailIcon />
          <span>{t.contact.email}</span>
        </button>
        {modal}
      </>
    );
  }

  if (variant === "sidebar") {
    return (
      <>
        <a
          href={buildWhatsAppLink(whatsappMessage)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-white/60 hover:text-[var(--color-accent)] text-xs"
        >
          <span className="text-[#25D366]"><WhatsAppIcon /></span> {t.contact.whatsapp}
        </a>
        <button
          type="button"
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 text-white/60 hover:text-[var(--color-accent)] text-xs"
        >
          <MailIcon /> {t.contact.email}
        </button>
        {modal}
      </>
    );
  }

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-3">
      <a
        href={buildWhatsAppLink(whatsappMessage)}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25d366] text-white text-sm font-semibold hover:opacity-90"
      >
        <WhatsAppIcon /> {t.contact.whatsapp}
      </a>
      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--color-accent)] text-[var(--color-ink)] text-sm font-semibold hover:opacity-90"
      >
        <MailIcon /> {t.contact.email}
      </button>
      {modal}
    </div>
  );
}
