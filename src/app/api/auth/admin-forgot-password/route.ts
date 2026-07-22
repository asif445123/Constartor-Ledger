import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { createResetToken } from "@/lib/resetToken";
import { getApiLocale, getApiMessages } from "@/lib/i18n/apiMessages";
import { sendMail, isMailerConfigured } from "@/lib/mailer";
import { buildResetPasswordEmail } from "@/lib/emailTemplates";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://constartor-ledger.onrender.com";

// Same idea as forgot-password, but for the fixed admin account only —
// no email input needed since ADMIN_EMAIL is known server-side.
export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  const locale = getApiLocale(req);
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!adminEmail) {
      return NextResponse.json({ message: t.adminNotConfigured }, { status: 500 });
    }

    await connectDB();
    const user = await User.findOne({ email: adminEmail, role: "admin" });
    if (!user) {
      return NextResponse.json({ message: t.adminNotConfigured }, { status: 500 });
    }

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
        console.error("Failed to send admin reset email:", mailError);
        return NextResponse.json({ message: t.emailSendError }, { status: 500 });
      }
      return NextResponse.json({ message: t.resetEmailSent });
    }

    // Fallback for local/dev setups without SMTP_USER/SMTP_PASS configured yet.
    console.warn("SMTP not configured — admin reset link:", resetLink);
    return NextResponse.json({ message: t.resetLinkGenerated, resetLink });
  } catch (error) {
    console.error("Admin forgot password error:", error);
    return NextResponse.json({ message: t.loginError }, { status: 500 });
  }
}
