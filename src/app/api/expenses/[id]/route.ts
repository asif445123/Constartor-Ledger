import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Expense from "@/models/Expense";
import { getUserFromRequest } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { id } = await params;
  const patch = await req.json();

  await connectDB();
  const expense = await Expense.findOneAndUpdate({ _id: id, userId: user.userId }, patch, { new: true });
  if (!expense) return NextResponse.json({ error: t.expenseNotFound }, { status: 404 });
  return NextResponse.json({ expense });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { id } = await params;
  await connectDB();
  await Expense.deleteOne({ _id: id, userId: user.userId });
  return NextResponse.json({ ok: true });
}
