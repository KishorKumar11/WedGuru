import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export const JWT_CONFIG_ERROR =
  "Server misconfigured: JWT_SECRET is not set. Add it under Vercel → Project → Settings → Environment Variables, then redeploy.";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(JWT_CONFIG_ERROR);
  }
  return secret;
}

export function signAuthToken(userId: string) {
  return jwt.sign({ sub: userId }, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as { sub: string };
}

export function authCookie(token: string) {
  return serialize("wedguru_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function clearAuthCookie() {
  return serialize("wedguru_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
