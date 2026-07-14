import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Labor from "@/models/Labor";
import { getUserFromRequest } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function GET(req: NextRequest) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  await connectDB();
  const labors = await Labor.find({ userId: user.userId }).sort({ createdAt: 1 });
  return NextResponse.json({ labors });
}

export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { name, rate, mobile, site } = await req.json();
  if (!name || !rate || !mobile || !site) {
    return NextResponse.json({ error: t.fillDetails }, { status: 400 });
  }

  await connectDB();
  const labor = await Labor.create({
    userId: user.userId,
    name,
    rate: parseFloat(rate) || 0,
    mobile,
    site,
    att: 0,
    kharcha: 0,
    attendance: [],
    expenses: [],
  });
  return NextResponse.json({ labor });
}
