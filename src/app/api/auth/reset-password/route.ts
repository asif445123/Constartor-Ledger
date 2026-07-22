import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { hashResetToken } from "@/lib/resetToken";
import { getApiMessages } from "@/lib/i18n/apiMessages";

// Shared by both the regular user flow and the admin flow — a valid,
// unexpired token is all that's needed, regardless of which page issued it.
export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ message: t.passwordRequired }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: t.passwordTooShort }, { status: 400 });
    }

    await connectDB();
    const tokenHash = hashResetToken(token);

    const user = await User.findOne({
      resetTokenHash: tokenHash,
      resetTokenExpiry: { $gt: new Date() },
    }).select("+resetTokenHash +resetTokenExpiry");

    if (!user) {
      return NextResponse.json({ message: t.tokenInvalidOrExpired }, { status: 400 });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetTokenHash = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: t.passwordResetSuccess });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: t.loginError }, { status: 500 });
  }
}
