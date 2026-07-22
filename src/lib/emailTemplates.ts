import type { ApiLocale } from "./i18n/apiMessages";

export function buildResetPasswordEmail(locale: ApiLocale, resetLink: string) {
  if (locale === "en") {
    return {
      subject: "Reset your Contractor Ledger password",
      text: `We received a request to reset your password. Open this link to set a new one (valid for 1 hour):\n\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#1b2130;">Reset your password</h2>
          <p style="color:#4a4f5e;font-size:15px;">We received a request to reset your Contractor Ledger password. This link is valid for 1 hour.</p>
          <p style="text-align:center;margin:28px 0;">
            <a href="${resetLink}" style="background:#e2a33d;color:#1b2130;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reset Password</a>
          </p>
          <p style="color:#8a8f9e;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
          <p style="color:#8a8f9e;font-size:12px;word-break:break-all;">${resetLink}</p>
        </div>
      `,
    };
  }

  return {
    subject: "ٹھیکیدار رجسٹر — پاسورڈ ری سیٹ کریں",
    text: `آپ کے اکاؤنٹ کے لیے پاسورڈ ری سیٹ کی درخواست موصول ہوئی ہے۔ نیا پاسورڈ سیٹ کرنے کے لیے یہ لنک کھولیں (1 گھنٹے کے لیے موزوں ہے):\n\n${resetLink}\n\nاگر آپ نے یہ درخواست نہیں کی تو اس ای میل کو نظرانداز کریں۔`,
    html: `
      <div dir="rtl" style="font-family:'Noto Nastaliq Urdu',Arial,sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#1b2130;">پاسورڈ ری سیٹ کریں</h2>
        <p style="color:#4a4f5e;font-size:15px;">آپ کے ٹھیکیدار رجسٹر اکاؤنٹ کے لیے پاسورڈ ری سیٹ کی درخواست موصول ہوئی ہے۔ یہ لنک 1 گھنٹے کے لیے موزوں ہے۔</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${resetLink}" style="background:#e2a33d;color:#1b2130;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">پاسورڈ ری سیٹ کریں</a>
        </p>
        <p style="color:#8a8f9e;font-size:13px;">اگر آپ نے یہ درخواست نہیں کی تو اس ای میل کو نظرانداز کریں۔</p>
        <p style="color:#8a8f9e;font-size:12px;word-break:break-all;">${resetLink}</p>
      </div>
    `,
  };
}
