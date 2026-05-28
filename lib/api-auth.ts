import { parse } from "cookie";
import type { VercelRequest } from "@vercel/node";
import { verifyAuthToken } from "./auth.js";

export function getTokenFromRequest(req: VercelRequest) {
  const cookies = parse(req.headers.cookie ?? "");
  return cookies.aisle_token;
}

export function getUserId(req: VercelRequest) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }
  try {
    return verifyAuthToken(token).sub;
  } catch {
    return null;
  }
}
