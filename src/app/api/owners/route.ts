import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Owner from "@/models/Owner";
import { getUserFromRequest } from "@/lib/auth";
import { getDayName } from "@/lib/types";
import { getApiMessages } from "@/lib/i18n/apiMessages";

export async function GET(req: NextRequest) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  await connectDB();
  const owners = await Owner.find({ userId: user.userId }).sort({ createdAt: 1 });
  return NextResponse.json({ owners });
}

export async function POST(req: NextRequest) {
  const t = getApiMessages(req);
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: t.loginRequired }, { status: 401 });

  const { name, site, amount, date, desc } = await req.json();
  if (!name || !site) return NextResponse.json({ error: t.fillNameSite }, { status: 400 });

  const dateVal = date || new Date().toISOString().split("T")[0];

  await connectDB();
  const owner = await Owner.create({
    userId: user.userId,
    name,
    site,
    contractTotal: parseFloat(amount) || 0,
    originalContract: parseFloat(amount) || 0,
    received: 0,
    history: [],
    date: dateVal,
    day: getDayName(dateVal),
    desc: desc || "",
  });
  return NextResponse.json({ owner });
}
