import { NextRequest, NextResponse } from "next/server";
import { getApiMessages } from "@/lib/i18n/apiMessages";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { CONTACT_EMAIL } from "@/lib/contact";

export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ message: t.fillContactFields }, { status: 400 });
    }

    if (!isMailerConfigured()) {
      console.warn("Contact form submitted but SMTP_USER/SMTP_PASS not configured:", { name, email, message });
      return NextResponse.json({ message: t.emailSendError }, { status: 500 });
    }

    const subject = `New message from ${name} — Contractor Ledger`;
    const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#1b2130;">New contact message</h2>
        <p style="color:#4a4f5e;font-size:14px;"><strong>Name:</strong> ${name}</p>
        <p style="color:#4a4f5e;font-size:14px;"><strong>Email:</strong> ${email}</p>
        <p style="color:#4a4f5e;font-size:14px;"><strong>Message:</strong></p>
        <p style="color:#1b2130;font-size:15px;white-space:pre-wrap;background:#f1ead6;padding:12px;border-radius:8px;">${message}</p>
      </div>
    `;

    try {
      await sendMail({ to: CONTACT_EMAIL, subject, html, text });
    } catch (mailError) {
      console.error("Failed to send contact email:", mailError);
      return NextResponse.json({ message: t.emailSendError }, { status: 500 });
    }

    return NextResponse.json({ message: t.contactMessageSent });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ message: t.loginError }, { status: 500 });
  }
}
