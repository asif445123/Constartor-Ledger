import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
  return transporter;
}

export function isMailerConfigured() {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMail(opts: { to: string; subject: string; html: string; text: string }) {
  const t = getTransporter();
  if (!t) {
    throw new Error("SMTP_USER / SMTP_PASS are not set — email cannot be sent.");
  }
  await t.sendMail({
    from: `"Contractor Ledger" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
