// Central place for support contact details — update here if the number/email ever changes.
export const WHATSAPP_NUMBER = "923205501173";
export const CONTACT_EMAIL = "masifrana445@gmail.com";

export function buildWhatsAppLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Opens Gmail's web compose screen in a new tab instead of relying on
// mailto:, which silently does nothing if the visitor has no native mail
// app configured (very common for people who only use Gmail in-browser).
export function buildMailtoLink(subject?: string) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to: CONTACT_EMAIL });
  if (subject) params.set("su", subject);
  return `https://mail.google.com/mail/?${params.toString()}`;
}
