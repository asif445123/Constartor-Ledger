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
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: t.fillNameEmailPassword },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { message: t.passwordTooShort },
        { status: 400 },
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { message: t.emailAlreadyRegistered },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    // The first account matching ADMIN_EMAIL bootstraps as an already-approved admin.
    // Everyone else starts as "pending" and needs an admin to approve them.
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const isBootstrapAdmin = !!adminEmail && email.toLowerCase() === adminEmail;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: isBootstrapAdmin ? "admin" : "user",
      status: isBootstrapAdmin ? "approved" : "pending",
    });

    if (!isBootstrapAdmin) {
      return NextResponse.json(
        {
          message: t.accountCreatedPending,
          pending: true,
        },
        { status: 201 },
      );
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: t.registerError, error },
      { status: 500 },
    );
  }
}
