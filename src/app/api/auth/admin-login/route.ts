import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { AUTH_COOKIE } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

const SHORT_SESSION_SECONDS = 60 * 60 * 24;
const REMEMBER_ME_SECONDS = 60 * 60 * 24 * 30;

// Password-only login for the single admin account defined by ADMIN_EMAIL.
// No email field is exposed to the client — the address never leaves the server.
export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  try {
    const { password, rememberMe } = await req.json();
    if (!password) {
      return NextResponse.json({ message: t.passwordRequired }, { status: 400 });
    }

    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!adminEmail) {
      return NextResponse.json({ message: t.adminNotConfigured }, { status: 500 });
    }

    await connectDB();

    const user = await User.findOne({ email: adminEmail, role: "admin" });
    if (!user) {
      return NextResponse.json({ message: t.invalidCredentials }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ message: t.invalidCredentials }, { status: 401 });
    }

    const maxAge = rememberMe ? REMEMBER_ME_SECONDS : SHORT_SESSION_SECONDS;
    const token = generateToken(
      { userId: user._id.toString(), email: user.email, role: user.role },
      rememberMe ? "30d" : "1d"
    );

    const res = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ message: t.loginError }, { status: 500 });
  }
}
