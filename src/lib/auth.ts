import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export const AUTH_COOKIE = "token";

export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
}

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  try {
    const decoded = verifyToken(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
