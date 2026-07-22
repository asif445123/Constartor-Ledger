import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { createResetToken } from "@/lib/resetToken";
import { getApiLocale, getApiMessages } from "@/lib/i18n/apiMessages";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { buildResetPasswordEmail } from "@/lib/emailTemplates";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://constartor-ledger.onrender.com";

export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  const locale = getApiLocale(req);
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: t.enterEmail }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always behave the same whether or not the email exists, so a caller
    // can't use this endpoint to discover which emails are registered.
    if (user) {
      const { rawToken, tokenHash, expiry } = createResetToken();
      user.resetTokenHash = tokenHash;
      user.resetTokenExpiry = expiry;
      await user.save();

      const resetLink = `${siteUrl}/reset-password?token=${rawToken}`;

      if (isMailerConfigured()) {
        try {
          const { subject, html, text } = buildResetPasswordEmail(locale, resetLink);
          await sendMail({ to: user.email, subject, html, text });
        } catch (mailError) {
          console.error("Failed to send reset email:", mailError);
          return NextResponse.json({ message: t.emailSendError }, { status: 500 });
        }
      } else {
        // Fallback for local/dev setups without SMTP_USER/SMTP_PASS configured yet.
        console.warn("SMTP not configured — reset link:", resetLink);
        return NextResponse.json({ message: t.resetLinkGenerated, resetLink });
      }
    }

    return NextResponse.json({ message: t.resetEmailSent });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: t.loginError }, { status: 500 });
  }
}
