import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Expense from "@/models/Expense";
import { getUserFromRequest } from "@/lib/auth";
import { getDayName } from "@/lib/types";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function GET(req: NextRequest) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  await connectDB();
  const expenses = await Expense.find({ userId: user.userId }).sort({ createdAt: 1 });
  return NextResponse.json({ expenses });
}

export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { name, amount, date, site } = await req.json();
  if (!name || !amount || !site) {
    return NextResponse.json({ error: t.fillItemAmountSite }, { status: 400 });
  }
  const dateVal = date || new Date().toISOString().split("T")[0];

  await connectDB();
  const expense = await Expense.create({
    userId: user.userId,
    name,
    amount: parseFloat(amount) || 0,
    date: dateVal,
    day: getDayName(dateVal),
    site,
  });
  return NextResponse.json({ expense });
}
