import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Labor from "@/models/Labor";
import { getUserFromRequest } from "@/lib/auth";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { id } = await params;
  const patch = await req.json();

  await connectDB();
  const labor = await Labor.findOneAndUpdate({ _id: id, userId: user.userId }, patch, { new: true });
  if (!labor) return NextResponse.json({ error: t.laborNotFound }, { status: 404 });
  return NextResponse.json({ labor });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { id } = await params;
  await connectDB();
  await Labor.deleteOne({ _id: id, userId: user.userId });
  return NextResponse.json({ ok: true });
}
