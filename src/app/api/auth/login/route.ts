import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { generateToken } from "@/lib/jwt";
import { AUTH_COOKIE } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: t.fillEmailPassword }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: t.invalidCredentials }, { status: 401 });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ message: t.invalidCredentials }, { status: 401 });
    }

    if (user.status === "pending") {
      return NextResponse.json(
        { message: t.accountPending, reason: "pending" },
        { status: 403 }
      );
    }
    if (user.status === "rejected") {
      return NextResponse.json(
        { message: t.accountRejected, reason: "rejected" },
        { status: 403 }
      );
    }

    const token = generateToken({ userId: user._id.toString(), email: user.email, role: user.role });

    const res = NextResponse.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: t.loginError }, { status: 500 });
  }
}
