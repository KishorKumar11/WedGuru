import { parse } from "cookie";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAuthToken } from "../lib/auth.js";

export function sendJson(res: VercelResponse, status: number, payload: unknown) {
  res.status(status).json(payload);
}

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
