import { serialize } from "cookie";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET missing");
}
const JWT_SECRET: string = jwtSecret;

export function signAuthToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
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
