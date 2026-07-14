import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Labor from "@/models/Labor";
import { getUserFromRequest } from "@/lib/auth";
import { getDayName } from "@/lib/types";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { id } = await params;
  const { date, amount, note } = await req.json();
  if (!date || amount === undefined || isNaN(Number(amount))) {
    return NextResponse.json({ error: t.fillDetails }, { status: 400 });
  }

  await connectDB();
  const labor = await Labor.findOne({ _id: id, userId: user.userId });
  if (!labor) return NextResponse.json({ error: t.laborNotFound }, { status: 404 });

  labor.expenses.push({ date, day: getDayName(date), amount: Number(amount), note: note || "N/A" });
  labor.kharcha += Number(amount);
  await labor.save();

  return NextResponse.json({ labor });
}
