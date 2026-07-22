import crypto from "crypto";

// Reset tokens are valid for 1 hour.
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export function createResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiry = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  return { rawToken, tokenHash, expiry };
}

export function hashResetToken(rawToken: string) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}
