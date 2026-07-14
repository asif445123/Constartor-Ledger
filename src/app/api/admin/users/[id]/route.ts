import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const t = getApiMessages(req);
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ message: t.loginRequired }, { status: 401 });

  await connectDB();
  const requester = await User.findById(payload.userId);
  if (!requester || requester.role !== "admin") {
    return NextResponse.json({ message: t.forbidden }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();
  if (!["approved", "rejected", "pending"].includes(status)) {
    return NextResponse.json({ message: t.badRequest }, { status: 400 });
  }

  const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select(
    "name email role status createdAt"
  );
  if (!user) return NextResponse.json({ message: t.userNotFound }, { status: 404 });

  return NextResponse.json({ user });
}
