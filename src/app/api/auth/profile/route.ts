import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function PATCH(req: NextRequest) {
  const t = getApiMessages(req);
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ message: t.loginRequired }, { status: 401 });

  const { name, email, currentPassword, newPassword } = await req.json();

  if (!name || !email) {
    return NextResponse.json({ message: t.fillNameEmailPassword }, { status: 400 });
  }
  if (newPassword && newPassword.length < 6) {
    return NextResponse.json({ message: t.passwordTooShort }, { status: 400 });
  }
  if (newPassword && !currentPassword) {
    return NextResponse.json({ message: t.currentPasswordRequired }, { status: 400 });
  }

  await connectDB();

  const user = await User.findById(payload.userId);
  if (!user) return NextResponse.json({ message: t.userNotFound }, { status: 404 });

  // Changing email? Make sure nobody else already has it.
  if (email.toLowerCase() !== user.email) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ message: t.emailAlreadyRegistered }, { status: 409 });
    }
  }

  // Changing password requires proving you know the current one.
  if (newPassword) {
    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return NextResponse.json({ message: t.currentPasswordWrong }, { status: 401 });
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  user.name = name;
  user.email = email.toLowerCase();

  try {
    await user.save();
  } catch {
    return NextResponse.json({ message: t.profileUpdateError }, { status: 500 });
  }

  return NextResponse.json({
    message: t.profileUpdated,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}
