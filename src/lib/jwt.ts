// lib/jwt.ts
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

export function generateToken(payload: object, expiresIn: string = "7d") {
  return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
