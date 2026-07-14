import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Owner from "@/models/Owner";
import { getUserFromRequest } from "@/lib/auth";
import { getDayName } from "@/lib/types";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { id } = await params;
  const { date, amount, desc } = await req.json();
  if (!date || amount === undefined || isNaN(Number(amount))) {
    return NextResponse.json({ error: t.enterAmount }, { status: 400 });
  }

  await connectDB();
  const owner = await Owner.findOne({ _id: id, userId: user.userId });
  if (!owner) return NextResponse.json({ error: t.ownerNotFound }, { status: 404 });

  owner.history.push({ date, day: getDayName(date), amount: Number(amount), desc: desc || "", type: "deal" });
  await owner.save();

  return NextResponse.json({ owner });
}
