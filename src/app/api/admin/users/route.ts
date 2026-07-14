import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function GET(req: NextRequest) {
  const t = getApiMessages(req);
  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json({ message: t.loginRequired }, { status: 401 });

  await connectDB();
  const requester = await User.findById(payload.userId);
  if (!requester || requester.role !== "admin") {
    return NextResponse.json({ message: t.forbidden }, { status: 403 });
  }

  const users = await User.find({}).select("name email role status createdAt").sort({ createdAt: -1 });
  return NextResponse.json({ users });
}
